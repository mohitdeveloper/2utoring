using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StandingOut.Data.DTO;
using StandingOut.Data.Enums;
using Models = StandingOut.Data.Models;
using StandingOutStore.Business.Services.Interfaces;

namespace StandingOut.Service.Workers
{
    public class PayoutWorker : BackgroundService
    {
        private readonly ILogger<PayoutWorker> _logger;
        private readonly IStripeService _StripeService;
        private readonly IClassSessionService _ClassSessionService;
        private readonly IVendorEarningService vendorEarningService;
        private readonly IVendorPayoutService vendorPayoutService;
        private readonly ITutorService _TutorService;
        private readonly ISettingService _SettingService;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly DateTimeOffset _StartTime;
        private readonly int _Interval;
        Models.Setting settings = null;

        public PayoutWorker(ILogger<PayoutWorker> logger, IStripeService stripeService, IClassSessionService classSessionService,
            ITutorService tutorService, ISettingService settingService, ISessionAttendeeService sessionAttendeeService,
            IVendorEarningService vendorEarningService, IVendorPayoutService vendorPayoutService)
        {
            _logger = logger;
            _StartTime = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day, 3, 0, 0);
            _StartTime = _StartTime.AddDays(1);
            _Interval = Convert.ToInt32(ServiceUtilities.CalculateRunInterval(0, 0, 24));
            //_Interval = Convert.ToInt32(ServiceUtilities.CalculateRunInterval(0, 3, 0));


            _StripeService = stripeService;
            _ClassSessionService = classSessionService;
            _TutorService = tutorService;
            _SettingService = settingService;
            _SessionAttendeeService = sessionAttendeeService;
            this.vendorEarningService = vendorEarningService;
            this.vendorPayoutService = vendorPayoutService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            int interval = 1000;

            while (!stoppingToken.IsCancellationRequested)
            {

                //check if you can run
                if (ServiceUtilities.CanRun(_StartTime))
                {
                    interval = _Interval;
                    await EventLogger.LogMessage("", _logger, $"PayoutWorker running at: {DateTimeOffset.Now.ToString("dd/MM/yyyy hh:mm")}", System.Diagnostics.EventLogEntryType.Information);
                    settings = await _SettingService.Get();
                    try
                    {
                        DateTimeOffset endDateFilter = DateTimeOffset.UtcNow.Date; // Payout run date of 10th Jan means pick lessons which ended on 9th Jan
                        DateTimeOffset paymentDateFilter = DateTimeOffset.UtcNow.Date.AddDays(-7); // Payout run date of 10th Jan means pick enrolments/orders created before 3rd Jan are picked, not after that., This is due to Manual payout setup in Stripe on 7 day rolling basis.
                        var earningsToPayout = await vendorEarningService.GetVendorEarningsEligibleForPayout(endDateFilter, paymentDateFilter);
                        await DoPayoutAsync(stoppingToken, earningsToPayout);
                    }
                    catch (Exception payoutErrorEx)
                    {
                        _logger.LogError(payoutErrorEx, payoutErrorEx.Message);

                        string message = $"Message: {payoutErrorEx.Message} - Stack Trace: {payoutErrorEx.StackTrace}";

                        if (payoutErrorEx.InnerException != null)
                        {
                            message += $" - Inner Message: {payoutErrorEx.InnerException.Message} - Inner Stack Trace: {payoutErrorEx.InnerException.StackTrace}";
                        }

                        throw payoutErrorEx; //break out because something went wrong, io need to know Logger deals with this.
                    }
                }
                //this must always be at the bottom
                await Task.Delay(interval, stoppingToken);
            }
        }

