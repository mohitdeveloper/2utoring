using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Integrations.Stripe;
using StandingOut.Shared.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RestSharp.Extensions;
using StandingOut.Data.DTO.CompanyRegister;
using DTO = StandingOut.Data.DTO;
using ISettingService = StandingOutStore.Business.Services.Interfaces.ISettingService;
using IUserService = StandingOutStore.Business.Services.Interfaces.IUserService;
using Models = StandingOut.Data.Models;
using StandingOut.Data.Models;
using StandingOutStore.Business.Services.Interfaces;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutStore.Extensions;
using StandingOut.Data.DTO;
using StandingOut.Shared;
//using StandingOut.Business.Services.Interfaces;
//using StandingOut.Business.Services;

namespace StandingOutStore.Controllers.api
{
    // IS Used at Company Registration.
    [Authorize]
    [Produces("application/json")]
    [Route("api/company")]
    public class CompanysController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ICompanyService _CompanyService;
        private readonly ISettingService _SettingService;
        private readonly IUserService _UserService;
        private readonly ICompanySubscriptionService companySubscriptionService;
        private readonly ICompanySubscriptionFeatureService companySubscriptionFeatureService;

        public CompanysController(UserManager<Models.User> userManager, ICompanyService companyService,
            ISettingService settingService, IUserService userService,
            ICompanySubscriptionService companySubscriptionService, IOptions<AppSettings> appSettings,
            ICompanySubscriptionFeatureService companySubscriptionFeatureService)
            : base(userManager, appSettings, companyService)
        {
            _UserManager = userManager;
            _CompanyService = companyService;
            _SettingService = settingService;
            _UserService = userService;
            this.companySubscriptionService = companySubscriptionService;
            this.companySubscriptionFeatureService = companySubscriptionFeatureService;
        }

