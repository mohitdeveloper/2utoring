using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using StandingOut.Shared.Integrations.Stripe;
using StandingOut.Data.Enums;
using StandingOut.Shared.Helpers.AzureFileHelper;
using StandingOut.Shared.Mapping;
using StandingOut.Data.DTO;
using Twilio.Rest.Trunking.V1;
using StandingOut.Data.Models;


namespace StandingOutStore.Business.Services
{
    public class StripeService : IStripeService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISettingService settingService;
        private readonly IAzureFileHelper _AzureFileHelper;
        private bool _Disposed;

        public StripeService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager,
            ISettingService settingService)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _UserManager = userManager;
            this.settingService = settingService;
            _AppSettings = appSettings.Value;
        }

        public StripeService(IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings.Value;
        }

        public StripeService(IUnitOfWork unitOfWork, AppSettings appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }
        public async Task<Stripe.Coupon> ValidatePromoCode(string promoCode)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            try
            {
                using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
                {
                    var coupon = await stripeHelper.GetCoupon(promoCode);
                    return coupon != null && coupon.Valid ? coupon : null;
                }
            }
            catch { return null; /* 500 from Stripe on invalid coupon (message - No such Coupon) */ }
        }

        public async Task<Stripe.PaymentMethod> GetPaymentMethodByCustomer(string stripeCustomerId)
        {
            // Only having 1 per customer
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
            using var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId);
            return (await stripeHelper.GetPaymentMethods(stripeCustomerId)).FirstOrDefault();
        }

        public async Task DeletePaymentMethodByCustomer(string stripeCustomerId)
        {
            // Only having 1 per customer
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
            using var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId);
            var paymentMethods = await stripeHelper.GetPaymentMethods(stripeCustomerId);
            foreach (var paymentMethod in paymentMethods)
                await stripeHelper.DeletePaymentMethod(stripeCustomerId, paymentMethod.Id);
        }

        /// <summary>
        /// Sets up the Payment Intent for the Session attendee
        /// </summary>
        /// <param name="user"></param>
        /// <param name="model"></param>
        /// <param name="standingOutCut"></param>
        /// <returns></returns>
        public async Task<DTO.PaymentResponse> ConfirmSessionPayment(Models.User user, DTO.Payment model, decimal standingOutCut)
        {
            throw new NotImplementedException("Deprecated.. Use StripeController ConfirmBasketPayment flow");
            //var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
            //using var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId);
            //DTO.PaymentResponse response = null;
            //Stripe.PaymentIntent paymentIntent = null;
            //Models.ClassSession classSession = null;
            //Models.PromoCode promoCode = null;
            //if (string.IsNullOrEmpty(model.PaymentIntentId))
            //{
            //    Stripe.PaymentMethod paymentMethod = null;
            //    if (string.IsNullOrEmpty(user.StripeCustomerId))
            //    {
            //        var customer = await stripeHelper.CreateCustomer(model.CardName, user.Email, model.PaymentMethodId);
            //        user.StripeCustomerId = customer.Id;
            //        await _UserManager.UpdateAsync(user);
            //        paymentMethod = (await stripeHelper.GetPaymentMethods(user.StripeCustomerId)).First();
            //    }
            //    else if (!string.IsNullOrEmpty(model.PaymentMethodId))
            //    {
            //        // Just make sure payment methods are cleared first before trying to add another (in case same card is added again)
            //        var paymentMethods = await stripeHelper.GetPaymentMethods(user.StripeCustomerId);
            //        foreach (var item in paymentMethods)
            //            await stripeHelper.DeletePaymentMethod(user.StripeCustomerId, item.Id);
            //        paymentMethod = await stripeHelper.CreatePaymentMethod(user.StripeCustomerId, model.PaymentMethodId);
            //    }
            //    else
            //        paymentMethod = (await stripeHelper.GetPaymentMethods(user.StripeCustomerId)).First();

            //    classSession = await _UnitOfWork.Repository<Models.ClassSession>()
            //        .GetQueryable(x => x.ClassSessionId == model.ClassSessionId && !x.Owner.IsDeleted &&
            //        (x.Owner.Tutor.ProfileApprovalStatus == TutorApprovalStatus.Approved
            //        ||
            //        x.Owner.Tutor.ProfileApprovalStatus == TutorApprovalStatus.NotRequired)
            //            , includeProperties: "Owner, Owner.Tutor, SessionAttendees")
            //        .AsNoTracking().FirstAsync();

            //    if (classSession == null)
            //        throw new DTO.PaymentException("It looks like this lesson has been removed. Not to worry though, there's plenty more excellent sessions to choose from!");

            //    // TODO: All this validation has to be done before submission of Basket of Courses.
            //    // CHECK THAT THIS USER IS ALLOWED TO ACCESS THIS LESSON - This should ONLY be triggered if the user has attempted to get around the front end safeguards
            //    if (!user.DateOfBirth.HasValue || (classSession.IsUnder16 && user.DateOfBirth.Value.AddYears(19) < DateTime.UtcNow))
            //        throw new DTO.SafeguardingException("User (" + user.Id + ") attempted to access a underage lesson");
            //    else if (!classSession.IsUnder16 && user.DateOfBirth.Value.AddYears(17) > DateTime.UtcNow)
            //        throw new DTO.SafeguardingException("User (" + user.Id + ") attempted to access a overage lesson");

            //    if (classSession.SessionAttendees.Any(x => x.UserId == user.Id && !x.IsDeleted && !x.Refunded && !x.Removed))
            //        throw new DTO.PaymentException("You've already signed up to this lesson!");

            //    if (classSession.SessionAttendees.Count(x => !x.IsDeleted && !x.Refunded && !x.Removed) >= classSession.MaxPersons)
            //        throw new DTO.PaymentException("It looks like this lesson has filled up. Not to worry though, there's plenty more excellent sessions to choose from!");

            //    decimal amount = classSession.PricePerPerson; // This is automatically set at course creation.
            //    if (model.PromoCode.HasValue)
            //    {
            //        promoCode = await _UnitOfWork.Repository<Models.PromoCode>()
            //            .GetQueryable(x => x.PromoCodeId == model.PromoCode)
            //            .AsNoTracking().FirstOrDefaultAsync();
            //        if (promoCode == null)
            //            throw new DTO.PaymentException("Promo code is no longer valid");
            //        else
            //        {
            //            if (promoCode.MaxUses.HasValue)
            //            {
            //                var promoCodeUses = await _UnitOfWork.Repository<Models.SessionAttendee>()
            //                    .GetCount(x => x.PromoCodeId == promoCode.PromoCodeId);
            //                if (promoCode.MaxUses.Value <= promoCodeUses)
            //                    throw new DTO.PaymentException("Promo code is no longer valid");
            //            }
            //            if (promoCode.Type == PromoCodeType.AmountOff && promoCode.AmountOff.HasValue)
            //                amount -= promoCode.AmountOff.Value;
            //            else if (promoCode.Type == PromoCodeType.PercentageOff && promoCode.PercentOff.HasValue)
            //                amount -= (amount * (promoCode.PercentOff.Value / 100));
            //            else
            //                throw new DTO.PaymentException("Promo code is no longer valid");
            //            if (amount < 0)
            //                amount = 0;
            //        }
            //    }

            //    // NOTHING to Pay.. Are we still creating the order then..??
            //    if (amount <= 0.000001m || (amount - standingOutCut <= 0.000001m))
            //    {
            //        return new DTO.PaymentResponse()
            //        {
            //            RequiresAction = false,
            //            ClassSessionId = classSession.ClassSessionId,
            //            PromoCodeId = promoCode?.PromoCodeId,
            //            IntentClientSecret = null,
            //            PaymentIntentId = null,
            //        };
            //    }

            //    // decimal percentage = settings.BaseClassSessionCommision, standingOutCut = 0m;
            //    //standingOutCut = ((amount / 100m) * percentage); 

            //    // NOTE: Payment intent has 2 amounts passed to it - 2nd param = amount (PricePerPerson) 
            //    // and last param = transferAmount.
            //    // At point of PayoutWorker, it seems the TransferAmount is applied to pay the tutor automatically

            //    // using metadata here so the classSession matched against the payment intent can't be modified during 3d secure process
            //    paymentIntent = await stripeHelper.CreatePaymentIntent(paymentMethod.Id, amount,
            //        user.StripeCustomerId,
            //        metadata: new Dictionary<string, string>(new List<KeyValuePair<string, string>>()
            //        {
            //            new KeyValuePair<string, string>("classSessionId", model.ClassSessionId.ToString()),
            //            new KeyValuePair<string, string>("classSessionName", classSession.Name),
            //            new KeyValuePair<string, string>("promoCodeId", model.PromoCode.HasValue ? model.PromoCode.Value.ToString() : null)
            //        }), false, true, classSession.Owner.TutorId.Value.ToString(),
            //        classSession.Owner.Tutor.StripeConnectAccountId, // ISSUE: If this is null(Payout not setup), the TransferData is not setup on the PaymentIntent, attendee will never get picked at Payout run (SO will do manual payouts for those lesson sales)
            //        decimal.Round(amount - standingOutCut, 2)
            //    );
            //}
            //else
            //    paymentIntent = await stripeHelper.GetPaymentIntent(model.PaymentIntentId);

            //if (paymentIntent.Status == "requires_confirmation")
            //    paymentIntent = await stripeHelper.ConfirmPaymentIntent(paymentIntent.Id);

            //response = BuildPaymentResponse(model, paymentIntent);
            //if (response.RequiresAction)
            //    return response;

            //if (classSession == null)
            //{
            //    // This will be used on second pass to ensure the correct session is being paid for
            //    // TODO: Metadata to be OrderId instead of sessionId
            //    if (paymentIntent.Metadata.TryGetValue("classSessionId", out string classSessionId))
            //        response.ClassSessionId = new Guid(classSessionId);
            //    else
            //        response.ClassSessionId = model.ClassSessionId;
            //}
            //else
            //    response.ClassSessionId = model.ClassSessionId;

            //if (promoCode == null && paymentIntent.Metadata.TryGetValue("promoCodeId", out string promoCodeId))
            //{
            //    if (!string.IsNullOrEmpty(promoCodeId))
            //        promoCode = await _UnitOfWork.Repository<Models.PromoCode>()
            //            .GetQueryable(x => x.PromoCodeId == new Guid(promoCodeId))
            //            .AsNoTracking().FirstOrDefaultAsync();
            //}
            //if (promoCode != null)
            //    response.PromoCodeId = promoCode.PromoCodeId;

            //return response;
        }

        public async Task<DTO.PaymentResponse> ConfirmOrderPayment(User user, Order newOrder, BasketDto basket,Models.StripeCountry stripeCountry)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
            using var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId);

            DTO.PaymentResponse response = null;
            Stripe.PaymentIntent paymentIntent = null;
            Models.PromoCode promoCode = null;
            Stripe.PaymentMethod paymentMethod = null;

            var paymentModel = basket.Payment;

            if (!string.IsNullOrEmpty(paymentModel.PaymentIntentId))
            {
                paymentIntent = await stripeHelper.GetPaymentIntent(paymentModel.PaymentIntentId);
            }
            else
            {
                paymentMethod = await EnsureCustomerPaymentMethodSetup(stripeHelper, user, paymentModel);

                decimal amount = newOrder.AmountCharged.Value;

                // If NOTHING to Pay.. we still consider payment successful. But do not have PaymentIntentId
                if (amount <= 0.0001m)
                {
                    return new DTO.PaymentResponse()
                    {
                        PaymentSucceeded = true,
                        RequiresAction = false,
                        OrderId = newOrder.OrderId,
                        PromoCodeId = promoCode?.PromoCodeId,
                        IntentClientSecret = null,
                        PaymentIntentId = null // if nothing to pay, there wont be a Payment attempted and no Stripe PaymentIntentId generated
                        // Payments cannot be less than $0.50, TBC how to handle this..
                    };
                }

                // using metadata here so the classSession matched against the payment intent can't be modified during 3d secure process
                paymentIntent = await stripeHelper.CreatePaymentIntent(
                    paymentMethod.Id,
                    amount,
                    stripeCountry,
                    user.StripeCustomerId,
                    metadata: new Dictionary<string, string>(new List<KeyValuePair<string, string>>()
                    {
                        new KeyValuePair<string, string>("orderId", newOrder.OrderId.ToString()),
                        new KeyValuePair<string, string>("userId", user.Id),
                        new KeyValuePair<string, string>("userEmail", user.Email),
                        new KeyValuePair<string, string>("promoCodeId", paymentModel.PromoCode.HasValue ? paymentModel.PromoCode.Value.ToString() : null)
                    }), false, true, newOrder.OrderId.ToString());
            }

            if (paymentIntent.Status == "requires_confirmation")
                paymentIntent = await stripeHelper.ConfirmPaymentIntent(paymentIntent.Id);

            response = BuildPaymentResponse(paymentModel, paymentIntent);
            if (response.RequiresAction)
                return response;

            if (basket.OrderId == null)
            {
                // This will be used on second pass to ensure the correct session is being paid for
                if (paymentIntent.Metadata.TryGetValue("orderId", out string orderId))
                    response.OrderId = new Guid(orderId);
                else
                    response.OrderId = newOrder.OrderId;
            }
            else
                response.OrderId = basket.OrderId;

            //if (promoCode == null && paymentIntent.Metadata.TryGetValue("promoCodeId", out string promoCodeId))
            //{
            //    if (!string.IsNullOrEmpty(promoCodeId))
            //        promoCode = await _UnitOfWork.Repository<Models.PromoCode>()
            //            .GetQueryable(x => x.PromoCodeId == new Guid(promoCodeId))
            //            .AsNoTracking().FirstOrDefaultAsync();
            //}
            //if (promoCode != null)
            //    response.PromoCodeId = promoCode.PromoCodeId;

            return response;
        }

        private async Task<Stripe.PaymentMethod> EnsureCustomerPaymentMethodSetup(IStripeHelper stripeHelper, User user, Payment paymentModel)
        {
            Stripe.PaymentMethod paymentMethod;
            if (string.IsNullOrEmpty(user.StripeCustomerId))
            {
                var customer = await stripeHelper.CreateCustomer(paymentModel.CardName, user.Email, paymentModel.PaymentMethodId);
                user.StripeCustomerId = customer.Id;
                await _UserManager.UpdateAsync(user);
                paymentMethod = (await stripeHelper.GetPaymentMethods(user.StripeCustomerId)).First();
            }
            else if (!string.IsNullOrEmpty(paymentModel.PaymentMethodId))
            {
                // Just make sure payment methods are cleared first before trying to add another (in case same card is added again)
                var paymentMethods = await stripeHelper.GetPaymentMethods(user.StripeCustomerId);
                foreach (var item in paymentMethods)
                    await stripeHelper.DeletePaymentMethod(user.StripeCustomerId, item.Id);
                paymentMethod = await stripeHelper.CreatePaymentMethod(user.StripeCustomerId, paymentModel.PaymentMethodId);
            }
            else
                paymentMethod = (await stripeHelper.GetPaymentMethods(user.StripeCustomerId)).First();

            return paymentMethod;
        }

        private DTO.PaymentResponse BuildPaymentResponse(DTO.Payment model, Stripe.PaymentIntent intent)
        {
            if (intent.Status == "requires_action" && intent.NextAction?.Type == "use_stripe_sdk")
            {
                return new DTO.PaymentResponse()
                {
                    RequiresAction = true,
                    PaymentIntentId = intent.Id,
                    IntentClientSecret = intent.ClientSecret,
                    PaymentMethodId = intent.PaymentMethodId,
                };
                //model.StripeCustomerId = stripeCustomerId;
            }
            else if (intent.Status == "succeeded")
            {
                return new DTO.PaymentResponse()
                {
                    PaymentSucceeded = true,

                    RequiresAction = false,
                    PaymentIntentId = intent.Id,
                    IntentClientSecret = intent.ClientSecret,
                    PaymentMethodId = intent.PaymentMethodId,
                };
                //model.StripeCustomerId = stripeCustomerId;
            }
            else
            {
                throw new Exception("Invalid PaymentIntent status");
            }
        }

        public async Task<DTO.StripeCard> ConnectPaymentMethod(Models.User user, DTO.PaymentCardConnect model)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
            using var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId);
            Stripe.PaymentMethod paymentMethod = null;
            if(model.UserType=="Student")
            {
                user.StripeCountryID = model.stripeCountryId;
                await _UserManager.UpdateAsync(user);
            }
            
            if (string.IsNullOrEmpty(user.StripeCustomerId))
            {
                var customer = await stripeHelper.CreateCustomer(model.CardName, user.Email, model.PaymentMethodId);
                user.StripeCustomerId = customer.Id;
                await _UserManager.UpdateAsync(user);
                paymentMethod = (await stripeHelper.GetPaymentMethods(user.StripeCustomerId)).First();
            }
            else
            {
                // Just make sure payment methods are cleared first before trying to add another (in case same card is added again)
                var paymentMethods = await stripeHelper.GetPaymentMethods(user.StripeCustomerId);
                foreach (var item in paymentMethods)
                    await stripeHelper.DeletePaymentMethod(user.StripeCustomerId, item.Id);
                paymentMethod = await stripeHelper.CreatePaymentMethod(user.StripeCustomerId, model.PaymentMethodId);
            }
            return Mappings.Mapper.Map<Stripe.PaymentMethod, DTO.StripeCard>(paymentMethod);
        }

        public async Task<DTO.StripePagedList<DTO.ReceiptIndex>> GetPagedReceipts(DTO.StripeSearch model, Models.User user)
        {
            if (string.IsNullOrEmpty(user.StripeCustomerId))
                return new DTO.StripePagedList<DTO.ReceiptIndex>()
                {
                    Data = new List<DTO.ReceiptIndex>(),
                    Paged = new DTO.StripePaged() { Page = 1, Take = model.Take, HasMore = false }
                };
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
            using var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId);

            // Get all Receipt items pertaining to me. (so we can look at SessionAttendees)
            var stripeResult = await stripeHelper.GetPaymentIntents(user.StripeCustomerId, model.Take, model.EndingBeforeId, model.StartingAfterId);

            var result = new DTO.StripePagedList<DTO.ReceiptIndex>();
            result.Paged.Page = model.StartingAfterId != null ? ++model.Page : (model.EndingBeforeId != null ? --model.Page : 1);
            result.Paged.Take = model.Take;
            result.Paged.HasMore = model.EndingBeforeId != null ? true : stripeResult.HasMore;
            var receipts = stripeResult.Data;
            var receiptIds = stripeResult.Data.Select(x => x.Id).ToList();

            //change by wizcraft 16-04-2021 for CurrencySymbol
            var paidAttendees = await _UnitOfWork.Repository<Models.SessionAttendee>()
                .Get(x => x.OrderId != null && receiptIds.Contains(x.OrderItem.Order.PaymentProviderFields.ReceiptId),
                    includeProperties: "OrderItem, OrderItem.Order, OrderItem.Order.PaymentProviderFields, ClassSession.Owner.StripeCountry, AttendeeRefund");

            result.Data = Mappings.Mapper.Map<List<Models.SessionAttendee>, List<DTO.ReceiptIndex>>(paidAttendees);

            foreach (var receiptItem in result.Data)
            {
                receiptItem.Created = receipts.FirstOrDefault(x => x.Id == receiptItem.Id)?.Created ?? DateTime.MinValue;
                receiptItem.Currency = receipts.FirstOrDefault(x => x.Id == receiptItem.Id)?.Currency ?? receiptItem.StripeCountry.CurrencyCode;
                receiptItem.Status = receipts.FirstOrDefault(x => x.Id == receiptItem.Id)?.Status;
                if (string.IsNullOrEmpty(receiptItem.Status)) receiptItem.Status = "Unknown";
                
            }

            // Receipt is at course level now.. since you buy courses not lessons
            // if (result.Data.Any()) await PopulateLessonInfo(result.Data, user);

            return result;
        }

        private async Task PopulateLessonInfo(List<DTO.ReceiptIndex> resultData, Models.User user)
        {
            throw new NotImplementedException("todo refactor to split receipts to lesson level");
            var paymentIntentIds = resultData.Select(x => x.Id);

            var sessionAttendees = await _UnitOfWork.Repository<Models.SessionAttendee>()
                .GetQueryable(x => x.UserId == user.Id && paymentIntentIds.Contains(x.Order.PaymentProviderFields.ReceiptId),
                    includeProperties: "ClassSession, Order, Order.PaymentProviderFields")
                .AsNoTracking()
                .Distinct().ToListAsync();

            // TODO refactor mapping
            if (sessionAttendees.Any())
            {
                resultData.AsParallel().ForAll(receipt =>
                {
                    if (sessionAttendees.Any(x => x.Order.PaymentProviderFields.ReceiptId == receipt.Id))
                    {
                        //receipt.LessonStartDate = sessionAttendees. StartDate.DateTime;
                        //receipt.ClassSessionId = sessionAttendees[receipt.Id].ClassSessionId;
                        //receipt.SessionAttendeeId = sessionAttendees[receipt.Id].SessionAttendeeId;
                        //receipt.Refunded = sessionAttendees[receipt.Id].Refunded;
                    }
                });
            }
        }
        public async Task<Models.Setting> GetSetting()
        {
            return await _UnitOfWork.Repository<Models.Setting>().GetSingle();
        }
        public async Task<string> GetStripeConnectOAuthLink(Models.Tutor tutor, Models.User user)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
            if (user.StripeCountry == null)
            {
                var stripeCountry = await _UnitOfWork.Repository<Models.StripeCountry>().GetByID(user.StripeCountryID);
                user.StripeCountry = stripeCountry;
            }
            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var redirectLink = await stripeHelper.GenerateStripeConnectOAuth(_AppSettings.MainSiteUrl + "/tutor/settings/payoutOAuth", tutor, user);
                return redirectLink;
            }
        }
        //StripeConnect For Company
        public async Task<string> GetStripeConnectOAuthLink(Models.Company company, Models.User user)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
            if (user.StripeCountry == null)
            {
                var stripeCountry = await _UnitOfWork.Repository<Models.StripeCountry>().GetByID(user.StripeCountryID);
                user.StripeCountry = stripeCountry;
            }

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var redirectLink = await stripeHelper.GenerateStripeConnectOAuth(_AppSettings.MainSiteUrl + "/admin/settings/payoutOAuth", company, user);
                return redirectLink;
            }
        }

        public async Task<(Models.Tutor tutor, bool success)> AuthenticateStripeConnectResponse(Models.Tutor tutor, string code)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var token = await stripeHelper.AuthenticateStripeConnectResponse(code);

                if (token != null)
                {
                    tutor.StripeConnectAccountId = token.StripeUserId;

                    try
                    {
                        var bankAccounts = await stripeHelper.GetAccountsBankAccounts(tutor);

                        if (bankAccounts != null && bankAccounts.Count() > 0)
                        {
                            tutor.StripeConnectBankAccountId = bankAccounts[0].Id;
                        }
                    }
                    catch (Exception ex)
                    {
                        //failed to get bank account, not the end of the world
                        string err = ex.Message;
                    }

                    var updateOptions = new Stripe.AccountUpdateOptions()
                    {
                        Settings = new Stripe.AccountSettingsOptions
                        {
                            Payouts = new Stripe.AccountSettingsPayoutsOptions
                            {
                                DebitNegativeBalances = true,
                                Schedule = new Stripe.AccountSettingsPayoutsScheduleOptions
                                {
                                    Interval = "manual",
                                }
                            }
                        }
                    };
                    await stripeHelper.UpdateAccount(tutor, updateOptions);

                    await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
                    return (tutor, true);
                }
                else
                {
                    return (tutor, false);
                }
            }
        }

        //Authenticate Stripe Connect For Company
        public async Task<(Models.Company company, bool success)> AuthenticateStripeConnectResponse(Models.Company company, string code)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var token = await stripeHelper.AuthenticateStripeConnectResponse(code);

                if (token != null)
                {
                    company.StripeConnectAccountId = token.StripeUserId;

                    try
                    {
                        var bankAccounts = await stripeHelper.GetAccountsBankAccounts(company);

                        if (bankAccounts != null && bankAccounts.Count() > 0)
                        {
                            company.StripeConnectBankAccountId = bankAccounts[0].Id;
                        }
                    }
                    catch (Exception ex)
                    {
                        //failed to get bank account, not the end of the world
                        string err = ex.Message;
                    }

                    var updateOptions = new Stripe.AccountUpdateOptions()
                    {
                        Settings = new Stripe.AccountSettingsOptions
                        {
                            Payouts = new Stripe.AccountSettingsPayoutsOptions
                            {
                                DebitNegativeBalances = true,
                                Schedule = new Stripe.AccountSettingsPayoutsScheduleOptions
                                {
                                    Interval = "manual",
                                }
                            }
                        }
                    };
                    await stripeHelper.UpdateAccount(company, updateOptions);

                    await _UnitOfWork.Repository<Models.Company>().Update(company);
                    return (company, true);
                }
                else
                {
                    return (company, false);
                }
            }
        }

        public async Task<List<Stripe.BankAccount>> GetBankAccounts(Models.Tutor tutor)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var bankAccounts = await stripeHelper.GetAccountsBankAccounts(tutor);
                return bankAccounts;
            }
        }
        //Get Bank Account For Comapny
        public async Task<List<Stripe.BankAccount>> GetBankAccounts(Models.Company company)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var bankAccounts = await stripeHelper.GetAccountsBankAccounts(company);
                return bankAccounts;
            }
        }

        public async Task<string> GetLoginLink(Models.Tutor tutor)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var redirectLink = await stripeHelper.GenerateLoginLink(tutor);
                return redirectLink.Url;
            }
        }

        public async Task<string> GetLoginLink(Models.Company company)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var redirectLink = await stripeHelper.GenerateLoginLink(company);
                return redirectLink.Url;
            }
        }

        /// <summary>
        /// Seems this pays the "Transfer Amount" i.e last Param of CreatePaymentIntent (PricePerPerson - StandingOutCut) 
        /// TODO Refactor /reimplement sepr as payout is based on VendorTransfer
        /// </summary>
        /// <param name="settings"></param>
        /// <param name="tutor"></param>
        /// <param name="attendee"></param>
        /// <returns></returns>
        public async Task<(decimal amount, Stripe.Payout payout)> ApproveTransfer(Models.Setting settings, Models.Tutor tutor, Models.SessionAttendee attendee)
        {
            throw new NotImplementedException("Implementation to be changed to payout from VendorEarnings per Lesson");
            //using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            //{
            //    var transfer = await stripeHelper.GetTransfer(attendee.TutorStripeTransferId);

            //    var payoutCreateOptions = new Stripe.PayoutCreateOptions()
            //    {
            //        Currency = transfer.Currency,
            //        Amount = transfer.Amount, // This will be £7 if a 1 person lesson costed £10 and had 30% commission
            //        Description = $"Payout for {attendee.TutorStripeTransferId}", // TODO better description Payout for Course - Lesson - DateEnded
            //        Destination = tutor.StripeConnectBankAccountId
            //    };

            //    var payout = await stripeHelper.CreatePayout(tutor, payoutCreateOptions);

            //    return (transfer.Amount, payout);
            //}
        }

        public async Task<(decimal amount, Stripe.Payout payout)> DoPayout(string StripeKey, decimal amountInPounds,
            Models.ClassSession session,
            string vendorConnectionAccountId,
            string vendorDestinationBankAccountId
            )
        {
            //var settings = await settingService.Get();
            #region Old Code
            //using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            //{
            //    var payoutCreateOptions = new Stripe.PayoutCreateOptions()
            //    {
            //        Currency = currency,
            //        Amount = (long)amountInPounds * 100,
            //        Description = $"Payout for Lesson:{session.Name}, on ended {session.EndDate:f}", // better description for Payout = Lesson - DateEnded
            //        Destination = vendorDestinationBankAccountId
            //    };

            //    var payout = await stripeHelper.CreatePayout(vendorConnectionAccountId, payoutCreateOptions);

            //    return (amountInPounds, payout);
            //} 
            #endregion
            #region New Working wizcraft 20-02-2021
            //Stripe.StripeConfiguration.ApiKey = settings.StripeKey;
            Stripe.StripeConfiguration.ApiKey = StripeKey;
            var services = new Stripe.PayoutService();
            /*var payout = await services.CreateAsync(
                new Stripe.PayoutCreateOptions { Amount = (long)(amountInPounds * 100), Currency = "GBP" },
                new Stripe.RequestOptions { StripeAccount = vendorConnectionAccountId }
                );*/

            //change by wizcraft 16-04-2021
            var payout = await services.CreateAsync(
               new Stripe.PayoutCreateOptions { Amount = (long)(amountInPounds * session.Owner.StripeCountry.DecimalMultiplier), Currency = session.Owner.StripeCountry.CurrencyCode},
               new Stripe.RequestOptions { StripeAccount = vendorConnectionAccountId }
               );


            return (amountInPounds, payout);
            #endregion
        }

        public async Task<Stripe.Balance> GetBalance(Models.Setting settings, Models.Tutor tutor)
        {
            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                return await stripeHelper.GetBalance(tutor);
            }
        }
        public async Task<Stripe.Balance> GetBalance(Models.Setting settings, string stripeConnectAccountId)
        {
            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                return await stripeHelper.GetBalance(stripeConnectAccountId);
            }
        }
       



    }
}

