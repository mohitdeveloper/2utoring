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
using System.IO;
using StandingOut.Shared.Helpers.AzureFileHelper;
using Mapping = StandingOut.Shared.Mapping;
using System.Linq.Dynamic.Core;
using System.Text;
using StandingOut.Data.DTO.TutorRegister;
using StandingOut.Data.Models;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using StandingOut.Data.DTO;
using StandingOut.Shared;
using System.Data;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using StandingOut.Shared.Mapping;

namespace StandingOutStore.Business.Services
{
    public class TutorService : ITutorService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IAzureFileHelper _AzureFileHelper;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly ISubscriptionFeatureService subscriptionFeatureService;
        private bool _Disposed;

        public TutorService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager, IAzureFileHelper azureFileHelper, ISessionAttendeeService sessionAttendeeService,
            ISubscriptionFeatureService subscriptionFeatureService)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _AzureFileHelper = azureFileHelper;
            _SessionAttendeeService = sessionAttendeeService;
            this.subscriptionFeatureService = subscriptionFeatureService;
        }

        public TutorService(IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings.Value;
        }

        public TutorService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.Tutor>> GetTutorList()
        {
            return await _UnitOfWork.Repository<Models.Tutor>().Get(includeProperties: "Users");
        }
        public async Task<DTO.Tutor> GetTutorAvailabilities(Guid tutorId)
        {
            //return await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId, includeProperties: "Users,TutorAvailabilities");
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId, includeProperties: "Users,TutorAvailabilities");
            tutor.TutorAvailabilities = tutor.TutorAvailabilities.Where(x => x.IsDeleted == false && x.EndTime.ToUniversalTime() >= DateTime.Now.ToUniversalTime()).OrderBy(x => x.SlotType).ToList();
            var bookedCourse = await _UnitOfWork.Repository<Models.Course>().Get(o => o.TutorId == tutorId && o.IsDeleted == false, includeProperties: "ClassSessions");
            DTO.Tutor dataModel = Mapping.Mappings.Mapper.Map<Models.Tutor, DTO.Tutor>(tutor);
            IList<string> subject = new List<string>();
            var tutorSubject = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(x => x.TutorId == tutorId, includeProperties: "Subject");
            foreach (var item in tutorSubject)
            {
                subject.Add(item.Subject.Name);
            }
            string joinedSubject = string.Join(", ", subject);
            dataModel.SubjectNameList = joinedSubject;
            dataModel.BookedSlot = new List<DTO.BookedSlot>();
            if (bookedCourse != null && bookedCourse.Count > 0)
            {
                foreach (var course in bookedCourse)
                {
                    if (course.ClassSessions.Count > 0)
                    {
                        foreach (var item in course.ClassSessions.Where(x => x.IsDeleted == false).ToList())
                        {
                            dataModel.BookedSlot.Add(new DTO.BookedSlot
                            {
                                CourseId = course.CourseId,
                                StartDate = item.StartDate,
                                EndDate = item.EndDate
                            });
                        }
                    }

                }
            }
            return dataModel;
        }


        public async Task<Models.Tutor> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == id, includeProperties: "Users");
        }

        public async Task<Models.Tutor> GetById(Guid id, string includes)
        {
            return await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == id, includeProperties: includes);
        }

        public async Task<Models.Tutor> GetByUrlSlug(string urlSlug)
        {
            return await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.UrlSlug == urlSlug);
        }

        public async Task<Models.Tutor> GetMyForTutorAuth()
        {
            var user = await _UserManager.FindByEmailAsync(_HttpContext.HttpContext.User.Identity.Name);
            if (user.TutorId.HasValue)
            {
                return await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == user.TutorId.Value);
            }
            else
            {
                return null;
            }
        }

        public async Task<Models.Tutor> UpdateInitialRegisterStep(Guid id, int step)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == id, includeProperties: "Users,CompanyTutors.Company");
            //var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == id, includeProperties: "Users");
            if (step > tutor.InitialRegistrationStep)
            { // only update if they have progressed
                tutor.InitialRegistrationStep = step;
            }
            var previousInitialRegistrationComplete = tutor.InitialRegistrationComplete;
            if (step > 10)
            { // they have completed journey
                tutor.InitialRegistrationComplete = true;
            }

            int a = await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

            if (tutor.InitialRegistrationComplete != previousInitialRegistrationComplete)
            {
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();

                var subFeatureSet = await GetSubscriptionFeatureSet(tutor.TutorId);
                var profileApprovalRequired = subFeatureSet.AdminDashboard_ProfileApproval_ApprovalRequired;

                if (profileApprovalRequired)
                {
                    try
                    {
                        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                            System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\TutorProfileUnderReviewConfirmation.html"),
                            new Dictionary<string, string>()
                            {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{tutorFullName}}", tutor.Users.Select(x => x.FirstName + " " + x.LastName).First() },
                            }, tutor.Users.First().ContactEmail, settings.SendGridFromEmail, $"Your profile is currently under review");
                    }
                    catch { }
                }

                if (tutor.CompanyTutors.Count > 0)
                {
                    var company = tutor.CompanyTutors.FirstOrDefault().Company;
                    try
                    {
                        string tutorFullName = tutor.Users.Select(x => x.FirstName + " " + x.LastName).First();
                        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                            System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\AdminNotifiedNewCompanytutorProfile.html"),
                            new Dictionary<string, string>()
                            {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{tutorFullName}}", tutor.Users.Select(x => x.FirstName + " " + x.LastName).First() },
                            { "{{companyFullName}}", company.Name },
                            { "{{companyId}}", company.CompanyId.ToString() }
                            }, settings.TutorProfileUpdateEmail, settings.SendGridFromEmail, $"{tutorFullName} has registered with {company.Name} on 2utoring");
                    }
                    catch { }
                }
                else
                {
                    try
                    {
                        string tutorFullName = tutor.Users.Select(x => x.FirstName + " " + x.LastName).First();
                        var TutorSubs = await _UnitOfWork.Repository<TutorSubscription>().GetSingle(x => x.TutorId == tutor.TutorId && x.IsDeleted == false);
                        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                            System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\AdminNotifiedNewTutorProfile.html"),
                            new Dictionary<string, string>()
                            {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{tutorFullName}}", tutorFullName },
                            {"{{subscriptionName}}",TutorSubs?.Subscription.SubscriptionName },
                            { "{{tutorId}}", tutor.TutorId.ToString() }
                            }, settings.TutorProfileUpdateEmail, settings.SendGridFromEmail, $"Approval required for {tutorFullName} profile");
                    }
                    catch { }
                }
            }

            return tutor;
        }

        public async Task<Guid> SaveBasicInfo(DTO.TutorRegister.TutorRegisterBasicInfo model)
        {
            Guid tutorId = new Guid(); ;
            using (var trans = _UnitOfWork.GetContext().Database.BeginTransaction())
            {
                var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Id == model.UserId);

                user.Title = model.Title;
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.MobileNumber = model.MobileNumber;
                user.TelephoneNumber = model.TelephoneNumber;
                user.DateOfBirth = model.DateOfBirth;
                user.TermsAndConditionsAccepted = model.TermsAndConditionsAccepted;
                user.MarketingAccepted = model.MarketingAccepted;

                await _UserManager.UpdateAsync(user);

                await _UserManager.AddToRoleAsync(user, "Tutor");

                // Joining a Company
                if (model.JoiningCompanyId.HasValue)
                {
                    var tutor = await SetupTutorRecord(user, model.IDVerificationtStatus);

                    var currentCompanyTutor = await GetCurrentCompanyTutor(tutor?.TutorId);
                    if (currentCompanyTutor == null || currentCompanyTutor?.CompanyId != model.JoiningCompanyId)
                    {
                        var companyTutor = await CreateCompanyTutorRecord(model.JoiningCompanyId.Value, tutor.TutorId);
                        user.TutorId = companyTutor.TutorId;
                    }
                    else
                    {
                        user.TutorId = currentCompanyTutor.TutorId;
                    }
                    await _UserManager.UpdateAsync(user);
                    var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
                    var CT = await _UnitOfWork.Repository<Models.CompanyTutor>().GetSingle(x => x.TutorId == tutor.TutorId, includeProperties: "Company, Tutor");
                    var company = CT?.Company;
                    try
                    {

                        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                            System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\CompanyNotifiedNewtutorProfile.html"),
                            new Dictionary<string, string>()
                            {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{tutorFullName}}", user.FirstName + " " + user.LastName },
                            { "{{companyFullName}}", company.Name },
                            { "{{tutorId}}", tutor.TutorId.ToString() }
                            }, company.EmailAddress, settings.SendGridFromEmail, $"{user.FirstName + " " + user.LastName} has registered with {company.Name} on 2utoring");
                    }
                    catch { }

                }
                else
                {
                    if (model.StripePlanId.HasValue)
                    {
                        var dbStripePlan = await _UnitOfWork.Repository<Models.StripePlan>().GetSingle(o => o.StripePlanId == model.StripePlanId, includeProperties: "Subscription");
                        // below two lines commented for sometime to skip the registration flow for other two subjscription like the same for basic one
                        //if (dbStripePlan.Subscription.SubscriptionPrice == 0)
                        // {

                        var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
                        Models.Tutor tutor = new Models.Tutor();
                        tutor.StripePlanId = model.StripePlanId;
                        tutor.CalendarId = 999;
                        tutor.IDVerificationtStatus = model.IDVerificationtStatus;
                        //tutor.PaymentStatus = PaymentStatus.Paid;
                        tutor.PaymentStatus = PaymentStatus.Failed;
                        await _UnitOfWork.Repository<Models.Tutor>().Insert(tutor);
                        user.TutorId = tutor.TutorId;
                        tutorId = tutor.TutorId;
                        await _UserManager.UpdateAsync(user);
                        #region Insert Free Subcription

                        TutorSubscription newSub = new TutorSubscription();
                        newSub.SubscriptionId = Guid.Parse(dbStripePlan.SubscriptionId.ToString());
                        newSub.TutorId = tutor.TutorId;
                        newSub.StartDateTime = DateTime.UtcNow;
                        await _UnitOfWork.Repository<TutorSubscription>().Insert(newSub);
                        #endregion
                        try
                        {
                            var TutorSubs = await _UnitOfWork.Repository<TutorSubscription>().GetSingle(x => x.TutorId == tutor.TutorId && x.IsDeleted == false);
                            await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                                System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\TutorSignUpConfirmation.html"),
                                new Dictionary<string, string>()
                                {
                                    { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                                    { "{{userFullName}}", user.FirstName + " " + user.LastName },
                                    {"{{subscriptionName}}",TutorSubs?.Subscription.SubscriptionName },
                                }, user.ContactEmail, settings.SendGridFromEmail, $"Thank you for registering with 2utoring");

                            await SetTutorUrlSlug(tutor.TutorId);
                        }
                        catch { }
                        // }
                    }
                }
                trans.Commit();
            }
            return tutorId;
        }

        private async Task<Models.Tutor> SetupTutorRecord(User user, TutorApprovalStatus IDVerificationtStatus)
        {
            Models.Tutor tutor;
            if (!user.TutorId.HasValue)
            {
                tutor = new Models.Tutor();
                // need these not to be required
                tutor.CalendarId = 999;
                tutor.IDVerificationtStatus = IDVerificationtStatus;
                await _UnitOfWork.Repository<Models.Tutor>().Insert(tutor);
            }
            else
            {
                tutor = await GetById(user.TutorId.Value);
            }
            user.TutorId = tutor.TutorId;
            user.Tutor = tutor;

            return user.Tutor;
        }

        private async Task<Models.CompanyTutor> CreateCompanyTutorRecord(Guid companyId, Guid tutorId)
        {
            var companyTutor = new Models.CompanyTutor
            {
                CompanyId = companyId,
                TutorId = tutorId,
                ActualStartDate = DateTime.UtcNow,
                ActualEndDate = null
            };

            await _UnitOfWork.Repository<Models.CompanyTutor>().Insert(companyTutor);
            await SetTutorUrlSlug(tutorId);
            return companyTutor;
        }

        public async Task<DTO.TutorRegister.TutorRegisterPayment> SavePayment(DTO.TutorRegister.TutorRegisterPayment model)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Id == model.UserId);

            Models.Tutor tutor = null;
            if (user.TutorId.HasValue)
            {
                tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == user.TutorId);
            }
            else
            {
                tutor = new Models.Tutor();
                tutor.StripePlanId = model.StripePlanId;
                // need these not to be required
                tutor.CalendarId = 999;

                await _UnitOfWork.Repository<Models.Tutor>().Insert(tutor);
                user.TutorId = tutor.TutorId;
                await _UserManager.UpdateAsync(user);
            }
            model.TutorId ??= tutor.TutorId;

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                Stripe.PaymentMethod stripePaymentMethod = await stripeHelper.GetPaymentMethod(model.PaymentMethodId);
                if (stripePaymentMethod == null)
                    throw new Exception("There was an issue setting up your payment card");

                var dbStripePlan = await _UnitOfWork.Repository<Models.StripePlan>().GetSingle(o => o.StripePlanId == model.StripePlanId);
                Stripe.Plan stripePlan = await stripeHelper.GetPlan(dbStripePlan.StripeProductId);
                if (stripePlan == null || !stripePlan.Active)
                    throw new Exception("The package selected no longer exists, please select another");

                Stripe.Coupon stripeCoupon = null;
                // If a promo code was entered and is not valid - We should not continue as the customer may be expecting a discount
                if (!string.IsNullOrWhiteSpace(model.PromoCode))
                {
                    try
                    {
                        stripeCoupon = await stripeHelper.GetCoupon(model.PromoCode);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Promo code is invalid");
                    }
                    finally
                    {
                        if (stripeCoupon == null || !stripeCoupon.Valid)
                            throw new Exception("Promo code is invalid");
                    }
                }

                if (!string.IsNullOrWhiteSpace(model.IntentId))
                {
                    Stripe.PaymentIntent stripePaymentIntent = await stripeHelper.GetPaymentIntent(model.IntentId);
                    if (stripePaymentIntent.Status != "succeeded")
                        stripePaymentIntent = await stripeHelper.ConfirmPaymentIntent(model.IntentId);

                    model = BuildRegistrationReturnObject(model, stripePaymentIntent, model.StripeSubscriptionId, model.StripeCustomerId);
                }
                else
                {
                    var stripeCustomer = await stripeHelper.CreateCustomer(tutor.Name, user.Email, model.PaymentMethodId);
                    model.StripeCustomerId = stripeCustomer.Id;
                    Stripe.Subscription stripeSubscription = await stripeHelper.CreateSubscription(new Stripe.SubscriptionCreateOptions()
                    {
                        Customer = stripeCustomer.Id,
                        Coupon = stripeCoupon?.Id,
                        TrialFromPlan = true,
                        Items = new List<Stripe.SubscriptionItemOptions>()
                    {
                        new Stripe.SubscriptionItemOptions()
                        {
                            Plan = stripePlan.Id,
                            Quantity = 1
                        }
                    }
                    });
                    Stripe.Invoice stripeInvoice = await stripeHelper.GetInvoice(stripeSubscription.LatestInvoiceId);
                    if (stripeInvoice.AmountDue == 0)
                    {
                        model.RequiresAction = false;
                        model.StripeSubscriptionId = stripeSubscription.Id;
                    }
                    else
                    {
                        Stripe.PaymentIntent stripePaymentIntent = await stripeHelper.GetPaymentIntent(stripeInvoice.PaymentIntentId);
                        model = BuildRegistrationReturnObject(model, stripePaymentIntent, stripeSubscription.Id, stripeCustomer.Id);
                    }
                }

                if (!model.RequiresAction)
                {
                    tutor.StripePlanId = dbStripePlan.StripePlanId;
                    tutor.PaymentStatus = PaymentStatus.Paid;
                    tutor.StripeCustomerId = model.StripeCustomerId;
                    tutor.StripeSubscriptionId = model.StripeSubscriptionId;
                    tutor.SignUpVoucher = model.PromoCode;
                    await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

                    try
                    {
                        var TutorSubs = await _UnitOfWork.Repository<TutorSubscription>().GetSingle(x => x.TutorId == tutor.TutorId && x.IsDeleted == false);
                        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                            System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\TutorSignUpConfirmation.html"),
                            new Dictionary<string, string>()
                            {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{userFullName}}", user.FirstName + " " + user.LastName },
                            {"{{subscriptionName}}",TutorSubs?.Subscription.SubscriptionName },
                            }, user.ContactEmail, settings.SendGridFromEmail, $"Thank you for registering with 2utoring");

                        await SetTutorUrlSlug(tutor.TutorId);
                    }
                    catch { }
                }
            }

            return model;
        }

        public async Task<DTO.TutorRegister.TutorRegisterBankDetails> SaveBankDetails(TutorRegisterBankDetails model)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Id == model.UserId);

            if (user.TutorId.HasValue)
            {
                var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetByID(user.TutorId);
                tutor.AddressLine1 = model.AddressLine1;
                tutor.PostCode = model.Postcode;
                tutor.BankAccountNumber = model.BankAccountNumber;
                tutor.BankSortCode = model.BankSortCode;
                await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
                model.TutorId = tutor.TutorId;
            }
            else throw new ApplicationException("Cannot save bank details.. Cannot find tutor record for this user.");
            return model;
        }

        public async Task<Models.Tutor> SetTutorUrlSlug(Guid id)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == id);
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.TutorId == id);
            if (tutor != null && user != null)
            {
                var usersWithSameName = _UnitOfWork.GetContext().Users.Where(o => o.TutorId != null && o.FirstName.ToLower() == user.FirstName.ToLower() && o.LastName.ToLower() == user.LastName.ToLower() && o.TutorId != tutor.TutorId).Count();
                if (usersWithSameName == 0)
                {
                    tutor.UrlSlug = $"{user.FirstName.ToLower()}{user.LastName.ToLower()}";
                }
                else
                {
                    tutor.UrlSlug = $"{user.FirstName.ToLower()}{user.LastName.ToLower()}{usersWithSameName}";
                }
                await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
            }
            return tutor;
        }

        public async Task<DTO.TutorRegister.TutorRegisterPayment> UpdatePayment(DTO.TutorRegister.TutorRegisterPayment model)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == model.TutorId, includeProperties: "Users");
            Models.StripePlan dbStripePlan = null;
            bool IsCardSet = false;

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                //THEY ARE RETURNING HERE FROM 3D SECURE
                if (!string.IsNullOrWhiteSpace(model.IntentId))
                {
                    Stripe.PaymentIntent stripePaymentIntent = await stripeHelper.GetPaymentIntent(model.IntentId);
                    if (stripePaymentIntent.Status != "succeeded")
                        stripePaymentIntent = await stripeHelper.ConfirmPaymentIntent(model.IntentId);

                    model = BuildRegistrationReturnObject(model, stripePaymentIntent, model.StripeSubscriptionId, model.StripeCustomerId);
                }
                else
                {
                    Stripe.Plan stripePlan = null;
                    // If User Select New Plan
                    if (model.NewStripePlanId != null)
                    {

                        if (!string.IsNullOrEmpty(tutor.StripeSubscriptionId))
                        {
                            var stripeSubscription = await stripeHelper.GetSubscription(tutor.StripeSubscriptionId);
                            if (stripeSubscription != null && stripeSubscription.Status != "canceled")
                            {
                                await stripeHelper.CancelSubscription(tutor.StripeSubscriptionId);
                            }
                        }

                        //For New Plan
                        dbStripePlan = await _UnitOfWork.Repository<Models.StripePlan>().GetSingle(o => o.StripePlanId == model.NewStripePlanId);
                        stripePlan = await stripeHelper.GetPlan(dbStripePlan.StripeProductId);
                        tutor.DbsApprovalStatus = model.DbsApprovalStatus;
                        tutor.ProfileApprovalStatus = model.ProfileApprovalStatus;
                        tutor.StripePlanId = model.NewStripePlanId;
                        //If customer id not set then create new customer id
                        if (string.IsNullOrEmpty(tutor.StripeCustomerId))
                        {
                            IsCardSet = true;
                            var user = tutor.Users.FirstOrDefault();
                            var stripeCustomer = await stripeHelper.CreateCustomer(user.FullName, user.Email, model.PaymentMethodId);
                            tutor.StripeCustomerId = stripeCustomer.Id;
                            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
                        }
                        //tutor.DbsCertificateNumber = model.DbsCheckData.DbsCertificateNumber;

                    }
                    else
                    {
                        //THEY ARE HERE FOR THE FIRST TIME
                        dbStripePlan = await _UnitOfWork.Repository<Models.StripePlan>().GetSingle(o => o.StripePlanId == model.StripePlanId);
                        stripePlan = await stripeHelper.GetPlan(dbStripePlan.StripeProductId);
                    }


                    if (!string.IsNullOrEmpty(tutor.StripeCustomerId))
                    {
                        //HANDLE CARDS
                        #region Create Delete Card
                        var stripeCustomer = await stripeHelper.GetCustomer(tutor.StripeCustomerId);
                        if (!IsCardSet)
                        {
                            var oldCard = await stripeHelper.GetPaymentMethod(stripeCustomer.InvoiceSettings.DefaultPaymentMethodId);
                            if (oldCard != null)
                                await stripeHelper.DeletePaymentMethod(tutor.StripeCustomerId, oldCard.Id);

                            await stripeHelper.CreatePaymentMethod(tutor.StripeCustomerId, model.PaymentMethodId);
                        }
                        #endregion

                        Stripe.Subscription stripeSubscription = null;
                        if (!string.IsNullOrEmpty(tutor.StripeSubscriptionId))
                        {
                            stripeSubscription = await stripeHelper.GetSubscription(tutor.StripeSubscriptionId);
                        }

                        if (stripeSubscription == null || stripeSubscription.Status == "canceled")
                        {
                            //CREATE SUBSCRIPTION IF IT WAS CANCLLED/DELETED
                            stripeSubscription = await stripeHelper.CreateSubscription(new Stripe.SubscriptionCreateOptions()
                            {
                                Customer = stripeCustomer.Id,
                                Items = new List<Stripe.SubscriptionItemOptions>()
                                {
                                    new Stripe.SubscriptionItemOptions()
                                    {
                                        Plan = stripePlan.Id,Quantity = 1
                                    }
                                }
                            });
                            tutor.StripeSubscriptionId = stripeSubscription.Id;

                            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

                            #region Remove Old Subcription and Add New
                            if (model.NewStripePlanId != Guid.Empty)
                            {
                                var oldSubs = await _UnitOfWork.Repository<TutorSubscription>().GetSingle(x => x.TutorId == model.TutorId && x.IsDeleted == false);
                                if (oldSubs != null)
                                {
                                    oldSubs.IsDeleted = true;
                                    oldSubs.EndDateTime = DateTime.UtcNow;
                                    var updatedOldSub = await _UnitOfWork.Repository<TutorSubscription>().Update(oldSubs);
                                    if (updatedOldSub > 0)
                                    {
                                        #region Insert New Subcription
                                        TutorSubscription newSub = new TutorSubscription();
                                        newSub.SubscriptionId = Guid.Parse(dbStripePlan.SubscriptionId.ToString());
                                        newSub.TutorId = tutor.TutorId;
                                        newSub.StartDateTime = DateTime.UtcNow;
                                        await _UnitOfWork.Repository<TutorSubscription>().Insert(newSub);
                                        #endregion

                                        #region Notification send to Admin
                                        try
                                        {
                                            string tutorFullName = tutor.Users.Select(x => x.FirstName + " " + x.LastName).First();
                                            var TutorSubs = await _UnitOfWork.Repository<TutorSubscription>().GetSingle(x => x.TutorId == tutor.TutorId && x.IsDeleted == false);
                                            await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                                                System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\AdminNotifiedNewTutorProfile.html"),
                                                new Dictionary<string, string>()
                                                {
                                                { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                                                { "{{tutorFullName}}", tutorFullName },
                                                {"{{subscriptionName}}",TutorSubs?.Subscription.SubscriptionName },
                                                { "{{tutorId}}", tutor.TutorId.ToString() }
                                                }, settings.TutorProfileUpdateEmail, settings.SendGridFromEmail, $"Approval required for {tutorFullName} profile");
                                        }
                                        catch { }
                                        #endregion
                                    }
                                }
                            }
                            #endregion



                        }

                        //CHECK INVOICE AND TRY AND MAKE PAYMENT
                        Stripe.Invoice stripeInvoice = await stripeHelper.GetInvoice(stripeSubscription.LatestInvoiceId);
                        if (stripeInvoice.Paid == true || stripeInvoice.AmountDue == 0)
                        {
                            model.RequiresAction = false;
                        }
                        else
                        {
                            //await stripeHelper.PayStripeInvoice(stripeInvoice.Id);
                            Stripe.PaymentIntent stripePaymentIntent = await stripeHelper.GetPaymentIntent(stripeInvoice.PaymentIntentId);
                            model = BuildRegistrationReturnObject(model, stripePaymentIntent, stripeSubscription.Id, stripeCustomer.Id);
                        }
                    }


                }
            }
            return model;
        }


        private DTO.TutorRegister.TutorRegisterPayment BuildRegistrationReturnObject(DTO.TutorRegister.TutorRegisterPayment model,
            Stripe.PaymentIntent intent, string stripeSubscriptionId, string stripeCustomerId)
        {
            if (intent.Status == "requires_action" && intent.NextAction?.Type == "use_stripe_sdk")
            {
                model.RequiresAction = true;
                model.IntentClientSecret = intent.ClientSecret;
                model.IntentId = intent.Id;
                model.PaymentMethodId = intent.PaymentMethodId;
                model.StripeSubscriptionId = stripeSubscriptionId;
                model.StripeCustomerId = stripeCustomerId;
                return model;
            }
            else if (intent.Status == "succeeded")
            {
                model.RequiresAction = false;
                model.IntentId = intent.Id;
                model.PaymentMethodId = intent.PaymentMethodId;
                model.StripeSubscriptionId = stripeSubscriptionId;
                model.StripeCustomerId = stripeCustomerId;
                return model;
            }
            else
            {
                throw new Exception("Invalid PaymentIntent status");
            }
        }

        public async Task SaveDbsCheck(DTO.TutorRegister.TutorRegisterDbsCheck model)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == model.TutorId);

            tutor.HasDbsCheck = model.HasDbsCheck;
            tutor.DbsCertificateNumber = model.DbsCertificateNumber;
            if (model.IsProfileCheck)
            {
                tutor.ProfileApprovalStatus = model.ProfileApprovalRequired;
            }
            if (model.HasDbsCheck)
            {
                tutor.DbsApprovalStatus = TutorApprovalStatus.Pending;
            }
            else
            {
                tutor.DbsApprovalStatus = TutorApprovalStatus.NotRequired;
            }


            //if (tutor.DbsApprovalStatus == TutorApprovalStatus.Rejected)
            //{
            //    tutor.DbsApprovalStatus = TutorApprovalStatus.Pending;
            //}

            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

            await SendDBSUpdatedEmail(model.TutorId);
        }

        public async Task SaveProfile(DTO.TutorRegister.TutorRegisterProfile model)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == model.TutorId, includeProperties: "Users,TutorCertificates,TutorQualifications");

            

            List<Tuple<string, string, string>> changeList = new List<Tuple<string, string, string>>();
            if (model.Header != tutor.Header)
                changeList.Add(new Tuple<string, string, string>("Header", tutor.Header, model.Header));
            tutor.Header = model.Header;
            if (model.SubHeader != tutor.SubHeader)
                changeList.Add(new Tuple<string, string, string>("SubHeader", tutor.SubHeader, model.SubHeader));
            tutor.SubHeader = model.SubHeader;
            if (model.Biography != tutor.Biography)
                changeList.Add(new Tuple<string, string, string>("Biography", tutor.Biography, model.Biography));
            tutor.Biography = model.Biography;
            if (model.ProfileTeachingExperiance != tutor.ProfileTeachingExperiance)
                changeList.Add(new Tuple<string, string, string>("ProfileTeachingExperiance", tutor.ProfileTeachingExperiance, model.ProfileTeachingExperiance));
            tutor.ProfileTeachingExperiance = model.ProfileTeachingExperiance;
            if (model.ProfileHowITeach != tutor.ProfileHowITeach)
                changeList.Add(new Tuple<string, string, string>("ProfileHowITeach", tutor.ProfileHowITeach, model.ProfileHowITeach));
            tutor.ProfileHowITeach = model.ProfileHowITeach;

            var subFeatureSet = await GetSubscriptionFeatureSet(tutor.TutorId);
            var profileApprovalRequired = subFeatureSet.AdminDashboard_ProfileApproval_ApprovalRequired;
            var dbsApprovalRequired = subFeatureSet.AdminDashboard_DBSApproval_ApprovalRequired;

            tutor.DbsApprovalStatus = dbsApprovalRequired ? tutor.DbsApprovalStatus : TutorApprovalStatus.NotRequired;

            // If NotRequired and not explicitly Rejected by Admin/SuperAdmin
            if (!profileApprovalRequired && tutor.ProfileApprovalStatus != TutorApprovalStatus.Rejected)
            {
                //tutor.ProfileApprovalStatus = TutorApprovalStatus.NotRequired;
                tutor.ProfileApprovalStatus = TutorApprovalStatus.Pending;
            }
            else if (tutor.ProfileApprovalStatus == TutorApprovalStatus.Rejected)
            {
                tutor.ProfileApprovalStatus = TutorApprovalStatus.Pending;
            }
            //if (!string.IsNullOrEmpty(tutor.ProfileImageFileLocation)
            if (!string.IsNullOrEmpty(tutor.Header)
                && !string.IsNullOrEmpty(tutor.Biography)
                && !string.IsNullOrEmpty(tutor.ProfileTeachingExperiance)
                && !string.IsNullOrEmpty(tutor.ProfileHowITeach)
                && tutor.TutorQualifications.Count(x=>x.IsDeleted == false) >0
                && tutor.TutorCertificates.Count(x=>x.CertificateType== TutorCertificateType.Qualification && x.IsDeleted==false)>0
                )
            {
                tutor.ProfileSetupStarted = true;
                tutor.ProfileFieldsAllComplete = true;
            }
            else
            {
                tutor.ProfileSetupStarted = true;
                tutor.ProfileFieldsAllComplete = false;
            }


            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();

            var attatchments = new List<SendGrid.Helpers.Mail.Attachment>();

            if (!string.IsNullOrEmpty(tutor.ProfileImageFileLocation))
            {
                var stream = await _AzureFileHelper.DownloadBlob(tutor.ProfileImageFileLocation, "tutorprofileimages");
                byte[] bytes;
                using var memoryStream = new MemoryStream();
                stream.CopyTo(memoryStream);
                bytes = memoryStream.ToArray();
                attatchments.Add(new SendGrid.Helpers.Mail.Attachment() { Filename = tutor.ProfileImageFileName, Type = "application/octect-stream", Content = Convert.ToBase64String(bytes) });
            }

            if (attatchments.Count > 0 || changeList.Count > 0)
            {
                try
                {
                    string tutorFullName = tutor.Users.Select(x => x.FirstName + " " + x.LastName).First();
                    await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                        System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\AdminNotifiedTutorProfileAmend.html"),
                        new Dictionary<string, string>()
                        {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{tutorFullName}}", tutorFullName },
                            { "{{contentChanges}}", AccumulateContentChanges(changeList, attatchments.Count > 0) },
                            { "{{tutorId}}", tutor.TutorId.ToString() }
                        }, settings.TutorProfileUpdateEmail, settings.SendGridFromEmail, $"Approval required for {tutorFullName} profile",
                        attachments: attatchments.Count > 0 ? attatchments : null);
                }
                catch { }
            }
        }

        private string AccumulateContentChanges(List<Tuple<string, string, string>> changes, bool imageChanged)
        {
            string result = string.Empty;
            if (imageChanged)
                result += $"<p><b>Profile image was modified and is attached.</b></p>";
            foreach (var change in changes)
            {
                result += $"<p><b>{change.Item1} changed from:</b></p>";
                result += $"<p>{change.Item2}</p>";
                result += $"<p><b>{change.Item1} changed to:</b></p>";
                result += $"<p>{change.Item3}</p>";
            }
            return result;
        }

        public async Task SaveProfileOne(DTO.TutorRegister.TutorRegisterProfileOne model)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == model.TutorId);

            tutor.Header = model.Header;
            tutor.SubHeader = model.SubHeader;
            tutor.Biography = model.Biography;

            var subFeatureSet = await GetSubscriptionFeatureSet(tutor.TutorId);
            var profileApprovalRequired = subFeatureSet.AdminDashboard_ProfileApproval_ApprovalRequired;
            var dbsApprovalRequired = subFeatureSet.AdminDashboard_DBSApproval_ApprovalRequired;

            tutor.DbsApprovalStatus = dbsApprovalRequired ? tutor.DbsApprovalStatus : TutorApprovalStatus.NotRequired;

            // If NotRequired and not explicitly Rejected by Admin/SuperAdmin
            if (!profileApprovalRequired && tutor.ProfileApprovalStatus != TutorApprovalStatus.Rejected)
            {
                tutor.ProfileApprovalStatus = TutorApprovalStatus.NotRequired;
            }
            else if (tutor.ProfileApprovalStatus == TutorApprovalStatus.Rejected)
            {
                tutor.ProfileApprovalStatus = TutorApprovalStatus.Pending;
            }

            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
        }

        public async Task SaveProfileTwo(DTO.TutorRegister.TutorRegisterProfileTwo model)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == model.TutorId);

            tutor.ProfileTeachingExperiance = model.ProfileTeachingExperiance;
            tutor.ProfileHowITeach = model.ProfileHowITeach;

            var subFeatureSet = await GetSubscriptionFeatureSet(tutor.TutorId);
            var profileApprovalRequired = subFeatureSet.AdminDashboard_ProfileApproval_ApprovalRequired;
            var dbsApprovalRequired = subFeatureSet.AdminDashboard_DBSApproval_ApprovalRequired;

            tutor.DbsApprovalStatus = dbsApprovalRequired ? tutor.DbsApprovalStatus : TutorApprovalStatus.NotRequired;

            // If NotRequired and not explicitly Rejected by Admin/SuperAdmin
            if (!profileApprovalRequired && tutor.ProfileApprovalStatus != TutorApprovalStatus.Rejected)
            {
                tutor.ProfileApprovalStatus = TutorApprovalStatus.NotRequired;
            }
            else if (tutor.ProfileApprovalStatus == TutorApprovalStatus.Rejected)
            {
                tutor.ProfileApprovalStatus = TutorApprovalStatus.Pending;
            }

            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
        }

        public async Task ProfileUpload(Guid tutorId, IFormFile file)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId);

            using var stream = file.OpenReadStream();

            try
            {
                tutor.ProfileImageFileLocation = await _AzureFileHelper.UploadBlob(stream, Guid.NewGuid() + file.FileName.Substring(file.FileName.LastIndexOf('.')), $"tutorprofileimages");
            }
            catch (Exception)
            {

                tutor.ProfileImageFileLocation = "38315803-deb2-43e3-a95b-262ab1769c49.jpg";
            }

            tutor.ProfileImageFileName = file.FileName;

            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
        }

        public async Task<DTO.PagedList<DTO.PagedTutor>> GetPaged(DTO.TutorSearchModel model, string role, Guid? companyId)
        {
            IQueryable<Models.Tutor> data = null;
            if (role.Equals("Super Admin"))
            {
                data = _UnitOfWork.Repository<Models.Tutor>().GetQueryable(o => o.Users.Count(u => u.IsDeleted == false) > 0, includeProperties: "Users");
            }
            else if (companyId != null)
            {
                data = _UnitOfWork.Repository<Models.Tutor>().GetQueryable(o => o.Users.Count(u => u.IsDeleted == false) > 0 && o.CompanyTutors.Any(y => y.CompanyId == companyId), includeProperties: "Users");
            }

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => (o.Users != null && o.Users.FirstOrDefault().FullName.ToLower().Contains(search)));
            }

            if (model.ProfileFilter != TutorSearchFilterType.All)
            {
                switch (model.ProfileFilter)
                {
                    case TutorSearchFilterType.Approved:
                        data = data.Where(o => o.ProfileApprovalStatus == TutorApprovalStatus.Approved);
                        break;
                    case TutorSearchFilterType.ApprovalNotRequired:
                        data = data.Where(o => o.ProfileApprovalStatus == TutorApprovalStatus.NotRequired);
                        break;
                    default:
                        data = data.Where(o => o.ProfileApprovalStatus == TutorApprovalStatus.Pending ||
                                            o.ProfileApprovalStatus == TutorApprovalStatus.Rejected);
                        break;
                }
            }

            if (model.DBSFilter != TutorSearchFilterType.All)
            {
                switch (model.DBSFilter)
                {
                    case TutorSearchFilterType.Approved:
                        data = data.Where(o => o.DbsApprovalStatus == TutorApprovalStatus.Approved);
                        break;
                    case TutorSearchFilterType.ApprovalNotRequired:
                        data = data.Where(o => o.DbsApprovalStatus == TutorApprovalStatus.NotRequired);
                        break;
                    default:
                        data = data.Where(o => o.DbsApprovalStatus == TutorApprovalStatus.Pending ||
                                            o.DbsApprovalStatus == TutorApprovalStatus.Rejected);
                        break;
                }
            }


            var result = new DTO.PagedList<DTO.PagedTutor>();

            System.Reflection.PropertyInfo prop = typeof(Models.Subject).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {
                //perform some manual sorting (if required, this should only be for sub-objects).

                switch (model.SortType)
                {
                    case "User.Name":
                        data = model.Order == "DESC" ? data.OrderByDescending(o => o.Users != null && o.Users.Where(o => o.IsDeleted == false).Count() > 0 ? o.Users.FirstOrDefault(o => o.IsDeleted == false).FirstName : "")
                                                       .ThenByDescending(o => o.Users != null && o.Users.Where(o => o.IsDeleted == false).Count() > 0 ? o.Users.FirstOrDefault(o => o.IsDeleted == false).LastName : "")
                                                       : data.OrderBy(o => o.Users != null && o.Users.Where(o => o.IsDeleted == false).Count() > 0 ? o.Users.FirstOrDefault(o => o.IsDeleted == false).FirstName : "")
                                                       .ThenBy(o => o.Users != null && o.Users.Where(o => o.IsDeleted == false).Count() > 0 ? o.Users.FirstOrDefault(o => o.IsDeleted == false).LastName : "");
                        break;
                    case "User.Email":
                        data = model.Order == "DESC" ? data.OrderByDescending(o => o.Users != null && o.Users.Count > 0 ? o.Users.First(o => o.IsDeleted == false).Email : "") : data.OrderBy(o => o.Users != null && o.Users.Count > 0 ? o.Users.First(o => o.IsDeleted == false).Email : "");
                        break;

                }
            }

            result.Data = Mapping.Mappings.Mapper.Map<List<Models.Tutor>, List<DTO.PagedTutor>>(await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
            {
                if (result.Paged.TotalCount % result.Paged.Take == 0)
                {
                    result.Paged.TotalPages = (result.Paged.TotalCount / result.Paged.Take);
                }
                else
                {
                    result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
                }

            }
            else
                result.Paged.TotalPages = 0;

            return result;
        }

        public async Task ApproveProfile(Guid id)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == id, includeProperties: "Users");
            tutor.ProfileApprovalStatus = TutorApprovalStatus.Approved;
            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

            try
            {
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\TutorProfileApproved.html"),
                    new Dictionary<string, string>()
                    {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{tutorFullName}}", tutor.Users.Select(x => x.FirstName + " " + x.LastName).First() },
                    }, tutor.Users.First().ContactEmail, settings.SendGridFromEmail, $"Your profile has been approved on 2utoring");
            }
            catch { }
        }

        public async Task RejectProfile(Guid id)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == id, includeProperties: "Users");
            tutor.ProfileApprovalStatus = TutorApprovalStatus.Rejected;
            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
        }

        public async Task ApproveDBS(Guid id)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == id, includeProperties: "Users");
            tutor.DbsApprovalStatus = TutorApprovalStatus.Approved;
            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

            try
            {
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\TutorDBSApproved.html"),
                    new Dictionary<string, string>()
                    {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{tutorFullName}}", tutor.Users.Select(x => x.FirstName + " " + x.LastName).First() },
                    }, tutor.Users.First().ContactEmail, settings.SendGridFromEmail, $"Your background check has been approved on 2utoring");
            }
            catch { }
        }

        public async Task RejectDBS(Guid id)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == id, includeProperties: "Users");
            tutor.DbsApprovalStatus = TutorApprovalStatus.Rejected;
            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
        }

        public async Task<Models.Tutor> Update(Models.Tutor tutor)
        {
            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
            return tutor;
        }

        public async Task<Models.CompanyTutor> GetCurrentCompanyTutor(Guid? tutorId)
        {
            if (tutorId == null) return null;
            var latestJoiningRecord = await _UnitOfWork.Repository<Models.CompanyTutor>()
                .GetSingle(x => x.ActualStartDate < DateTime.UtcNow && (x.ActualEndDate == null || x.ActualEndDate > DateTime.UtcNow)
                && x.TutorId == tutorId.Value, includeProperties: "Company, Tutor");
            if (latestJoiningRecord == null) return null;

            return latestJoiningRecord;
        }

        public async Task<DTO.Company> GetCurrentCompany(Models.User user)
        {
            if (user.TutorId == null) return null;
            var tutor = await GetById(user.TutorId.Value);
            var latestJoiningRecord = await GetCurrentCompanyTutor(tutor?.TutorId);
            if (latestJoiningRecord == null) return null;

            var companyDto = Mapping.Mappings.Mapper.Map<Models.Company, DTO.Company>(latestJoiningRecord.Company);
            return companyDto;
        }
        public async Task<DTO.Company> GetTutorCompany(Guid TutorId)
        {
            if (TutorId == Guid.Empty) return null;
            var companyTutor = await _UnitOfWork.Repository<Models.CompanyTutor>().GetSingle(x => x.TutorId == TutorId, includeProperties: "Company");
            if (companyTutor != null)
            {
                var company = Mapping.Mappings.Mapper.Map<Models.Company, DTO.Company>(companyTutor.Company);
                return company != null ? company : null;
            }
            return null;
        }

        public async Task<List<Models.Tutor>> GetEligibleTutorsForPayout()
        {
            return await _UnitOfWork.Repository<Models.Tutor>().Get(o => o.StripeConnectAccountId != null && o.StripeConnectAccountId != ""
            && o.StripeConnectBankAccountId != null && o.StripeConnectBankAccountId != "");
        }

        public async Task MarkProfileAuthorizedMessageRead(Guid id)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == id);

            tutor.ProfileAuthorizedMessageRead = true;

            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
        }

        public async Task MarkDbsAdminApprovedMessageRead(Guid id)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == id);

            tutor.DbsAdminApprovedMessageRead = true;

            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
        }

        public async Task DBSUpload(Guid tutorId, IFormFile file)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId);

            using var stream = file.OpenReadStream();
            Models.TutorCertificate model = new Models.TutorCertificate();
            model.TutorId = tutor.TutorId;
            model.CertificateFileLocation = await _AzureFileHelper.UploadBlob(stream, Guid.NewGuid() + file.FileName.Substring(file.FileName.LastIndexOf('.')), $"tutordbscertificates");
            model.CertificateFileName = file.FileName;
            model.CertificateType = TutorCertificateType.DBS;
            await _UnitOfWork.Repository<Models.TutorCertificate>().Insert(model);

            //tutor.DbsCertificateFileLocation = await _AzureFileHelper.UploadBlob(stream, Guid.NewGuid() + file.FileName.Substring(file.FileName.LastIndexOf('.')), $"tutordbscertificates");
            //tutor.DbsCertificateFileName = file.FileName;
            if (tutor.DbsApprovalStatus == TutorApprovalStatus.Rejected)
            {
                tutor.DbsApprovalStatus = TutorApprovalStatus.Pending;
            }

            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

            await SendDBSUpdatedEmail(tutorId);
        }

        private async Task SendDBSUpdatedEmail(Guid tutorId)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId, includeProperties: "Users");
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            StringBuilder sb = new StringBuilder();
            sb.AppendLine($"Tutor {tutor.Users.FirstOrDefault().FullName} has updated thier Dbs");
            sb.AppendLine("<ul>");
            sb.AppendLine($"<li><strong>Certificate No.</strong>: {tutor.DbsCertificateNumber}</li>");
            sb.AppendLine("</ul>");

            var attatchments = new List<SendGrid.Helpers.Mail.Attachment>();

            if (!string.IsNullOrEmpty(tutor.DbsCertificateFileLocation))
            {
                var stream = await _AzureFileHelper.DownloadBlob(tutor.DbsCertificateFileLocation, "tutordbscertificates");
                byte[] bytes;
                using var memoryStream = new MemoryStream();
                stream.CopyTo(memoryStream);
                bytes = memoryStream.ToArray();
                attatchments.Add(new SendGrid.Helpers.Mail.Attachment() { Filename = tutor.DbsCertificateFileName, Type = "application/octect-stream", Content = Convert.ToBase64String(bytes) });
            }

            try
            {
                string tutorFullName = tutor.Users.Select(x => x.FirstName + " " + x.LastName).First();
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\AdminNotifiedTutorDBSAmend.html"),
                    new Dictionary<string, string>()
                    {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{tutorFullName}}", tutorFullName},
                            { "{{tutorId}}", tutor.TutorId.ToString() }
                    }, settings.TutorProfileUpdateEmail, settings.SendGridFromEmail, $"Approval required for {tutorFullName} DBS check",
                    attachments: attatchments.Count > 0 ? attatchments : null);
            }
            catch { }
        }

        public async Task<Models.Tutor> CheckTutorStripe(Guid tutorId)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId);
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                if (tutor.PaymentStatus == PaymentStatus.Paid)
                {
                    if (!string.IsNullOrEmpty(tutor.StripeCustomerId) && !string.IsNullOrEmpty(tutor.StripeSubscriptionId))
                    {
                        var stripeSub = await stripeHelper.GetSubscription(tutor.StripeSubscriptionId);
                        if (stripeSub.Status != "active" && stripeSub.Status != "trialing")
                        {
                            tutor.PaymentStatus = PaymentStatus.Failed;
                        }
                    }
                    else
                    {
                        tutor.PaymentStatus = PaymentStatus.Failed;
                    }
                }
                else if (tutor.PaymentStatus == PaymentStatus.Failed || tutor.PaymentStatus == PaymentStatus.Cancelled)
                {
                    if (!string.IsNullOrEmpty(tutor.StripeCustomerId) && !string.IsNullOrEmpty(tutor.StripeSubscriptionId))
                    {
                        var stripeSub = await stripeHelper.GetSubscription(tutor.StripeSubscriptionId);
                        if (stripeSub.Status == "active" || stripeSub.Status == "trialing")
                        {
                            tutor.PaymentStatus = PaymentStatus.Paid;
                        }
                    }
                }
            }

            tutor.LastTimeStripeSubscriptionChecked = DateTime.Now;
            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

            return tutor;
        }

        public async Task CancelByCompany(Guid tutorId, Models.Company company, DTO.TutorCancel model)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>()
                .GetSingle(o => o.TutorId == tutorId, includeProperties: "Users");
            tutor.PaymentStatus = PaymentStatus.Cancelled;
            tutor.TutorCancelAccountReason = model.TutorCancelAccountReason;
            tutor.TutorCancelAccountReasonDescription = model.TutorCancelAccountReasonDescription;
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
            await NotifyTutorCompanySubscriptionCancelled(tutor.TutorId, company, tutor, settings);
        }

        public async Task Cancel(Guid tutorId, DTO.TutorCancel model)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>()
                .GetSingle(o => o.TutorId == tutorId, includeProperties: "Users");
            var futureClassSessions = await _UnitOfWork.Repository<Models.ClassSession>()
                .Get(o => o.OwnerId == tutor.Users.First().Id && o.StartDate > DateTime.Now);
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

            foreach (var futureClassSession in futureClassSessions)
            {
                var futureClassSessionAttendees = await _UnitOfWork.Repository<Models.SessionAttendee>().Get(o => o.ClassSessionId == futureClassSession.ClassSessionId);
                foreach (var futureClassSessionAttendee in futureClassSessionAttendees)
                {
                    if (futureClassSessionAttendee.Refunded == false)
                    {
                        await _SessionAttendeeService.Refund(futureClassSession.ClassSessionId, futureClassSessionAttendee.SessionAttendeeId);
                    }

                    if (futureClassSessionAttendee.Removed == false)
                    {
                        await _SessionAttendeeService.Remove(futureClassSession.ClassSessionId, futureClassSessionAttendee.SessionAttendeeId, false);
                    }
                }

                futureClassSession.IsDeleted = true;
                await _UnitOfWork.Repository<Models.ClassSession>().Update(futureClassSession);
            }

            if (!string.IsNullOrEmpty(tutor.StripeSubscriptionId))
            {
                using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
                {
                    var stripeSubscription = await stripeHelper.GetSubscription(tutor.StripeSubscriptionId);
                    if (stripeSubscription != null && stripeSubscription.Status != "canceled")
                    {
                        await stripeHelper.CancelSubscription(tutor.StripeSubscriptionId);
                    }
                }
            }

            tutor.PaymentStatus = PaymentStatus.Cancelled;
            tutor.TutorCancelAccountReason = model.TutorCancelAccountReason;
            tutor.TutorCancelAccountReasonDescription = model.TutorCancelAccountReasonDescription;
            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

            try
            {
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\CancelAccountConfirmation.html"),
                    new Dictionary<string, string>()
                    {
                        { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{comebackUrl}}",  $"{_AppSettings.MainSiteUrl}/pricing" },
                        { "{{userFullName}}", tutor.Users.Select(x => x.FirstName + " " + x.LastName).First() },
                    }, tutor.Users.First().ContactEmail, settings.SendGridFromEmail, "We’re sorry to see you go");
            }
            catch { }
        }

        private async Task NotifyTutorCompanySubscriptionCancelled(Guid tutorId, Models.Company company, Models.Tutor tutor = null, Models.Setting settings1 = null)
        {
            var tutorObj = tutor ?? await GetById(tutorId);
            var settings = settings1 ?? await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\CancelTutorCompanySubscriptionConfirmation.html"),
                new Dictionary<string, string>()
                {
                        { "{{comebackUrl}}",  $"{_AppSettings.MainSiteUrl}/pricing" },
                        { "{{companyName}}",  $"{company.Name}" },
                        { "{{userFullName}}", tutor.Users.Select(x => x.FirstName + " " + x.LastName).First() },
                }, tutor.Users.First().ContactEmail, settings.SendGridFromEmail, $"{company.Name} has cancelled their subscription to 2utoring");
        }

        public async Task<byte[]> GetDbsFile(Guid tutorId)
        {
            var tutor = await GetById(tutorId);

            if (string.IsNullOrWhiteSpace(tutor.DbsCertificateFileName))
                throw new Exception("File Missing");


            var file = await _AzureFileHelper.DownloadBlob(tutor.DbsCertificateFileLocation, $"tutordbscertificates");
            file.Position = 0;

            using var mStream = new MemoryStream();
            file.CopyTo(mStream);
            return mStream.ToArray();
        }

        public async Task MarkLinkAccountMessageRead(Guid id)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == id);

            tutor.LinkAccountMessageRead = true;

            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
        }

        public async Task Delete(Guid id)
        {
            var RemoveTutor = await GetById(id);
            if (RemoveTutor != null)
            {
                RemoveTutor.IsDeleted = true;
                await _UnitOfWork.Repository<Models.Tutor>().Update(RemoveTutor);
            }
        }

        public async Task InviteTutor(Guid companyId, string name, string[] emailIds)
        {
            foreach (var splitEmail in emailIds)
            {
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\TutorInvite.html"),
                    new Dictionary<string, string>()
                    {
                        { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{userFullName}}", splitEmail },
                        { "{{companyName}}", name },
                        //{ "{{tutorSignUpUrl}}", _AppSettings.MainSiteUrl + "/tutor/register/companyprocess/" + companyId },
                        {"{{tutorSignUpUrl}}",_AppSettings.IdentitySiteUrl + "/account/register?returnUrl=" + _AppSettings.MainSiteUrl + "/tutor/register/companyprocess/" + companyId }
                    }, splitEmail, settings.SendGridFromEmail, name + $" has invited you to join 2utoring");
            }
        }

        public async Task<Models.Subscription> GetActiveSubscription(Guid tutorId)
        {
            var t = await GetById(tutorId);
            var ct = await GetCurrentCompanyTutor(t?.TutorId);
            TutorSubscription ts = null;
            CompanySubscription cs = null;

            if (ct != null)
                cs = await _UnitOfWork.Repository<Models.CompanySubscription>()
                .GetSingle(x => x.CompanyId == ct.CompanyId &&
                    x.StartDateTime != null && x.StartDateTime <= DateTime.UtcNow &&
                    (x.EndDateTime == null || x.EndDateTime >= DateTime.UtcNow), includeProperties: "Company, Subscription");
            else
                ts = await _UnitOfWork.Repository<Models.TutorSubscription>()
                    .GetSingle(x => x.TutorId == tutorId &&
                        x.StartDateTime != null && x.StartDateTime <= DateTime.UtcNow &&
                        (x.EndDateTime == null || x.EndDateTime >= DateTime.UtcNow), includeProperties: "Tutor, Subscription");

            return (ct != null) ? cs?.Subscription : ts?.Subscription;
        }

        public async Task UpdateTutorSubscriptioPlan(DTO.TutorSubcriptionPlan model)
        {
            #region Update Tutor DBS and Profile Approve Status
            if (model.TutorId != Guid.Empty)
            {
                bool exists = Enum.IsDefined(typeof(TutorApprovalStatus), model.DbsProfileApproval);
                if (exists)
                {
                    var tutor = await GetById(model.TutorId);
                    if (tutor != null)
                    {
                        tutor.DbsApprovalStatus = model.DbsProfileApproval;
                        tutor.ProfileApprovalStatus = model.DbsProfileApproval;
                        await Update(tutor);
                    }
                }
            }
            #endregion

            #region Remove Old Subcription
            var oldSubs = await _UnitOfWork.Repository<TutorSubscription>().GetSingle(x => x.TutorId == model.TutorId && x.IsDeleted == false);
            if (oldSubs != null)
            {
                oldSubs.IsDeleted = true;
                oldSubs.EndDateTime = DateTime.Now;
                var updatedOldSub = await _UnitOfWork.Repository<TutorSubscription>().Update(oldSubs);
                if (updatedOldSub > 0)
                {
                    #region Insert New Subcription
                    TutorSubscription newSub = new TutorSubscription();
                    newSub.SubscriptionId = model.SubscriptionId;
                    newSub.TutorId = model.TutorId;
                    newSub.StartDateTime = DateTime.Now;
                    await _UnitOfWork.Repository<TutorSubscription>().Insert(newSub);
                    #endregion
                }
            }
            #endregion


        }


        public async Task<List<DTO.BookedSlot>> GetBookedSlot(Guid tutorId)
        {
            var bookedCourse = await _UnitOfWork.Repository<Models.Course>().Get(o => o.TutorId == tutorId, includeProperties: "ClassSessions");
            List<DTO.BookedSlot> BookedSlot = new List<DTO.BookedSlot>();
            if (bookedCourse != null && bookedCourse.Count > 0)
            {
                foreach (var course in bookedCourse)
                {
                    if (course.ClassSessions.Count > 0)
                    {
                        foreach (var item in course.ClassSessions.Where(x => x.IsDeleted == false).ToList())
                        {
                            BookedSlot.Add(new DTO.BookedSlot
                            {
                                CourseId = course.CourseId,
                                StartDate = item.StartDate,
                                EndDate = item.EndDate
                            });
                        }
                    }

                }
            }
            return BookedSlot;
        }

        public async Task<ClassSessionFeatures> GetSubscriptionFeatureSet(Guid tutorId)
        {
            var sub = await GetActiveSubscription(tutorId);
            var sf = await subscriptionFeatureService.GetSubscriptionFeatures(sub.SubscriptionId);
            var sfs = new SubscriptionFeatureSet(sf);
            return sfs.ToClassSessionFeatures();
        }
        public async Task<DTO.Tutor> GetTutorProfile(Guid tutorId)
        {

            DTO.Tutor tutorDetail = new DTO.Tutor();
            Models.Tutor tutor = null; ;
            if (_HttpContext.HttpContext.User.Identity.IsAuthenticated)
            {
                var logedInUser = await _UserManager.FindByEmailAsync(_HttpContext.HttpContext.User.Identity.Name);

                if (logedInUser != null && logedInUser.TutorId == tutorId)
                {
                    tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId && o.IsDeleted == false, includeProperties: "Users,TutorQualifications,CompanyTutors.Company");
                }
                else
                {
                    var isAdmin = await _UserManager.IsInRoleAsync(logedInUser, "Admin");
                    var isSuperAdmin = await _UserManager.IsInRoleAsync(logedInUser, "Super Admin");
                    var company = await GetTutorCompany(tutorId);
                    if ((isAdmin && company != null) || isSuperAdmin)
                    {
                        tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId && o.IsDeleted == false, includeProperties: "Users,TutorQualifications,CompanyTutors.Company");
                    }
                    else
                    {
                        tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId && o.IsDeleted == false && o.ProfileApprovalStatus == TutorApprovalStatus.Approved, includeProperties: "Users,TutorQualifications,CompanyTutors.Company");
                    }
                }
            }
            else
            {
                tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId && o.IsDeleted == false && o.ProfileApprovalStatus == TutorApprovalStatus.Approved, includeProperties: "Users,TutorQualifications,CompanyTutors.Company");
            }
            if (tutor != null)
            {
                tutorDetail = Mappings.Mapper.Map<Models.Tutor, DTO.Tutor>(tutor);
                var company = tutor.CompanyTutors.FirstOrDefault();
                if (company != null)
                {
                    tutorDetail.CurrentCompany = Mappings.Mapper.Map<Models.Company, DTO.Company>(company.Company);
                    var CompanyCourses = await _UnitOfWork.Repository<Models.Course>().Get(o => o.IsDeleted == false && o.CourseType == CourseType.Public && o.CompanyId == company.CompanyId && o.Tutor.ProfileApprovalStatus == TutorApprovalStatus.Approved && o.Completed == false && o.Cancelled == false && o.EndDate.Value.UtcDateTime >= DateTime.UtcNow, includeProperties: "Subject,StudyLevel,ClassSessions.SessionAttendees,OrderItems");
                    var CompanyCourseList = Mappings.Mapper.Map<List<Models.Course>, List<DTO.Course>>(CompanyCourses);
                    tutorDetail.CurrentCompany.CompanyCourseCount = CompanyCourseList.Where(x => x.CourseAttendeesCount < x.MaxClassSize).Count();
                    tutorDetail.CurrentCompany.CompanyCourses = CompanyCourseList.Take(3).ToList();
                }

                List<string> subject = new List<string>();
                List<string> tutorQualifications = new List<string>();
                var tutorPriceList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.TutorId == tutorId && o.IsDeleted == false, includeProperties: "Subject,StudyLevel");
                if (company != null)
                {
                    tutorDetail.SubjectStudyLevelSetup = new List<DTO.SubjectStudyLevelSetup>();
                    foreach (var item in tutorPriceList)
                    {
                        var P1 = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().GetSingle(o => o.CompanyId == company.CompanyId && o.SubjectId == item.SubjectId && o.StudyLevelId == item.StudyLevelId && o.IsDeleted == false && o.CreatedBy == item.CreatedBy);
                        if (P1 != null)
                        {
                            var P2 = Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetup>(P1);
                            tutorDetail.SubjectStudyLevelSetup.Add(P2);
                        }

                    }
                }
                else
                {
                    tutorDetail.SubjectStudyLevelSetup = Mappings.Mapper.Map<List<Models.SubjectStudyLevelSetup>, List<DTO.SubjectStudyLevelSetup>>(tutorPriceList);
                }

                if (tutorDetail.SubjectStudyLevelSetup.Count > 0)
                {
                    tutorDetail.SubjectStudyLevelSetup = tutorDetail.SubjectStudyLevelSetup.OrderBy(x => x.SubjectName).ToList();
                    tutorDetail.TutorPriceLesson.OneToOneMinPrice = tutorDetail.SubjectStudyLevelSetup.Min(x => x.PricePerPerson);
                    tutorDetail.TutorPriceLesson.OneToOneMaxPrice = tutorDetail.SubjectStudyLevelSetup.Max(x => x.PricePerPerson);
                    tutorDetail.TutorPriceLesson.GroupMinPrice = Convert.ToDecimal(tutorDetail.SubjectStudyLevelSetup.Min(x => x.GroupPricePerPerson));
                    tutorDetail.TutorPriceLesson.GroupMaxPrice = Convert.ToDecimal(tutorDetail.SubjectStudyLevelSetup.Max(x => x.GroupPricePerPerson));
                    tutorDetail.TutorSubjectNameList = tutorDetail.SubjectStudyLevelSetup.Select(x => x.SubjectName).Distinct().ToList();
                }
                if (tutor.TutorQualifications.Count > 0)
                {
                    tutorDetail.TutorQualification = tutor.TutorQualifications.Where(x => !x.IsDeleted).Select(x => x.Name).ToList();
                }
                var TutorLessonList = await _UnitOfWork.Repository<Models.ClassSession>().Get(o => o.OwnerId == tutor.Users.FirstOrDefault().Id && o.Complete == true && o.EndedAtDate >= DateTime.Now.AddDays(-30));
                if (TutorLessonList.Count > 0)
                {
                    tutorDetail.TutorPriceLesson.OneToOneLessonCount = TutorLessonList.Count(x => x.MaxPersons == 1 && x.Complete == true);
                    tutorDetail.TutorPriceLesson.GroupLessonCount = TutorLessonList.Count(x => x.MaxPersons > 1 && x.Complete == true);
                }

                var user = tutor.Users.FirstOrDefault();
                var existingLogins = await _UserManager.GetLoginsAsync(user);
                if (existingLogins.Any(o => o.LoginProvider == "Google"))
                {
                    tutorDetail.HasGoogleAccountLinked = true;
                }

                #region Course
                tutorDetail.TutorCourseList = new List<DTO.Course>();
                var tutorCourseList = await _UnitOfWork.Repository<Models.Course>().Get(o => o.IsDeleted == false && o.Tutor.ProfileApprovalStatus == TutorApprovalStatus.Approved && o.TutorId == tutor.TutorId && o.Completed == false && o.Cancelled == false && o.CourseType == CourseType.Public && o.EndDate.Value.UtcDateTime >= DateTime.UtcNow
            , includeProperties: "ClassSessions.SessionAttendees,OrderItems");
                var tutorCourse = Mappings.Mapper.Map<List<Models.Course>, List<DTO.Course>>(tutorCourseList);
                foreach (var item in tutorCourse)
                {
                    var classSessionList = item.ClassSessions.Where(o => o.CourseId == item.CourseId
                    && o.StartDate.AddHours(-1).UtcDateTime >= DateTime.UtcNow
                    && o.EndDate.UtcDateTime >= DateTime.UtcNow
                    && o.IsDeleted == false).ToList();
                    if (classSessionList.Count > 0)
                    {
                        if (item.CourseAttendeesCount < item.MaxClassSize)
                        {
                            tutorDetail.TutorCourseList.Add(item);
                        }
                    }
                }
                #endregion


            }
            else
            {
                tutorDetail = null;
            }
            return tutorDetail;

        }

        public async Task<bool> UpdateIdVerificationStauts(Guid tutorId, bool status)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId);
            if (tutor != null)
            {

                tutor.IDVerificationtStatus = TutorApprovalStatus.Approved;
                await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
                return true;
            }
            return false;
        }
        public async Task<List<DTO.TutorCertificate>> GetDBSCirtificates(Guid tutorId)
        {
            var CirtificatesList = await _UnitOfWork.Repository<Models.TutorCertificate>().Get(x => x.TutorId == tutorId && x.IsDeleted == false && x.CertificateType == TutorCertificateType.DBS);
            return Mappings.Mapper.Map<List<Models.TutorCertificate>, List<DTO.TutorCertificate>>(CirtificatesList);
        }
        public async Task<List<DTO.TutorCertificate>> GetTutorAllCirtificates(Guid tutorId)
        {
            var CirtificatesList = await _UnitOfWork.Repository<Models.TutorCertificate>().Get(x => x.TutorId == tutorId && x.IsDeleted == false);
            return Mappings.Mapper.Map<List<Models.TutorCertificate>, List<DTO.TutorCertificate>>(CirtificatesList);
        }
    }


}