        [AllowAnonymous] // Used by public profile view
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var company = await _CompanyService.GetById(id, "AdminUser,CompanySubjects.Subject");
            IList<string> subject = new List<string>();
            foreach (var item in company.CompanySubjects.Select(x=>x.Subject.Name).Distinct())
            {
                subject.Add(item);
            }
            string joinedSubject = string.Join(", ", subject);
            var result = Mappings.Mapper.Map<Models.Company, DTO.Company>(company);
            result.SubjectNameList = joinedSubject;
            return Ok(result);
        }

        [HttpGet("getMy")]
        public async Task<IActionResult> GetMyCompany()
        {
            Models.Company company = null;
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (user != null)
            {
                company = await _CompanyService.GetByAdminUser(user);
                if (company == null) return Ok(null);
            }

            var existingLogins = await _UserService.GetUserLoginInfo(user.Id);
            var result = Mappings.Mapper.Map<Models.Company, DTO.Company>(company);
            result.LocalLogin = User.Claims.Any(o => o.Type == "idp" && o.Value.Contains("local"));
            result.HasGoogleAccountLinked = existingLogins.Any(o => o.LoginProvider == "Google");
            return Ok(result); // DTO.Company
        }

        //[AllowAnonymous]
        //[HttpGet("getById/{id}")]
        //public async Task<IActionResult> GetById(Guid id)
        //{
        //        var tutor = await _CompanyService.GetById(id);
        //        return Ok(Mappings.Mapper.Map<Models.Tutor, DTO.Tutor>(tutor));
        //}

        [HttpGet("updateInitialRegisterStep/{step}")]
        public async Task<IActionResult> UpdateInitialRegisterStep(int step)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var company = await _CompanyService.GetByAdminUser(user);
            if (company == null) return Ok();
            if (company.AdminUserId.HasValue())
            {
                company = await _CompanyService.UpdateInitialRegisterStep(company.CompanyId, step);
                return Ok(Mappings.Mapper.Map<Models.Company, DTO.Company>(company));
            }
            return Ok();
        }

        // Screen 1 DTO
        [HttpGet("getBasicInfo")]
        public async Task<IActionResult> GetBasicInfo()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (user.TutorId.HasValue || User.IsInRole("Tutor") || User.IsInRole("Super Admin"))
                return BadRequest("Tutor or administrator cannot register as a company");

            var companyBasicInfo = Mappings.Mapper.Map<Models.User, CompanyRegisterBasicInfo>(user);
            if (companyBasicInfo.InitialRegistrationStep == 0)
                companyBasicInfo.InitialRegistrationStep = 1;

            var company = await _CompanyService.GetByAdminUser(user);
            if (company != null)
            {
                companyBasicInfo = Mappings.Mapper.Map<Models.Company, CompanyRegisterBasicInfo>(company);
                //companyBasicInfo.CompanyName = company.Name;
                //companyBasicInfo.CompanyRegistrationNumber = company.RegistrationNo;
                //companyBasicInfo.CompanyTelephoneNumber = company.TelephoneNumber;
                //companyBasicInfo.CompanyMobileNumber = company.MobileNumber;
                //companyBasicInfo.AddressLine1 = company.AddressLine1;
                //companyBasicInfo.AddressLine2 = company.AddressLine2;
                //companyBasicInfo.Country = company.Country;
                //companyBasicInfo.CompanyPostcode = company.Postcode;
                //companyBasicInfo.CompanyEmail = company.EmailAddress;
            }

            return Ok(companyBasicInfo);
        }

        [HttpPost("saveBasicInfo")]
        public async Task<IActionResult> SaveBasicInfo([FromBody] CompanyRegisterBasicInfo model)
        {
            // Create company happens here (vs Tutor it happens in SavePayment)
            await _CompanyService.SaveBasicInfo(model);
            return Ok();
        }

        [HttpPost("savePayment")]
        public async Task<IActionResult> SavePayment([FromBody] CompanyRegisterPayment model)
        {
            try
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                model.UserId = user.Id;
                var company = await _CompanyService.GetByAdminUser(user);
                model.CompanyId ??= company.CompanyId;
                model = await _CompanyService.SavePayment(model);
                var companySubs = await companySubscriptionService.CreateCompanySubscription(model.CompanyId.Value, model.StripePlanId);
                return Ok(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("getTeamData")]
        public async Task<IActionResult> GetTeamData()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var company = await _CompanyService.GetByAdminUser(user);
            if (company == null) return Ok(new List<CompanyRegisterProfileTeam>());
            var companyTeam = await _CompanyService.GetTeamData(company.CompanyId);
            return Ok(companyTeam);
        }

        [HttpPost("saveProfileOne")]
        public async Task<IActionResult> SaveProfileOne([FromBody] CompanyRegisterProfileOne model)
        {
            await _CompanyService.SaveProfileOne(model);
            return Ok();
        }

        [HttpPost("saveProfileThree")]
        public async Task<IActionResult> SaveProfileThree([FromBody] CompanyRegisterProfileThree model)
        {
            await _CompanyService.SaveProfileThree(model);
            return Ok();
        }

        //[HttpPost("saveProfileTwo")]
        [HttpPost("addCompanyMember")]
        public async Task<IActionResult> AddCompanyMember([FromBody] CompanyRegisterProfileTeam model)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var company = await _CompanyService.GetByAdminUser(user);
            var modelData = Mappings.Mapper.Map<CompanyRegisterProfileTeam, CompanyMember>(model);
            await _CompanyService.AddCompanyMember(company.CompanyId, modelData);
            return Ok();
        }

        [HttpDelete("deleteCompanyMember/{companyMemberId}")]
        public async Task<IActionResult> DeleteCompanyMember(Guid companyMemberId)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var company = await _CompanyService.GetByAdminUser(user);
            await _CompanyService.RemoveCompanyMember(company.CompanyId, companyMemberId);
            return Ok();
        }

        [HttpPost("ProfileUpload")]
        public async Task<IActionResult> ProfileUpload(ICollection<IFormFile> file)
        {
            if (file.Count > 0)
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                var company = await _CompanyService.GetByAdminUser(user);
                await _CompanyService.ProfileUpload(company.CompanyId, file.First());
                return Ok();
            }
            else
            {
                return BadRequest("No Files Sent");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("PagedBankDetails")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.PagedTutorBankDetails>), 200)]
        public async Task<IActionResult> PagedBankDetails([FromBody] SearchModel searchModel)
        {
            if (Caller.CurrentUserCompany == null) return null;
            var bankDetails = await _CompanyService.PagedBankDetails(searchModel, Caller.CurrentUserCompany.CompanyId);
            return Ok(bankDetails);
        }

        //[Authorize(Roles = "Super Admin, Admin")]
        //[HttpGet("getById/admin/{id}")]
        //public async Task<IActionResult> AdminGetById(Guid id)
        //{
        //    var tutor = await _CompanyService.GetById(id, "Users, StripePlan, TutorQualifications, TutorCertificates");
        //    return Ok(Mappings.Mapper.Map<Models.Tutor, DTO.AdminTutorDetails>(tutor));
        //}


        //[Authorize(Roles = "Super Admin, Admin")]
        //[HttpPatch("approveProfile/{id}")]
        //public async Task<IActionResult> ApproveProfile(Guid id)
        //{
        //    await _CompanyService.ApproveProfile(id);
        //    return Ok();
        //}

        //[Authorize(Roles = "Super Admin, Admin")]
        //[HttpPatch("rejectProfile/{id}")]
        //public async Task<IActionResult> RejectProfile(Guid id)
        //{
        //    await _CompanyService.RejectProfile(id);
        //    return Ok();
        //}

        //[Authorize(Roles = "Super Admin, Admin")]
        //[HttpPatch("approveDBS/{id}")]
        //public async Task<IActionResult> ApproveDBS(Guid id)
        //{
        //    await _CompanyService.ApproveDBS(id);
        //    return Ok();
        //}

        //[Authorize(Roles = "Super Admin, Admin")]
        //[HttpPatch("rejectDBS/{id}")]
        //public async Task<IActionResult> RejectDBS(Guid id)
        //{
        //    await _CompanyService.RejectDBS(id);
        //    return Ok();
        //}

        //[HttpPatch("markProfileAuthorizedMessageRead/{id}")]
        //public async Task<IActionResult> MarkProfileAuthorizedMessageRead(Guid id)
        //{

        //    await _CompanyService.MarkProfileAuthorizedMessageRead(id);
        //    return Ok();
        //}

        //[HttpPatch("markDbsAdminApprovedMessageRead/{id}")]
        //public async Task<IActionResult> MarkDbsAdminApprovedMessageRead(Guid id)
        //{

        //    await _CompanyService.MarkDbsAdminApprovedMessageRead(id);
        //    return Ok();
        //}

        //[HttpPost("DBSUpload/{tutorId}")]
        //public async Task<IActionResult> DBSUpload(Guid tutorId, ICollection<IFormFile> file)
        //{
        //    if (file.Count > 0)
        //    {
        //        await _CompanyService.DBSUpload(tutorId, file.First());
        //        return Ok();
        //    }
        //    else
        //    {
        //        return BadRequest("No Files Sent");
        //    }
        //}

        [HttpPost("updatePayment")]
        public async Task<IActionResult> UpdatePayment([FromBody] DTO.CompanyRegister.CompanyRegisterPayment model)
        {
            try
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                model.UserId = user.Id;
                model = await _CompanyService.UpdatePayment(model);
                return Ok(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getDefaultPaymentMethodByCompany/{id}")]
        public async Task<IActionResult> GetDefaultPaymentMethodByCompany(Guid id)
        {
            var settings = await _SettingService.Get();
            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var company = await _CompanyService.GetById(id);
                var paymentDetails = await stripeHelper.GetPaymentMethods(company.StripeCustomerId);
                if (paymentDetails.Data.Count > 0)
                {
                    return Ok(Mappings.Mapper.Map<Stripe.PaymentMethod, DTO.StripeCard>(paymentDetails.Data.First()));
                }
                else
                {
                    return Ok(null);
                }
            }
        }

        [HttpGet("getSubscriptionByCompany/{id}")]
        public async Task<IActionResult> GetSubscriptionByCompany(Guid id)
        {
            var settings = await _SettingService.Get();
            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                DTO.StripeSubscription retrunModel = new DTO.StripeSubscription();
                var company = await _CompanyService.GetById(id);
                var user = company.AdminUser;
                
                if (string.IsNullOrEmpty(company.StripeSubscriptionId))
                {
                    retrunModel.Name = user.Title + ". " + char.ToUpper(user.FullName[0]) + user.FullName.Substring(1);
                    return Ok(retrunModel);
                }
                var subscription = await stripeHelper.GetSubscription(company.StripeSubscriptionId);
                if (subscription != null)
                {
                    retrunModel = Mappings.Mapper.Map<Stripe.Subscription, DTO.StripeSubscription>(subscription);
                    retrunModel.Name = user.Title + ". " + char.ToUpper(user.FullName[0]) + user.FullName.Substring(1);
                    return Ok(retrunModel);
                }
                else
                {
                    retrunModel.Name = user.Title + ". " + char.ToUpper(user.FullName[0]) + user.FullName.Substring(1);
                    return Ok(retrunModel);
                }
            }
        }

        [ProducesResponseType(typeof(ClassSessionFeatures), 200)]
        [HttpGet("getSubscriptionFeatures/{companyId}")]
        public async Task<IActionResult> GetSubscriptionFeatures(Guid companyId)
        {

            var featureSet = await companySubscriptionFeatureService.GetSubscriptionFeatureSetByCompanyId(companyId);
            return Ok(featureSet.ToClassSessionFeatures());
        }

        [ProducesResponseType(typeof(ClassSessionFeatures), 200)]
        [HttpGet("getSubscriptionFeaturesByCompanyId")]
        public async Task<IActionResult> GetSubscriptionFeatures()
        {
            var featureSet = await companySubscriptionFeatureService.GetSubscriptionFeatureSetByCompanyId(Caller.CurrentUserCompany.CompanyId);
            return Ok(featureSet.ToClassSessionFeatures());
        }


        [AllowAnonymous]
        [HttpGet("getAboutCompany/{id}")]
        [ProducesResponseType(typeof(IEnumerable<DTO.CompanyProfileViewModel>), 200)]
        public async Task<IActionResult> GetAboutCompany(Guid id)
        {
            var returnObject = await _CompanyService.GetAboutCompany(id);
            return Ok(returnObject);
        }

        [HttpPost("updateIdVerificationStauts")]
        public async Task<IActionResult> UpdateIdVerificationStauts([FromBody] DTO.UpdateIdVerification model)
        {
            if (model.CompanyId != null && Guid.Parse(model.CompanyId) != Guid.Empty)
            {
                return Ok(await _CompanyService.UpdateIdVerificationStauts(Guid.Parse(model.CompanyId), model.Status));
            }
            return Ok(false);
        }
    }
}