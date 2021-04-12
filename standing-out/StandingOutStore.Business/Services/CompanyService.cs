using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Data.DTO.CompanyRegister;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data.Enums;
using StandingOut.Shared.Helpers.AzureFileHelper;
using StandingOut.Shared.Integrations.Stripe;
using Mapping = StandingOut.Shared.Mapping;
using StandingOut.Data.Models;
using StandingOutStore.Business.Services.Interfaces;
using Remotion.Linq.Clauses;
using StandingOut.Shared.Mapping;

namespace StandingOutStore.Business.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IAzureFileHelper _AzureFileHelper;
        private bool _Disposed;

        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly ITutorService tutorService;

        public CompanyService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings,
            UserManager<Models.User> userManager, IAzureFileHelper azureFileHelper,
            ISessionAttendeeService sessionAttendeeService,
            ITutorService tutorService)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _AzureFileHelper = azureFileHelper;
            _SessionAttendeeService = sessionAttendeeService;
            //this.tutorSubscriptionService = tutorSubscriptionService;
            this.tutorService = tutorService;
        }

        public CompanyService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.Company>> Get()
        {
            return await _UnitOfWork.Repository<Models.Company>().Get();
        }

        public async Task<DTO.CompanyRegister.CompanyRegisterPayment> UpdatePayment(DTO.CompanyRegister.CompanyRegisterPayment model)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            var company = await _UnitOfWork.Repository<Models.Company>().GetSingle(o => o.CompanyId == model.CompanyId);
            var dbStripePlan = await _UnitOfWork.Repository<Models.StripePlan>().GetSingle(o => o.StripePlanId == model.StripePlanId);

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
                    //THEY ARE HERE FOR THE FIRST TIME
                    Stripe.Plan stripePlan = await stripeHelper.GetPlan(dbStripePlan.StripeProductId);
                    if (!string.IsNullOrEmpty(company.StripeCustomerId))
                    {
                        //HANDLE CARDS
                        var stripeCustomer = await stripeHelper.GetCustomer(company.StripeCustomerId);
                        var oldCard = await stripeHelper.GetPaymentMethod(stripeCustomer.InvoiceSettings.DefaultPaymentMethodId);
                        if (oldCard != null)
                            await stripeHelper.DeletePaymentMethod(company.StripeCustomerId, oldCard.Id);

                        await stripeHelper.CreatePaymentMethod(company.StripeCustomerId, model.PaymentMethodId);

                        Stripe.Subscription stripeSubscription = null;
                        if (!string.IsNullOrEmpty(company.StripeSubscriptionId))
                        {
                            stripeSubscription = await stripeHelper.GetSubscription(company.StripeSubscriptionId);
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
                            Plan = stripePlan.Id,
                            Quantity = 1
                        }
                    }
                            });
                            company.StripeSubscriptionId = stripeSubscription.Id;
                            await _UnitOfWork.Repository<Models.Company>().Update(company);
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

        public async Task<Models.Company> UpdateInitialRegisterStep(Guid companyId, int step)
        {
            var company = await _UnitOfWork.Repository<Models.Company>().GetSingle(x => x.CompanyId == companyId, includeProperties: "");
            if (step > company.InitialRegistrationStep)
            { // only update if they have progressed
                company.InitialRegistrationStep = step;
            }
            var previousInitialRegistrationComplete = company.InitialRegistrationComplete;
            if (step > 7)
            { // they have completed journey
                company.InitialRegistrationComplete = true;
            }

            await _UnitOfWork.Repository<Models.Company>().Update(company);

            if (company.InitialRegistrationComplete != previousInitialRegistrationComplete)
            {
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();

                //try
                //{
                //    await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                //        System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\TutorProfileUnderReviewConfirmation.html"),
                //        new Dictionary<string, string>()
                //        {
                //            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                //            { "{{tutorFullName}}", company.Users.Select(x => x.FirstName + " " + x.LastName).First() },
                //        }, company.Users.First().ContactEmail, settings.SendGridFromEmail, $"Your profile is currently under review");
                //}
                //catch { }

                try
                {
                    await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                        System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\AdminNotifiedNewCompanyProfile.html"),
                        new Dictionary<string, string>()
                        {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{companyFullName}}", company.Name },
                            { "{{companyId}}", company.CompanyId.ToString() }
                        }, settings.SignUpEmail, settings.SendGridFromEmail, $"{company.Name} has signed-up to 2utoring");
                }
                catch { }
            }

            return company;
        }

        public async Task SaveProfileOne(CompanyRegisterProfileOne model)
        {
            var company = await GetById(model.CompanyId, includeProperties: "");
            company.Description = model.CompanyDescription;
            company.WhoWeAre = model.WhoWeAre;
            company.WhatWeDo = model.WhatWeDo;
            company.WhyWeDoIt = model.WhyWeDoIt;
            company.WhyChooseUs = model.WhyChooseUs;

            if (!string.IsNullOrEmpty(company.Description)
               && !string.IsNullOrEmpty(company.WhoWeAre)
               && !string.IsNullOrEmpty(company.WhatWeDo)
               && !string.IsNullOrEmpty(company.WhyWeDoIt)
               && !string.IsNullOrEmpty(company.WhyChooseUs)
               )
            {
                company.ProfileSetupStarted = true;
                company.ProfileFieldsAllComplete = true;
            }
            else
            {
                company.ProfileSetupStarted = true;
                company.ProfileFieldsAllComplete = false;
            }
            await Update(company);
        }
        public async Task SaveProfileThree(CompanyRegisterProfileThree model)
        {
            var company = await GetById(model.CompanyId, includeProperties: "");
            company.Description = model.CompanyDescription;
            //company.WhoWeAre = model.WhoWeAre;
            //company.WhatWeDo = model.WhatWeDo;
            //company.WhyWeDoIt = model.WhyWeDoIt;
            //company.WhyChooseUs = model.WhyChooseUs;
            await Update(company);
        }

        public async Task AddCompanyMember(Guid companyId, CompanyMember companyMember)
        {
            var company = await GetById(companyId, includeProperties: "AdminUser, CompanyTeam");
            company.CompanyTeam.Add(companyMember);
            await Update(company);
        }

        public async Task RemoveCompanyMember(Guid companyId, Guid companyMemberId)
        {
            var company = await GetById(companyId, includeProperties: "AdminUser, CompanyTeam");
            var mbrToRemove = company.CompanyTeam.FirstOrDefault(x => x.CompanyTeamId == companyMemberId);
            if (mbrToRemove != null)
            {
                await _UnitOfWork.Repository<CompanyMember>().Delete(mbrToRemove);
            }
        }

        public async Task ProfileUpload(Guid companyId, IFormFile file)
        {
            var company = await GetById(companyId);
            using var stream = file.OpenReadStream();
            company.ProfileImageFileName = file.FileName;
            try
            {
                company.ProfileImageFileLocation = await _AzureFileHelper.UploadBlob(stream, Guid.NewGuid() + file.FileName.Substring(file.FileName.LastIndexOf('.')), $"companyprofileimages");
            }
            catch (Exception)
            {
                company.ProfileImageFileLocation = "38315803-deb2-43e3-a95b-262ab1769c49.jpg";
            }
            await _UnitOfWork.Repository<Models.Company>().Update(company);
        }

        public async Task<List<CompanyRegisterProfileTeam>> GetTeamData(Guid companyId)
        {
            var company = await GetById(companyId, includeProperties: "AdminUser, CompanyTeam");
            var teamData = Mapping.Mappings.Mapper.Map<List<CompanyMember>, List<CompanyRegisterProfileTeam>>(company.CompanyTeam);
            return teamData;
        }

        // Registration Page 1
        public async Task<Models.Company> SaveBasicInfo(CompanyRegisterBasicInfo model)
        {
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Email == model.Email);

            user.Title = model.Title;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.MobileNumber = model.MobileNumber;
            user.TelephoneNumber = model.TelephoneNumber;
            user.DateOfBirth = model.DateOfBirth;
            user.TermsAndConditionsAccepted = model.TermsAndConditionsAccepted;
            user.MarketingAccepted = model.MarketingAccepted;

            model.UserId = user.Id;
            await _UserManager.UpdateAsync(user);

            await _UserManager.AddToRoleAsync(user, "Admin");

            var company = await GetByAdminUser(user);
            if (company != null)
            {
                company.Name = model.CompanyName;
                company.RegistrationNo = model.CompanyRegistrationNumber;
                company.AddressLine1 = model.AddressLine1;
                company.AddressLine2 = model.AddressLine2;
                company.Postcode = model.CompanyPostcode;
                company.Country = model.Country;
                company.TelephoneNumber = model.CompanyTelephoneNumber;
                company.MobileNumber = model.CompanyMobileNumber;
                company.EmailAddress = model.CompanyEmail;
                company.TermsAndConditionsAccepted = model.TermsAndConditionsAccepted;
                company.MarketingAccepted = model.MarketingAccepted;

                await Update(company);
            }
            else
            {
                company = await Create(model); // Update company again in payment method with stripe data.
                //await CreateCompanySubscription(company.CompanyId, model.StripePlanId.Value);

            }

            return company;
        }

        private CompanyRegisterPayment BuildRegistrationReturnObject(CompanyRegisterPayment model,
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

        // Registration screen 2 - Create payment method and save company
        public async Task<CompanyRegisterPayment> SavePayment(CompanyRegisterPayment model)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Id == model.UserId);

            if (user == null) return null;

            var company = await GetByAdminUser(user);

            company.StripePlanId = model.StripePlanId;
            await _UnitOfWork.Repository<Models.Company>().Update(company);

            //await _CompanySubscriptionService.CreateCompanySubscription(company.CompanyId, model.StripePlanId);

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
                    var stripeCustomer = await stripeHelper.CreateCustomer(company.Name, user.Email, model.PaymentMethodId);
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
                    company.StripePlanId = dbStripePlan.StripePlanId;
                    company.PaymentStatus = PaymentStatus.Paid;
                    company.StripeCustomerId = model.StripeCustomerId;
                    company.StripeSubscriptionId = model.StripeSubscriptionId;
                    company.PromoCode = model.PromoCode;
                    await _UnitOfWork.Repository<Models.Company>().Update(company);

                    try
                    {
                        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                            System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\CompanySignUpConfirmation.html"),
                            new Dictionary<string, string>()
                            {
                            { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                            { "{{userFullName}}", user.FirstName + " " + user.LastName },
                            { "{{companyName}}", company.Name },
                            }, user.ContactEmail, settings.SendGridFromEmail, $"Thank you for registering {company.Name} with 2utoring");

                        await SetCompanyUrlSlug(company.CompanyId, company);
                    }
                    catch { }
                }
            }

            return model;
        }

        public async Task<Models.Company> GetByUrlSlug(string urlSlug)
        {
            if (string.IsNullOrEmpty(urlSlug)) return null;
            var companies = await _UnitOfWork.GetContext().Companys.ToListAsync();
            if (companies.Any())
            {
                var matched = companies.FirstOrDefault(x => urlSlug.Equals(x.UrlSlug, comparisonType: StringComparison.InvariantCultureIgnoreCase));
                return matched;
            }
            return null;
            // return await _UnitOfWork.Repository<Models.Company>().GetSingle(o => o.UrlSlug.ToLowerInvariant() == urlSlug.ToLowerInvariant()); Erroring 
        }

        public async Task<Models.Company> SetCompanyUrlSlug(Guid id, Company company = null)
        {
            var company1 = company ?? await GetById(id);
            if (company1 != null)
            {
                var companiesWithSameName = await _UnitOfWork.GetContext().Companys.Where(o => o.CompanyId != company1.CompanyId &&
                            o.Name.ToLowerInvariant() == company1.Name.ToLowerInvariant()).CountAsync();
                if (companiesWithSameName == 0)
                {
                    company1.UrlSlug = $"{company1.Name}";
                }
                else
                {
                    company1.UrlSlug = $"{company1.Name}{companiesWithSameName}";
                }
                await _UnitOfWork.Repository<Models.Company>().Update(company1);
            }
            return company1;
        }


        public async Task<Models.Company> GetById(Guid id, string includeProperties = "")
        {
            return await _UnitOfWork.Repository<Models.Company>().GetSingle(o => o.CompanyId == id, includeProperties: includeProperties);
        }

        public async Task<bool> IsCompanyTutor(User user)
        {
            if (!user.TutorId.HasValue) return false;

            var ct = await _UnitOfWork.Repository<Models.CompanyTutor>()
                .GetSingle(o => o.TutorId == user.TutorId.Value &&
                    (o.ActualStartDate != null && o.ActualStartDate <= DateTime.UtcNow) &&
                    (o.ActualEndDate == null || o.ActualEndDate >= DateTime.UtcNow));

            return (ct != null);
        }

        public async Task<Models.Company> GetByAdminUser(Models.User adminUser, string includeProperties = "")
        {
            return await _UnitOfWork.Repository<Models.Company>().GetSingle(o => o.AdminUserId == adminUser.Id, includeProperties: includeProperties);
        }

        /// <summary>
        /// 11 Sep email discussion with Sukh 
        /// - Only new tutors can signup with a company.
        /// - No tutor subscription would be setup as the company subscription applies.
        /// - 
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task Cancel(Guid companyId, DTO.CompanyCancel model)
        {
            //throw new NotImplementedException("Company cancel not implemented yet!");
            var company = await GetById(companyId, includeProperties: "AdminUser, CompanyTutors, Courses");

            var futureClassSessions = await _UnitOfWork.Repository<Models.ClassSession>()
                .Get(o => o.Course != null && o.Course.CompanyId == companyId && o.StartDate > DateTime.Now);

            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

            await CancelAndRefundFutureSessions(futureClassSessions);

            await CancelTheCompanyTutorAssociations(company.CompanyTutors, settings); // ActiveCompanyTutors

            //await ReInstateTheTutorsLastSubscription(company.ActiveCompanyTutors); // ActiveCompanyTutors

            if (!string.IsNullOrEmpty(company.StripeSubscriptionId))
            {
                using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
                {
                    var stripeSubscription = await stripeHelper.GetSubscription(company.StripeSubscriptionId);
                    if (stripeSubscription != null && stripeSubscription.Status != "canceled")
                    {
                        await stripeHelper.CancelSubscription(company.StripeSubscriptionId);
                    }
                }
            }

            company.PaymentStatus = PaymentStatus.Cancelled;
            company.CompanyCancelAccountReason = model.CompanyCancelAccountReason;
            company.CompanyCancelAccountReasonDescription = model.CompanyCancelAccountReasonDescription;
            await _UnitOfWork.Repository<Models.Company>().Update(company);

            try
            {
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\CancelAccountConfirmation.html"),
                    new Dictionary<string, string>()
                    {
                        { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{comebackUrl}}",  $"{_AppSettings.MainSiteUrl}/pricing" },
                        { "{{userFullName}}", company.AdminUser.FirstName + " " + company.AdminUser.LastName },
                    }, company.AdminUser.ContactEmail, settings.SendGridFromEmail, "We’re sorry to see you go");
            }
            catch { }
        }

        private async Task CancelAndRefundFutureSessions(List<ClassSession> futureClassSessions)
        {
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
        }

        private async Task CancelTheCompanyTutorAssociations(List<CompanyTutor> activeCompanyTutors, Setting settings)
        {
            if (!activeCompanyTutors.Any()) return;

            foreach (var companyTutor in activeCompanyTutors)
            {
                companyTutor.ActualEndDate = DateTime.UtcNow;
                await _UnitOfWork.Repository<Models.CompanyTutor>().Update(companyTutor);

                // Cancel the tutor's subscription
                await tutorService.CancelByCompany(companyTutor.TutorId, companyTutor.Company, new DTO.TutorCancel
                {
                    TutorCancelAccountReason = TutorCancelAccountReason.Other,
                    TutorCancelAccountReasonDescription = "Tutor account cancelled due to company cancellation."
                });
            }
        }

        private async Task ReInstateTheTutorsLastSubscription(List<CompanyTutor> activeCompanyTutors)
        {
            throw new NotImplementedException("ReInstateTheTutorsLastSubscription not implemented..");
            //if (!activeCompanyTutors.Any()) return;

            //foreach (var companyTutor in activeCompanyTutors)
            //{
            //    // Restore the Tutor's previous subscription if any.. or cancel their subscription as well.
            //    var tutorsLastSubscription = await tutorSubscriptionService.GetLastTutorSubscription(companyTutor.TutorId);

            //    if (tutorsLastSubscription != null && tutorsLastSubscription.EndDateTime <= DateTime.UtcNow)
            //    {
            //        await tutorSubscriptionService.ReinstateTutorSubscription(tutorsLastSubscription);
            //        // Notify of reinstatement of their last subscription.
            //    }
            //}
        }

        public async Task<DTO.PagedList<DTO.PagedTutorBankDetails>> PagedBankDetails(DTO.SearchModel model, Guid? companyId)
        {
            IQueryable<Models.CompanyTutor> data = _UnitOfWork.Repository<Models.CompanyTutor>()
                .GetQueryable(includeProperties: "Tutor, Company, Tutor.Users");

            if (companyId != Guid.Empty && companyId != null)
            {
                data = data.Where(x => x.IsDeleted == false &&
                                    x.CompanyId == companyId &&
                                    x.ActualStartDate <= DateTime.UtcNow &&
                                    (x.ActualEndDate == null || x.ActualEndDate > DateTime.UtcNow));
            }
            else
            {
                data = data.Where(x => 1 == 1);
            }

            //if (!string.IsNullOrWhiteSpace(model.Search))
            //{
            //    string search = model.Search.ToLower();
            //    data = data.Where(o => (o.FirstName != null && o.FirstName.ToLower().Contains(search)) ||
            //        (o.LastName != null && o.LastName.ToLower().Contains(search)) ||
            //        (o.Email != null && o.Email.ToLower().Contains(search))
            //    );
            //}

            var result = new DTO.PagedList<DTO.PagedTutorBankDetails>();

            System.Reflection.PropertyInfo prop = typeof(Models.CompanyTutor).GetProperty(model.SortType);
            //if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            //{
            //    data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            //}
            //else
            {
                //perform some manual sorting (if required, this should only be for sub-objects).
                if (model.SortType == "BankAccountNumber")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.Tutor.BankAccountNumber) :
                                                    data.OrderByDescending(o => o.Tutor.BankAccountNumber);
                }
                if (model.SortType == "BankSortCode")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.Tutor.BankSortCode) :
                                                    data.OrderByDescending(o => o.Tutor.BankSortCode);
                }
                if (model.SortType == "UserFullName")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.Tutor.Users.FirstOrDefault().FirstName + o.Tutor.Users.FirstOrDefault().LastName) :
                                                    data.OrderByDescending(o => o.Tutor.Users.FirstOrDefault().FirstName + o.Tutor.Users.FirstOrDefault().LastName);
                }
                else if (model.SortType == "Email")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.Tutor.Users.FirstOrDefault().Email) :
                                                    data.OrderByDescending(o => o.Tutor.Users.FirstOrDefault().Email);
                }
            }

            result.Data = Mapping.Mappings.Mapper.Map<List<Models.CompanyTutor>, List<DTO.PagedTutorBankDetails>>(await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;

            return result;
        }

        public async Task<Models.Company> CheckCompanyStripe(Guid companyId)
        {
            var company = await _UnitOfWork.Repository<Models.Company>().GetSingle(o => o.CompanyId == companyId);
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                if (company.PaymentStatus == PaymentStatus.Paid)
                {
                    if (!string.IsNullOrEmpty(company.StripeCustomerId) && !string.IsNullOrEmpty(company.StripeSubscriptionId))
                    {
                        var stripeSub = await stripeHelper.GetSubscription(company.StripeSubscriptionId);
                        if (stripeSub.Status != "active" && stripeSub.Status != "trialing")
                        {
                            company.PaymentStatus = PaymentStatus.Failed;
                        }
                    }
                    else
                    {
                        company.PaymentStatus = PaymentStatus.Failed;
                    }
                }
                else if (company.PaymentStatus == PaymentStatus.Failed || company.PaymentStatus == PaymentStatus.Cancelled)
                {
                    if (!string.IsNullOrEmpty(company.StripeCustomerId) && !string.IsNullOrEmpty(company.StripeSubscriptionId))
                    {
                        var stripeSub = await stripeHelper.GetSubscription(company.StripeSubscriptionId);
                        if (stripeSub.Status == "active" || stripeSub.Status == "trialing")
                        {
                            company.PaymentStatus = PaymentStatus.Paid;
                        }
                    }
                }
            }

            company.LastTimeStripeSubscriptionChecked = DateTime.Now;
            await _UnitOfWork.Repository<Models.Company>().Update(company);

            return company;
        }

        public async Task<Models.Company> Create(CompanyRegisterBasicInfo model)
        {
            var company = Mapping.Mappings.Mapper.Map<CompanyRegisterBasicInfo, Models.Company>(model);
            await _UnitOfWork.Repository<Models.Company>().Insert(company);

            return company;
        }

        public async Task<Models.Company> Create(DTO.CreateCompany model)
        {
            var company = Mapping.Mappings.Mapper.Map<DTO.CreateCompany, Models.Company>(model);
            await _UnitOfWork.Repository<Models.Company>().Insert(company);

            if (model.File != null)
            {
                var fileStream = model.File.OpenReadStream();
                fileStream.Position = 0;
                company.ImageName = await _AzureFileHelper.UploadBlob(fileStream, model.File.FileName, $"company-{company.CompanyId.ToString().ToLower()}");
                await _UnitOfWork.Repository<Models.Company>().Update(company);
            }

            return company;
        }

        public async Task<Models.Company> Create(Models.Company model)
        {
            await _UnitOfWork.Repository<Models.Company>().Insert(model);
            return model;
        }

        public async Task<Models.Company> Update(DTO.EditCompany model)
        {
            var company = await _UnitOfWork.Repository<Models.Company>().GetByID(model.CompanyId);

            company.Name = model.Name;
            company.Header = model.Header;
            company.SubHeader = model.SubHeader;
            company.Biography = model.Biography;

            if (model.File != null)
            {
                var fileStream = model.File.OpenReadStream();
                fileStream.Position = 0;
                company.ImageName = await _AzureFileHelper.UploadBlob(fileStream, model.File.FileName, $"company-{company.CompanyId.ToString().ToLower()}");
                await _UnitOfWork.Repository<Models.Company>().Update(company);
            }

            await _UnitOfWork.Repository<Models.Company>().Update(company);
            return company;
        }

        public async Task<Models.Company> Update(Models.Company model)
        {
            await _UnitOfWork.Repository<Models.Company>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var model = await GetById(id);
            model.IsDeleted = true;
            await Update(model);
        }

        public async Task<DTO.CompanyProfile> GetProfileById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.Company>().GetQueryable(x => x.CompanyId == id, includeProperties: "CompanyTutors, CompanyTutors.Tutor, CompanyTutors.Tutor.Users")
                .Select(x => Mapping.Mappings.Mapper.Map<Models.Company, DTO.CompanyProfile>(x))
                .FirstOrDefaultAsync();
        }

        public async Task<bool> IsUserCompanyAdmin(Models.User user)
        {
            var company = await GetByAdminUser(user);
            return company?.AdminUserId == user.Id;
        }

        public async Task<bool> IsAdminUserForCompany(Models.User user, Guid CompanyId)
        {
            var company = await GetById(CompanyId);
            return company?.AdminUserId == user.Id;
        }

        public async Task<Models.Subscription> GetActiveSubscription(Guid companyId)
        {
            var cs = await _UnitOfWork.Repository<Models.CompanySubscription>()
                .GetSingle(x => x.CompanyId == companyId &&
                    x.StartDateTime != null && x.StartDateTime <= DateTime.UtcNow &&
                    (x.EndDateTime == null || x.EndDateTime >= DateTime.UtcNow), includeProperties: "Company, Subscription");

            return cs?.Subscription;
        }
        public async Task<DTO.CompanyProfileViewModel> GetAboutCompany(Guid companyId)
        {

            string includeProperties = "CompanyTeam,CompanyTutors, CompanyTutors.Tutor,CompanyTutors.Tutor.TutorQualifications, CompanyTutors.Tutor.Users, Courses,Courses.Tutor,Courses.ClassSessions,SubjectStudyLevelSetups,SubjectStudyLevelSetups.Subject,SubjectStudyLevelSetups.StudyLevel";
            var company = await _UnitOfWork.Repository<Models.Company>().GetSingle(o => o.CompanyId == companyId, includeProperties: includeProperties);
            var ObjCompany = Mapping.Mappings.Mapper.Map<Models.Company, DTO.CompanyProfileViewModel>(company);
            ObjCompany.Courses = ObjCompany.Courses.Where(x => x.CourseType == CourseType.Public && x.CourseAttendeesCount < x.MaxClassSize && x.Completed == false && x.Cancelled == false && x.EndDate.Value.UtcDateTime >= DateTime.UtcNow).ToList();
            foreach (var item in ObjCompany.Courses)
            {
                var classSession = item.ClassSessions.Where(y => y.StartDate.UtcDateTime >= DateTime.UtcNow).ToList();
                item.ClassSessions.Clear();
                item.ClassSessions = classSession;
                item.ClassSessionsTotalAmount = classSession.Sum(x => x.PricePerPerson);
                item.ClassSessionsCount = classSession.Count;

                #region Tutor Availabilities and Booked slot
                item.TotalBookedSlot = await GetBookedSlot(item.CreatorUserId);
                item.TotalSlotCount = await GetFutureAvailableSlot(Guid.Parse(item.TutorId.ToString()));
                #endregion
                #region Tutor Availabilities and Booked slot
                var TutorAvailabilities = await _UnitOfWork.Repository<Models.TutorAvailability>().Get(o => o.TutorId == item.TutorId && o.IsDeleted == false);
                int totalSlotCount = 0;
                foreach (var av in TutorAvailabilities)
                {
                    totalSlotCount = totalSlotCount + Convert.ToInt32((av.NoOfWeek == 0 ? 1 : av.NoOfWeek));
                }
                item.TotalSlotCount = totalSlotCount;
                item.TotalBookedSlot = classSession.Count;
                #endregion
            }

            foreach (var tutorItem in ObjCompany.Tutors)
            {
                tutorItem.SubjectStudyLevelSetup = new List<DTO.SubjectStudyLevelSetup>();
                var tutorPriceList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.TutorId == tutorItem.TutorId && o.IsDeleted == false, includeProperties: "Subject,StudyLevel");
                foreach (var item1 in tutorPriceList)
                {
                    var P1 = ObjCompany.SubjectStudyLevelSetups.Where(o => o.OwningEntityId == companyId && o.SubjectId == item1.SubjectId && o.StudyLevelId == item1.StudyLevelId).Select(x => x).FirstOrDefault();
                    if (P1 != null)
                    {
                        tutorItem.SubjectStudyLevelSetup.Add(P1);
                    }
                }

                if (tutorItem.SubjectStudyLevelSetup.Count > 0)
                {

                    tutorItem.TutorPriceLesson.OneToOneMinPrice = tutorItem.SubjectStudyLevelSetup.Min(x => x.PricePerPerson);
                    tutorItem.TutorPriceLesson.OneToOneMaxPrice = tutorItem.SubjectStudyLevelSetup.Max(x => x.PricePerPerson);
                    tutorItem.TutorPriceLesson.GroupMinPrice = Convert.ToDecimal(tutorItem.SubjectStudyLevelSetup.Min(x => x.GroupPricePerPerson));
                    tutorItem.TutorPriceLesson.GroupMaxPrice = Convert.ToDecimal(tutorItem.SubjectStudyLevelSetup.Max(x => x.GroupPricePerPerson));
                    tutorItem.TutorSubjectNameList = tutorPriceList.Where(x => !x.IsDeleted).Select(x => x.Subject.Name).Distinct().ToList();




                    //tutorItem.TutorPriceLesson.OneToOneMinPrice = tutorPriceList.Min(x => x.PricePerPerson);
                    //tutorItem.TutorPriceLesson.OneToOneMaxPrice = tutorPriceList.Max(x => x.PricePerPerson);
                    //tutorItem.TutorPriceLesson.GroupMinPrice = Convert.ToDecimal(tutorPriceList.Min(x => x.GroupPricePerPerson));
                    //tutorItem.TutorPriceLesson.GroupMaxPrice = Convert.ToDecimal(tutorPriceList.Max(x => x.GroupPricePerPerson));
                    //tutorItem.TutorSubjectNameList = tutorPriceList.Where(x=>!x.IsDeleted).Select(x => x.Subject.Name).Distinct().ToList();
                    //var tutorQualification = await _UnitOfWork.Repository<Models.TutorQualification>().Get(o => o.TutorId == tutorItem.TutorId && o.IsDeleted == false);
                    //tutorItem.TutorQualification = tutorQualification.Where(x=>!x.IsDeleted).Select(x => x.Name).ToList();
                }
                var tutorQualification = await _UnitOfWork.Repository<Models.TutorQualification>().Get(o => o.TutorId == tutorItem.TutorId && o.IsDeleted == false);
                if (tutorQualification.Count > 0)
                {
                    tutorItem.TutorQualification = tutorQualification.Where(x => !x.IsDeleted).Select(x => x.Name).ToList();
                }
                var TutorLessonList = await _UnitOfWork.Repository<Models.ClassSession>().Get(o => o.OwnerId == tutorItem.UserId);
                if (TutorLessonList.Count > 0)
                {
                    tutorItem.TutorPriceLesson.OneToOneLessonCount = TutorLessonList.Count(x => x.MaxPersons == 1 && x.Complete == true && x.EndedAtDate >= DateTime.Now.AddDays(-30));
                    tutorItem.TutorPriceLesson.GroupLessonCount = TutorLessonList.Count(x => x.MaxPersons > 1 && x.Complete == true && x.EndedAtDate >= DateTime.Now.AddDays(-30));
                }
                #region Tutor Availabilities and Booked slot
                tutorItem.TotalBookedSlot = await GetBookedSlot(tutorItem.UserId);
                tutorItem.TotalSlotCount = await GetFutureAvailableSlot(tutorItem.TutorId);
                #endregion
            }




            if (ObjCompany.SubjectStudyLevelSetups.Count > 0)
            {
                ObjCompany.SubjectStudyLevelSetups = ObjCompany.SubjectStudyLevelSetups.OrderBy(x => x.SubjectName).ToList();
                ObjCompany.OneToOneMinPrice = ObjCompany.SubjectStudyLevelSetups.Min(x => x.PricePerPerson);
                ObjCompany.OneToOneMaxPrice = ObjCompany.SubjectStudyLevelSetups.Max(x => x.PricePerPerson);
                ObjCompany.GroupMinPrice = ObjCompany.SubjectStudyLevelSetups.Min(x => x.GroupPricePerPerson);
                ObjCompany.GroupMaxPrice = ObjCompany.SubjectStudyLevelSetups.Max(x => x.GroupPricePerPerson);
            }
            if (ObjCompany.Tutors.Count > 0)
            {
                ObjCompany.CompanyTutorCount = ObjCompany.Tutors.Count;
                ObjCompany.CompanyCourseCount = ObjCompany.Courses.Count();
                ObjCompany.OneToOneLessonCount = ObjCompany.Tutors.Sum(x => x.TutorPriceLesson.OneToOneLessonCount);
                ObjCompany.GroupLessonCount = ObjCompany.Tutors.Sum(x => x.TutorPriceLesson.GroupLessonCount);
            }
            return ObjCompany;
        }

        public async Task<int> GetFutureAvailableSlot(Guid tutorId)
        {
            var tutorAvailability = await _UnitOfWork.Repository<Models.TutorAvailability>().Get(o => o.TutorId == tutorId && o.IsDeleted == false
                       && o.StartTime.AddDays(Convert.ToInt32(o.NoOfWeek * 7)).ToUniversalTime() >= DateTime.Now.ToUniversalTime());
            int totalSlotCount = 0;
            foreach (var av in tutorAvailability)
            {
                totalSlotCount = totalSlotCount + Convert.ToInt32((av.NoOfWeek == 0 ? 1 : av.NoOfWeek));
                var nextDate = DateTime.Now;
                double d = (double)((nextDate - av.StartTime).Days) / 7.0;
                int noOfDays = Convert.ToInt32(Math.Ceiling(d)); //less then 0 mean previus date return minus value 
                if (Convert.ToInt32(av.DayOfWeek) != -1 && noOfDays > 0)
                {
                    totalSlotCount = totalSlotCount - noOfDays;
                }

            }
            return totalSlotCount;
        }
        public async Task<int> GetBookedSlot(string OwnerId)
        {
            var classSessions = await _UnitOfWork.Repository<Models.ClassSession>().Get(x => x.OwnerId == OwnerId && x.StartDate.ToUniversalTime() >= DateTime.UtcNow && x.IsDeleted == false);
            return classSessions.Count();
        }
        public async Task<bool> UpdateIdVerificationStauts(Guid companyId, bool status)
        {
            var company = await _UnitOfWork.Repository<Models.Company>().GetSingle(o => o.CompanyId == companyId);
            if (company != null)
            {

                company.IDVerificationtStatus = TutorApprovalStatus.Approved;
                await _UnitOfWork.Repository<Models.Company>().Update(company);
                return true;
            }
            return false; ;
        }
    }
}

