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
using Mapping = StandingOut.Shared.Mapping;
using System.Linq.Dynamic.Core;
using System.Data;
using Dapper;
using StandingOut.Data.Models;
using StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services
{
    public class SessionAttendeeService : ISessionAttendeeService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IDbConnection _Connection;
        private readonly ISettingService _SettingService;
        private bool _Disposed;

        const decimal STUDENT_INITIATED_CANCELLATION_CHARGE = 1;
        //const int AMOUNT_TO_CENT_MULTIPLIER = 100;//change by wizcraft 16-04-2021

        public SessionAttendeeService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, ISettingService settingService,
            UserManager<Models.User> userManager, IDbConnection connection)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _Connection = connection;
            _SettingService = settingService;
        }
        public SessionAttendeeService(IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings, IDbConnection connection)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings.Value;
            _Connection = connection;
        }

        public SessionAttendeeService(IUnitOfWork unitOfWork, AppSettings appSettings)
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
        public async Task<DTO.PagedList<DTO.SessionAttendee>> GetPaged(DTO.SearchModel model, Guid? classSessionId = null)
        {
            IQueryable<Models.SessionAttendee> data = _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable();

            if (classSessionId.HasValue)
            {
                data = data.Where(o => o.ClassSessionId == classSessionId);
            }

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => (o.FirstName != null && o.LastName != null && (o.FirstName + " " + o.LastName).ToLower().Contains(search)));
            }

            var result = new DTO.PagedList<DTO.SessionAttendee>();

            System.Reflection.PropertyInfo prop = typeof(Models.ClassSession).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {
                if (model.SortType == "FullName")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.FirstName + o.LastName) : data.OrderByDescending(o => o.FirstName + o.LastName);
                }
                else if (model.SortType == "Status")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.Refunded == false && o.Removed == false) : data.OrderByDescending(o => o.Refunded == false && o.Removed == false);
                }
            }

            result.Data = Mapping.Mappings.Mapper.Map<List<Models.SessionAttendee>, List<DTO.SessionAttendee>>(await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;

            return result;
        }

        public async Task<List<DTO.StudentSession>> GetStudentSessions(string id, string tutorUserId, Guid? companyId = null)
        {
            if (!string.IsNullOrEmpty(tutorUserId))
            {
                return await _UnitOfWork.Repository<Models.SessionAttendee>()
                    .GetQueryable(x => x.UserId == id && x.ClassSession.OwnerId == tutorUserId, includeProperties: "ClassSession, ClassSession.SessionAttendees, ClassSession.Owner")
                    .OrderByDescending(x => x.ClassSession.StartDate)
                    .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.StudentSession>(x)).ToListAsync();
            }
            else if (companyId != null && companyId != Guid.Empty)
            {
                return await _UnitOfWork.Repository<Models.SessionAttendee>()
                    .GetQueryable(x => x.UserId == id && x.ClassSession.Course.CompanyId == companyId, includeProperties: "ClassSession, ClassSession.SessionAttendees, ClassSession.Owner")
                    .OrderByDescending(x => x.ClassSession.StartDate)
                    .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.StudentSession>(x)).ToListAsync();
            }
            else
            {
                return await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.UserId == id, includeProperties: "ClassSession, ClassSession.SessionAttendees, ClassSession.Owner").OrderByDescending(x => x.ClassSession.StartDate)
                    .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.StudentSession>(x)).ToListAsync();
            }
        }

        public async Task<List<Models.SessionAttendee>> GetUniqueByOwner(string id, Guid couresId)
        {
            var result = new List<Models.SessionAttendee>();
            var sessionAttendees = await _UnitOfWork.Repository<Models.SessionAttendee>().Get(x => x.ClassSession.OwnerId == id);
            var sessionInvitees = await _UnitOfWork.Repository<Models.SessionInvite>().Get(o => o.ClassSession.CourseId == couresId);
            foreach (var sessionAttendee in sessionAttendees)
            {
                if (result.FirstOrDefault(o => o.UserId == sessionAttendee.UserId) == null)
                {
                    if (!sessionInvitees.Exists(x => x.Email == sessionAttendee.Email))
                    {
                        result.Add(sessionAttendee);
                    }
                }
            }
            return result;
        }

        /// <summary>
        /// DEPRECATED DONT CALL This.. Populates the payment Intent on Attendee with the Payment Intent created using ConfirmSessionPayment 
        /// Also sets the TransferId for Tutor Payout
        /// </summary>
        /// <param name="payment"></param>
        /// <param name="user"></param>
        /// <param name="standingOutCut"></param>
        /// <returns></returns>
        public async Task<Models.SessionAttendee> Create(DTO.PaymentResponse payment, Models.User user, decimal standingOutCut)
        {
            throw new NotImplementedException("Deprecated.. Use StripeController ConfirmBasketPayment flow");
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();

            //using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            //{
            //    decimal amountCharged = 0m; //, percentage = 0m, standingOutCut = 0m;
            //    //percentage = settings.BaseClassSessionCommision; 30.00
            //    string transferId = "";

            //    // TODO: The amounts to be paid to the tutor, have to be noted against a lesson as they get paid when lesson ends.  But calc these later on session end.
            //    if (!string.IsNullOrWhiteSpace(payment.PaymentIntentId))
            //    {
            //        var intent = await stripeHelper.GetPaymentIntent(payment.PaymentIntentId);

            //        if (intent.Amount.HasValue) // in Pence
            //        {
            //            amountCharged = intent.Amount.Value / 100m; // in Pounds 
            //            //standingOutCut = ((amountCharged / 100m) * percentage); // in Pounds

            //            var charge = intent.Charges.First();
            //            transferId = charge.TransferId; // Important for Payout to transfer Tutors amount using this TransferId
            //        }
            //    }


            //    var classSession = await _UnitOfWork.Repository<Models.ClassSession>()
            //       .GetQueryable(x => x.ClassSessionId == payment.ClassSessionId, includeProperties: "ClassSession, ClassSession.Owner")
            //       .AsNoTracking()
            //       .Select(x => new DTO.ClassSessionEmailDto
            //       {
            //           TutorFirstName = x.Owner.FirstName,
            //           TutorLastName = x.Owner.LastName,
            //           TutorEmail = x.Owner.Email,
            //           LessonName = x.Name,
            //           LessonStartDate = x.StartDate,
            //           LessonPrice = x.PricePerPerson
            //       })
            //       .FirstAsync();
            //    var sessionAttendee = new Models.SessionAttendee()
            //    {
            //        UserId = user.Id,
            //        ClassSessionId = payment.ClassSessionId.Value,
            //        //PaymentIntentId = payment.PaymentIntentId, // Trace it back from the Order
            //        PromoCodeId = payment.PromoCodeId,
            //        Email = user.Email,
            //        FirstName = user.FirstName,
            //        LastName = user.LastName,
            //        SessionAttendeeDirectoryName = $"{CapitalizeAndSlugify(user.FirstName)} {CapitalizeAndSlugify(user.LastName)}, {CapitalizeAndSlugify(classSession.LessonName)}, {classSession.LessonStartDate.ToString("h tt, dd-MM-y").ToLower()}",

            //        AmountCharged = amountCharged, // Full/Discounted lesson price e.g £10
            //        StandingOutPercentageCut = 0m, // percentage e.g 30 (n/a in tiered commission)
            //        StandingOutActualCut = standingOutCut, // in pounds 
            //        //TutorStripeTransferId = transferId // For a £10 lesson the TransferId refers to the Tutor payable amount processed in PayoutWorker
            //        // Trace TransferId to the VendorEarningId
            //    };
            //    await _UnitOfWork.Repository<Models.SessionAttendee>().Insert(sessionAttendee);

            //    // ADD IN FOLDER CREATION HERE IF TIME -> Will do it on session entry anyway
            //    //if (student != null)
            //    //{
            //    //    try
            //    //    {
            //    //        var sessionDetails = await _GoogleHelper.CreateSessionAttendeeDirectory(student, data, model);
            //    //        data.SessionAttendeeDirectoryId = sessionDetails.StudentFolders.Count > 0 ? sessionDetails.StudentFolders.First().Id : null;
            //    //    }
            //    //    catch (Exception ex)
            //    //    {
            //    //        // User hasn't given the correct permissions - Directory creation will be attempted again on session start
            //    //    }
            //    //}

            //    try
            //    {
            //        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
            //            System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\StudentParentReceipt.html"),
            //            new Dictionary<string, string>()
            //            {
            //                { "{{siteUrl}}", _AppSettings.MainSiteUrl },
            //                { "{{userFullName}}", user.IsParent ? (user.ParentFirstName + " " + user.ParentLastName) : (user.FirstName + " " + user.LastName) },
            //                { "{{tutorFullName}}", classSession.TutorFirstName + " " + classSession.TutorLastName },
            //                { "{{lessonName}}", classSession.LessonName },
            //                { "{{lessonStartDate}}", TimeZoneInfo.ConvertTimeFromUtc(classSession.LessonStartDate.UtcDateTime, TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time")).ToString("d/M/yyyy h:mm tt").ToLower() },
            //                { "{{lessonPrice}}", "�" + classSession.LessonPrice.ToString("#.##") },
            //            }, user.ContactEmail, settings.SendGridFromEmail, $"Thank you for signing up to {classSession.LessonName}");
            //    }
            //    catch { }

            //try
            //{
            //    string studentFullName = user.FirstName + " " + user.LastName;
            //    await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
            //        System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\TutorStudentSignedUpLesson.html"),
            //        new Dictionary<string, string>()
            //        {
            //                { "{{siteUrl}}", _AppSettings.MainSiteUrl },
            //                { "{{studentFullName}}", studentFullName },
            //                { "{{tutorFullName}}", classSession.TutorFirstName + " " + classSession.TutorLastName },
            //                { "{{lessonName}}", classSession.LessonName },
            //                { "{{lessonStartDate}}", TimeZoneInfo.ConvertTimeFromUtc(classSession.LessonStartDate.UtcDateTime, TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time")).ToString("d/M/yyyy h:mm tt").ToLower() },
            //                { "{{lessonPrice}}", "�" + classSession.LessonPrice.ToString("#.##") },
            //                { "{{classSessionId}}", payment.ClassSessionId.ToString() }
            //        }, classSession.TutorEmail, settings.SendGridFromEmail, studentFullName+$" has signed up to your lesson");
            //}
            //catch { }

            //    return sessionAttendee;
            //}
        }

        public static string CapitalizeAndSlugify(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;
            text = Utilities.StringUtilities.Slugify(text[0].ToString() + (text.Length > 1 ? text.Substring(1) : string.Empty));
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;
            return text;
        }

        public async Task Remove(Guid classSessionId, Guid sessionAttendeeId, bool sendEmail = true)
        {
            var sessionAttendee = await _UnitOfWork.Repository<Models.SessionAttendee>()
                .GetSingle(o => o.ClassSessionId == classSessionId && o.SessionAttendeeId == sessionAttendeeId, includeProperties: "User");

            sessionAttendee.Removed = true;
            sessionAttendee.RemovedDate = DateTime.Now;
            sessionAttendee.RemovedBy = _HttpContext.HttpContext.User.Identity.Name;

            await _UnitOfWork.Repository<Models.SessionAttendee>().Update(sessionAttendee);

            if (sendEmail)
            {
                try
                {
                    //change by wizcraft 16-04-2021 for CurrencySymbol
                    var classSession = await _UnitOfWork.Repository<Models.ClassSession>()
                    .GetQueryable(o => o.ClassSessionId == classSessionId, includeProperties: "ClassSession, ClassSession.Owner.StripeCountry")
                    .AsNoTracking()
                    .Select(x => new DTO.ClassSessionEmailDto
                    {
                        TutorFirstName = x.Owner.FirstName,
                        TutorLastName = x.Owner.LastName,
                        LessonName = x.Name,
                        LessonStartDate = x.StartDate,
                        LessonPrice = x.PricePerPerson,
                        CurrencySymbol=x.Owner.StripeCountry.CurrencySymbol
                    })
                    .FirstAsync();

                    var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
                    await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                        System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\SessionAttendeeRemoved.html"),
                        new Dictionary<string, string>()
                        {
                        { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{userFullName}}", sessionAttendee.User.IsParent ? (sessionAttendee.User.ParentFirstName + " " + sessionAttendee.User.ParentLastName) : (sessionAttendee.User.FirstName + " " + sessionAttendee.User.LastName) },
                        { "{{tutorFullName}}", classSession.TutorFirstName + " " + classSession.TutorLastName },
                        { "{{lessonName}}", classSession.LessonName },
                        { "{{lessonStartDate}}", TimeZoneInfo.ConvertTimeFromUtc(classSession.LessonStartDate.UtcDateTime, TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time")).ToString("d/M/yyyy h:mm tt").ToLower() },
                        { "{{lessonPrice}}", classSession.CurrencySymbol + classSession.LessonPrice.ToString("#.##") },
                        }, sessionAttendee.User.ContactEmail, settings.SendGridFromEmail, $"You have been removed from the register for the {classSession.LessonName} lesson");
                }
                catch { }
            }
        }

        public async Task UndoRemove(Guid classSessionId, Guid sessionAttendeeId)
        {
            var sessionAttendee = await _UnitOfWork.Repository<Models.SessionAttendee>()
                .GetSingle(o => o.ClassSessionId == classSessionId && o.SessionAttendeeId == sessionAttendeeId, includeProperties: "User");

            sessionAttendee.Removed = false;

            await _UnitOfWork.Repository<Models.SessionAttendee>().Update(sessionAttendee);

            try
            {
                //change by wizcraft 16-04-2021 for CurrencySymbol
                var classSession = await _UnitOfWork.Repository<Models.ClassSession>()
                .GetQueryable(o => o.ClassSessionId == classSessionId, includeProperties: "ClassSession, ClassSession.Owner.StripeCountry")
                .AsNoTracking()
                .Select(x => new DTO.ClassSessionEmailDto
                {
                    TutorFirstName = x.Owner.FirstName,
                    TutorLastName = x.Owner.LastName,
                    LessonName = x.Name,
                    LessonStartDate = x.StartDate,
                    LessonPrice = x.PricePerPerson,
                    CurrencySymbol = x.Owner.StripeCountry.CurrencySymbol
                }).FirstAsync();

                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\SessionAttendeeReinstated.html"),
                    new Dictionary<string, string>()
                    {
                        { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{userFullName}}", sessionAttendee.User.IsParent ? (sessionAttendee.User.ParentFirstName + " " + sessionAttendee.User.ParentLastName) : (sessionAttendee.User.FirstName + " " + sessionAttendee.User.LastName) },
                        { "{{tutorFullName}}", classSession.TutorFirstName + " " + classSession.TutorLastName },
                        { "{{lessonName}}", classSession.LessonName },
                        { "{{lessonStartDate}}", TimeZoneInfo.ConvertTimeFromUtc(classSession.LessonStartDate.UtcDateTime, TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time")).ToString("d/M/yyyy h:mm tt").ToLower() },
                        { "{{lessonPrice}}", classSession.CurrencySymbol + classSession.LessonPrice.ToString("#.##") },
                    }, sessionAttendee.User.ContactEmail, settings.SendGridFromEmail, $"You have been added back to the register for the {classSession.LessonName} lesson");
            }
            catch { }
        }

        public async Task<bool> Refund(Guid classSessionId, Guid sessionAttendeeId, bool studentInitiated = false)
        {
            try
            {
                //return await Task.FromResult(false);

                var sessionAttendee = await _UnitOfWork.Repository<Models.SessionAttendee>()
                .GetSingle(o => o.ClassSessionId == classSessionId && o.SessionAttendeeId == sessionAttendeeId,
                includeProperties: "User.StripeCountry, AttendeeRefund, VendorEarning, Order, Order.PaymentProviderFields, ClassSession, ClassSession.Course");
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();

                if (sessionAttendee.VendorEarning?.VendorPayoutId != null || sessionAttendee.Refunded)
                {
                    return false;
                }
                var stripCountry = sessionAttendee.User.StripeCountry;
                var refundedAmount = (sessionAttendee.AmountCharged >= STUDENT_INITIATED_CANCELLATION_CHARGE && studentInitiated) ?  (sessionAttendee.AmountCharged - STUDENT_INITIATED_CANCELLATION_CHARGE) : sessionAttendee.AmountCharged;
                //decimal refundedAmount = sessionAttendee.AmountCharged;
                if (stripCountry.SupportedPayout == false)
                {
                    var setting = await _SettingService.Get();
                    refundedAmount = refundedAmount - ((refundedAmount * setting.ConversionPercent) / 100) - setting.ConversionFlat;
                }
                
                Stripe.Refund stripeRefund = null;
                using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
                {
                    var paymentIntentId = sessionAttendee.Order?.PaymentProviderFields?.ReceiptId;
                    if (!string.IsNullOrEmpty(paymentIntentId))
                    {
                        
                        //stripeRefund = await stripeHelper.RefundPaymentIntent(paymentIntentId, (long)refundedAmount * AMOUNT_TO_CENT_MULTIPLIER);
                        stripeRefund = await stripeHelper.RefundPaymentIntent(paymentIntentId, (long)(refundedAmount * stripCountry.DecimalMultiplier));//change by wizcraft 16-04-2021

                        if (sessionAttendee.VendorEarningId != null)
                        {
                            sessionAttendee.VendorEarning.IsDeleted = true;
                            await _UnitOfWork.Repository<Models.VendorEarning>().Update(sessionAttendee.VendorEarning);
                        }
                    }
                }

                sessionAttendee.Refunded = true;
                var refundRecord = new OrderRefund
                {
                    Amount = refundedAmount,
                    Deduction = STUDENT_INITIATED_CANCELLATION_CHARGE,

                    OrderId = sessionAttendee?.OrderId.Value ?? Guid.Empty,
                    PaymentProviderFields = new PaymentProviderFieldSet { UserRefundId = stripeRefund?.Id ?? string.Empty },
                    IsRefundUserInitiated = studentInitiated,
                    CreatedBy = _HttpContext.HttpContext.User.Identity.Name,
                    CreatedDate = DateTime.UtcNow,
                    RefundProcessingStatus = RefundProcessingStatus.Paid,
                    RefundProcessingNote = $"Refund for {sessionAttendee.FirstName} {sessionAttendee.LastName} Course: {sessionAttendee.ClassSession.Course.Name} Lesson: {sessionAttendee.ClassSession.Name} on date: {sessionAttendee.ClassSession.StartDate:G} for amount: {refundedAmount}, deduction: {STUDENT_INITIATED_CANCELLATION_CHARGE}, RefundId: {stripeRefund.Id}"
                };
                sessionAttendee.AttendeeRefund = refundRecord;

                //sessionAttendee.IsDeleted = true;
                //change by wizcraft 16-04-2021 for CurrencySymbol
                await _UnitOfWork.Repository<Models.SessionAttendee>().Update(sessionAttendee);
                var classSessionEmailDto = await _UnitOfWork.Repository<Models.ClassSession>()
                .GetQueryable(o => o.ClassSessionId == classSessionId, includeProperties: "ClassSession, ClassSession.Owner.StripeCountry")
                .AsNoTracking()
                .Select(x => new DTO.ClassSessionEmailDto
                {
                    TutorFirstName = x.Owner.FirstName,
                    TutorLastName = x.Owner.LastName,
                    LessonName = x.Name,
                    LessonStartDate = x.StartDate,
                    LessonPrice = x.PricePerPerson,
                    CurrencySymbol=x.Owner.StripeCountry.CurrencySymbol
                })
                .FirstAsync();

                if (studentInitiated) await SendStudentCancelledEmail(settings, sessionAttendee, classSessionEmailDto);
                else await SendLessonCancelledEmail(settings, sessionAttendee, classSessionEmailDto);
            }
            catch {
                return false;
            }
            return true;
        }

        private async Task SendStudentCancelledEmail(Models.Setting settings,
            Models.SessionAttendee sessionAttendee, DTO.ClassSessionEmailDto classSessionEmailDto)
        {
            if (sessionAttendee.AttendeeRefund == null) return;

            var amountRefunded = sessionAttendee.AttendeeRefund.Amount.Value;

            await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\StudentCancelledLesson.html"),
                new Dictionary<string, string>()
                {
                    { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                    { "{{userFullName}}", sessionAttendee.User.IsParent ? (sessionAttendee.User.ParentFirstName + " " + sessionAttendee.User.ParentLastName) : (sessionAttendee.User.FirstName + " " + sessionAttendee.User.LastName) },
                    { "{{tutorFullName}}", classSessionEmailDto.TutorFirstName + " " + classSessionEmailDto.TutorLastName },
                    { "{{lessonName}}", classSessionEmailDto.LessonName },
                    { "{{lessonStartDate}}", TimeZoneInfo.ConvertTimeFromUtc(classSessionEmailDto.LessonStartDate.UtcDateTime, TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time")).ToString("d/M/yyyy h:mm tt").ToLower() },
                    { "{{refundedAmount}}", classSessionEmailDto.CurrencySymbol + amountRefunded.ToString("#.##") },
                    { "{{lessonPrice}}", classSessionEmailDto.CurrencySymbol + classSessionEmailDto.LessonPrice.ToString("#.##") },
                }, sessionAttendee.User.ContactEmail, settings.SendGridFromEmail, $"Your {classSessionEmailDto.LessonName} lesson has been cancelled on 2utoring");
        }

        private async Task SendLessonCancelledEmail(Models.Setting settings,
            Models.SessionAttendee sessionAttendee, DTO.ClassSessionEmailDto classSessionEmailDto)
        {
            await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\LessonCancelled.html"),
                new Dictionary<string, string>()
                {
                    { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                    { "{{userFullName}}", sessionAttendee.User.IsParent ? (sessionAttendee.User.ParentFirstName + " " + sessionAttendee.User.ParentLastName) : (sessionAttendee.User.FirstName + " " + sessionAttendee.User.LastName) },
                    { "{{tutorFullName}}", classSessionEmailDto.TutorFirstName + " " + classSessionEmailDto.TutorLastName },
                    { "{{lessonName}}", classSessionEmailDto.LessonName },
                    { "{{lessonStartDate}}", TimeZoneInfo.ConvertTimeFromUtc(classSessionEmailDto.LessonStartDate.UtcDateTime, TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time")).ToString("d/M/yyyy h:mm tt").ToLower() },
                    { "{{lessonPrice}}", classSessionEmailDto.CurrencySymbol + classSessionEmailDto.LessonPrice.ToString("#.##") },
                }, sessionAttendee.User.Email, settings.SendGridFromEmail, $"{classSessionEmailDto.LessonName} has been cancelled on 2utoring");
        }

        /// <summary>
        /// DEPRECATED 
        /// Implementated to get Lesson-Orders awaiting credit to Vendor (on Lesson End)
        /// </summary>
        /// <param name="tutorId"></param>
        /// <param name="endDateFilter"></param>
        /// <param name="paymentDateFilter"></param>
        /// <returns></returns>
        public async Task<List<Models.SessionAttendee>> GetAttendeesAwaitingPaymentTransfer(Guid tutorId, DateTimeOffset endDateFilter, DateTimeOffset paymentDateFilter)
        {
            /*
             * note: there is a 7 day pending window for a transfer hence the double date filter.
             * we do not want to process someones payment early as we wont be transfering someone elses 
             * funds which should have gone already,
             * this results in last minute attendees not transfering to the tutor for 7 days.
             * see: https://stripe.com/docs/connect/account-balances
             */
            return null;

            return await _UnitOfWork.Repository<Models.SessionAttendee>()
                .GetQueryable(o => o.ClassSession.Complete == true &&
                o.ClassSession.Owner.TutorId == tutorId && o.ClassSession.EndDate < endDateFilter
            && //o.TutorPaid == TutorPaymentStatus.Pending && 
            o.AmountCharged > 0 && o.CreatedDate < paymentDateFilter && o.Refunded == false
            //&& o.TutorStripeTransferId != null && o.TutorStripeTransferId != ""
            ).AsNoTracking().ToListAsync();
            return null;
        }

        public async Task UpdateSessionAttendeeTransferDetails(Guid id, string payoutId, int status, string error)
        {
            await _Connection.ExecuteAsync("UPDATE SessionAttendees " +
                "SET TutorStripePayoutId = @tutorStripePayoutId, TutorPaid = @tutorPaid, StripePayoutError = @stripePayoutError  " +
                "WHERE SessionAttendeeId = @sessionAttendeeId",
                new { tutorStripePayoutId = payoutId, tutorPaid = status, stripePayoutError = error, sessionAttendeeId = id });
        }

        public async Task<int> GetSessionAttendeesCountByUser(string id)
        {
            var count = await _UnitOfWork.Repository<Models.SessionAttendee>().GetCount(o => o.UserId == id && o.IsDeleted == false);
            return count;
        }

        public async Task<List<DTO.SessionAttendeeFileUploader>> GetForFileUpload(Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && x.Removed == false && x.Refunded == false, includeProperties: "User")
                .Select(x => StandingOut.Shared.Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.SessionAttendeeFileUploader>(x))
                .ToListAsync();
        }

        public async Task<List<Models.SessionAttendee>> GetByClassSession(Guid classSessionId)
        {
            var excludeDeletedItems = false;
            return await _UnitOfWork.Repository<Models.SessionAttendee>().Get(o => o.ClassSessionId == classSessionId, includeGlobalFilter: excludeDeletedItems);
        }
        /// <summary>
        /// Gets a count of Attendees for the tutor's lessons in last 30 days (exclude current session)
        /// Commission is tiered based on this count.
        /// </summary>
        /// <param name="tutorId"></param>
        /// <returns></returns>
        public async Task<int> GetAttendeesCountInLast30Days(Guid tutorId, Guid classSessionIdToExclude)
        {
            var attendeesInLast30Days = await _UnitOfWork.Repository<Models.SessionAttendee>()
                    .Get(o => o.ClassSession.Ended &&
                        o.ClassSession.EndDate >= DateTime.Now.AddDays(-30) &&
                        o.ClassSession.Course.TutorId == tutorId &&
                        o.ClassSessionId != classSessionIdToExclude && // Exclude the specified sessionId
                        //o.Attended &&
                        !o.Removed && !o.IsDeleted && !o.Refunded, includeProperties: "ClassSession, ClassSession.Course");
            return attendeesInLast30Days.ToList().Count;
        }
        public async Task<int> GetTotalMinutesIn30Days(Guid tutorId, Guid classSessionIdToExclude)
        {
            int totalMinutes = 0;
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>()
                .Get(
                x => x.Course.TutorId == tutorId
                && x.EndDate.UtcDateTime >= DateTime.Now.AddDays(-30).ToUniversalTime()
                && x.ClassSessionId != classSessionIdToExclude
                && x.Ended
                );
            foreach (var item in classSession)
            {
                totalMinutes = totalMinutes + (int)Math.Round(item.EndDate.Subtract(item.StartDate).TotalMinutes);
            }

            return totalMinutes;
        }
        public async Task<decimal> CalcStandingOutCut(Models.ClassSession classSession, Guid tutorId, List<CommissionPerStudentTier> commissionPerStudentTiers)
        {
            #region Old Code

            //var attendees = await GetByClassSession(classSession.ClassSessionId);
            //var activeAttendees = attendees.Where(x => !x.IsDeleted && !x.Refunded && !x.Removed).ToList();
            var attendeeCountInLast30Days = await GetAttendeesCountInLast30Days(tutorId, classSession.ClassSessionId);
            var commissionTierApplicable = commissionPerStudentTiers
                .FirstOrDefault(x => x.RuleCriteria.ToLowerInvariant() == "studentattendancerange" &&
                attendeeCountInLast30Days >= x.RuleMin &&
                attendeeCountInLast30Days <= x.RuleMax);

            // Reduce commission by 50p for Over18s lessons
            // Sukh: For all over 18's lessons can we please subtract 50p from each lesson attendee commission including the tutor.  As we are not recording under 18's lessons we can afford to lower the commission for these lessons.
            var commissionPerStudent = commissionTierApplicable.Setting;
            //if (!classSession.IsUnder16 && commissionPerStudent >= 0.50m)
            //{
            //    commissionPerStudent -= 0.50m;
            //}
            //commissionPerStudent -= 0.00m;
            return commissionPerStudent;

            #endregion

            #region New Code
            /*
            var totalMinutesIn30Days = await GetTotalMinutesIn30Days(tutorId, classSession.ClassSessionId);
             var commissionTierApplicable = commissionPerStudentTiers
                 .FirstOrDefault(x => x.RuleCriteria.ToLowerInvariant() == "studentattendancerange" &&
                 totalMinutesIn30Days >= x.RuleMin &&
                 totalMinutesIn30Days <= x.RuleMax);
             var commissionPerStudent = commissionTierApplicable.Setting;
             return commissionPerStudent; 
            */
            #endregion
        }
        // Ensure done on Lesson completion.
        /* public async Task UpdateStandingOutCut(List<Models.SessionAttendee> sessionAttendees, decimal commissionPerStudent)
         {

             #region Old Code
             foreach (var attendee in sessionAttendees)
             {
                 var vendorEarning = (attendee.AmountCharged - commissionPerStudent);
                 attendee.StandingOutActualCut = commissionPerStudent;
                 attendee.VendorAmount = vendorEarning > 0 ? vendorEarning : 0;
                 await _UnitOfWork.Repository<Models.SessionAttendee>().Update(attendee);
             }
             #endregion
             #region New Code
             //var cls = sessionAttendees.FirstOrDefault();
             //int lessonDuration = (int)Math.Round(cls.ClassSession.EndDate.Subtract(cls.ClassSession.StartDate).TotalMinutes);
             //foreach (var attendee in sessionAttendees)
             //{
             //    var commissionAmount = commissionPerStudent * (lessonDuration > 15 ? lessonDuration : 15);
             //    var vendorEarning = (attendee.AmountCharged - commissionAmount);

             //    attendee.StandingOutActualCut = commissionAmount;
             //    attendee.VendorAmount = vendorEarning > 0 ? vendorEarning : 0;
             //    await _UnitOfWork.Repository<Models.SessionAttendee>().Update(attendee);
             //} 
             #endregion
         }*/

        //resolve payments problem that sukh mentioned, as payouts are not dropping to the lower rate after 19 students.
        //basecamp chat 10-Feb2021
        public async Task UpdateStandingOutCut(Models.ClassSession classSession, Guid tutorId, List<Models.SessionAttendee> sessionAttendees, List<CommissionPerStudentTier> commissionPerStudentTiers)
        {
            var attendeeCountInLast30Days = await GetAttendeesCountInLast30Days(tutorId, classSession.ClassSessionId);
            foreach (var attendee in sessionAttendees)
            {
                attendeeCountInLast30Days = attendeeCountInLast30Days + 1;
                decimal commissionPerStudent = await GetCommissionPerStudent(attendeeCountInLast30Days, commissionPerStudentTiers);
                var vendorEarning = (attendee.AmountCharged - commissionPerStudent);
                attendee.StandingOutActualCut = commissionPerStudent;
                attendee.VendorAmount = vendorEarning > 0 ? vendorEarning : 0;
                await _UnitOfWork.Repository<Models.SessionAttendee>().Update(attendee);
            }
        }
        public async Task<decimal> GetCommissionPerStudent(int attendeeCountInLast30Days, List<CommissionPerStudentTier> commissionPerStudentTiers)
        {
            var commissionTierApplicable = commissionPerStudentTiers
                   .FirstOrDefault(x => x.RuleCriteria.ToLowerInvariant() == "studentattendancerange" &&
                    attendeeCountInLast30Days >= x.RuleMin &&
                    attendeeCountInLast30Days <= x.RuleMax);
           var  commissionPerStudent = commissionTierApplicable.Setting;
            return commissionPerStudent;
        }
        #region this is cancel lesson and refund service code for testing
        public async Task RefundInitiated()
        {
            var sessionList = await _UnitOfWork.Repository<Models.ClassSession>()
                  .Get(x => x.Refunded == false && x.Started == false && x.Ended == false && x.Complete == false
                  && DateTime.Now.ToUniversalTime() > x.StartDate.AddMinutes(15).UtcDateTime, includeProperties: "SessionAttendees");
            if (sessionList.Count > 0)
            {
                foreach (var item in sessionList)
                {
                    if (item.SessionAttendees.Count > 0)
                    {
                        foreach (var attendee in item.SessionAttendees)
                        {
                            if (attendee.Refunded == false)
                            {
                                await Refund(item.ClassSessionId, attendee.SessionAttendeeId);
                            }
                        }
                        item.Refunded = true;
                    }

                    item.Cancel = true;
                    await _UnitOfWork.Repository<Models.ClassSession>().Update(item);
                }

            }
        }
        #endregion
    }
}