        private async Task DoPayoutAsync(CancellationToken stoppingToken, List<Models.VendorEarning> vendorEarnings)
        {
            try
            {
                var listOfTutors = vendorEarnings.Where(x => x.TutorId.HasValue).Select(x => x.TutorId).Distinct();
                var listOfCompanies = vendorEarnings.Where(x => x.CompanyId.HasValue).Select(x => x.CompanyId).Distinct();

                await ProcessTutorPayouts(stoppingToken, listOfTutors, vendorEarnings);
                await ProcessCompanyPayouts(stoppingToken, listOfCompanies, vendorEarnings);
                await EventLogger.LogMessage("", _logger, $"PayoutWorker completed at: {DateTimeOffset.Now.ToString("dd/MM/yyyy hh:mm")}", System.Diagnostics.EventLogEntryType.Information);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        }

        private async Task ProcessCompanyPayouts(CancellationToken stoppingToken, IEnumerable<Guid?> listOfCompanies, List<Models.VendorEarning> vendorEarnings)
        {
            foreach (var companyId in listOfCompanies)
            {
                if (stoppingToken.IsCancellationRequested) return;

                var company = vendorEarnings.FirstOrDefault(x => x.CompanyId != null && x.CompanyId == companyId).Company;
                var companyLessons = vendorEarnings.Where(x => x.CompanyId.HasValue && x.CompanyId == companyId)
                        .Select(x => x.ClassSession).ToList();
                if (!string.IsNullOrEmpty(company.StripeConnectAccountId) && !string.IsNullOrEmpty(company.StripeConnectBankAccountId))
                {
                    var vendor = new Vendor
                    {
                        VendorId = companyId.Value,
                        VendorType = VendorType.Company,
                        StripeConnectAccountId = company.StripeConnectAccountId,
                        StripeConnectBankAccountId = company.StripeConnectBankAccountId
                    };
                    await ProcessPayoutsForVendorLessons(stoppingToken, vendor, companyLessons, vendorEarnings);
                }
            }
        }

        private async Task ProcessTutorPayouts(CancellationToken stoppingToken, IEnumerable<Guid?> listOfTutors, List<Models.VendorEarning> vendorEarnings)
        {
            foreach (var tutorId in listOfTutors)
            {
                var tutor = vendorEarnings.FirstOrDefault(x => x.TutorId != null && x.CompanyId == null && x.TutorId.Value == tutorId).Tutor;
                var tutorLessons = vendorEarnings.Where(x => x.TutorId.HasValue && x.CompanyId == null && x.TutorId.Value == tutorId)
                        .Select(x => x.ClassSession).ToList();
                if (!string.IsNullOrEmpty(tutor.StripeConnectAccountId) && !string.IsNullOrEmpty(tutor.StripeConnectBankAccountId))
                {
                    var vendor = new Vendor
                    {
                        VendorId = tutor.TutorId,
                        VendorType = VendorType.Tutor,
                        StripeConnectAccountId = tutor.StripeConnectAccountId,
                        StripeConnectBankAccountId = tutor.StripeConnectBankAccountId
                    };
                    await ProcessPayoutsForVendorLessons(stoppingToken, vendor, tutorLessons, vendorEarnings);
                }
            }
        }
        private async Task ProcessPayoutsForVendorLessons(CancellationToken stoppingToken, Vendor vendor, List<Models.ClassSession> lessons, List<Models.VendorEarning> vendorEarnings)
        {
            foreach (var lesson in lessons)
            {
                if (stoppingToken.IsCancellationRequested) return;

                var earningsToPayout = vendorEarnings.Where(x => x.ClassSessionId == lesson.ClassSessionId && !x.VendorPayoutId.HasValue).ToList();
                var totalAmount = earningsToPayout.Sum(x => x.EarningAmount);
                if (earningsToPayout.Count > 0)
                {
                    var payoutDetails = await DoLessonPayout(vendor, lesson, totalAmount);
                    if (payoutDetails.Item2 != null)
                    {
                        if (string.IsNullOrWhiteSpace(payoutDetails.Item2.FailureCode))
                        {
                            decimal finalAmount = 0m;
                            if (payoutDetails.Item2.Amount > 0)
                            {
                                //finalAmount = Convert.ToDecimal(payoutDetails.Item2.Amount) / 100;
                                finalAmount = Convert.ToDecimal(payoutDetails.Item2.Amount) / lesson.Owner.StripeCountry.DecimalMultiplier; //change by wizcraft 16-04-2021
                            }

                            var vendorPayout = new Models.VendorPayout
                            {
                                PaymentDate = DateTime.UtcNow,
                                AmountPaid = finalAmount,
                                PaymentProviderFieldSet = new Models.PaymentProviderFieldSet
                                {
                                    PaymentProvider = PaymentProvider.Stripe,
                                    VendorPayoutId = payoutDetails.Item2.Id,
                                }
                            };
                            if (vendor.VendorType == VendorType.Tutor)
                                vendorPayout.TutorId = vendor.VendorId;
                            else
                                vendorPayout.CompanyId = vendor.VendorId;

                            var payoutRecord = await vendorPayoutService.Create(vendorPayout);

                            earningsToPayout.ForEach(x => x.VendorPayoutId = payoutRecord.VendorPayoutId);
                            await vendorEarningService.Update(earningsToPayout);
                        }
                        else
                        {
                            // Notify of failure..
                            _logger.LogError(new ApplicationException($"ProcessPayoutsForVendorLessons payout for SessionId:{lesson.ClassSessionId}, amount: {totalAmount}, failure code: {payoutDetails.Item2.FailureCode}"), payoutDetails.Item2.FailureCode);
                        }
                    }
                }
            }
        }

        private async Task<(decimal amount, Stripe.Payout)> DoLessonPayout(Vendor vendor, Models.ClassSession lesson, decimal totalAmount)
        {
            var balance = await _StripeService.GetBalance(settings, vendor.StripeConnectAccountId);
            decimal totalAvailable = balance.Available.Sum(o => o.Amount);

            //if (totalAmount * 100m <= totalAvailable)
            if (totalAmount * lesson.Owner.StripeCountry.DecimalMultiplier <= totalAvailable)//change by wizcraft 16-04-2021
            {
                var payoutResult = await _StripeService.DoPayout(settings.StripeKey, totalAmount, lesson, vendor.StripeConnectAccountId, vendor.StripeConnectBankAccountId);
                return payoutResult;
            }

            return (totalAmount, null);
        }
    }
}
