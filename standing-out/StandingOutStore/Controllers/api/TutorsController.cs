using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOut.Shared.Integrations.Stripe;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;
using StandingOut.Data.Enums;
using StandingOut.Shared;

namespace StandingOutStore.Controllers.api
{
    // IS Used at Registration - Store > TutorsController.
    //[Authorize]
    [Produces("application/json")]
    [Route("api/Tutors")]
    public class TutorsController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutorService _TutorService;
        private readonly ISettingService _SettingService;
        private readonly IUserService _UserService;
        private readonly ITutorSubscriptionService tutorSubscriptionService;
        private readonly ISubscriptionFeatureService _subscriptionFeatureService;
        private readonly ISearchService _searchService;
        private readonly ITutorCertificateService _TutorCertificateService;


        public TutorsController(UserManager<Models.User> userManager, ITutorCertificateService tutorCertificateService, ITutorService tutorService, ISettingService settingService, IUserService userService, ISubscriptionFeatureService subscriptionFeatureService,
          ISearchService searchService,  ITutorSubscriptionService tutorSubscriptionService, IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings, companyService)
        {
            _UserManager = userManager;
            _TutorCertificateService = tutorCertificateService;
            _TutorService = tutorService;
            _SettingService = settingService;
            _UserService = userService;
            this.tutorSubscriptionService = tutorSubscriptionService;
            _subscriptionFeatureService = subscriptionFeatureService;
            _searchService = searchService;
        }

        [HttpGet("getMy")]
        public async Task<IActionResult> GetMy()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (user.TutorId.HasValue)
            {
                var tutor = await _TutorService.GetById(user.TutorId.Value);
                var existingLogins = await _UserService.GetUserLoginInfo(user.Id);
                var result = Mappings.Mapper.Map<Models.Tutor, DTO.Tutor>(tutor);
                result.LocalLogin = User.Claims.Any(o => o.Type == "idp" && o.Value.Contains("local"));
                result.HasGoogleAccountLinked = existingLogins.Any(o => o.LoginProvider == "Google");
                result.CurrentCompany = await _TutorService.GetCurrentCompany(user);
                result.TutorCertificates = await _TutorService.GetDBSCirtificates(result.TutorId);

                return Ok(result);
            }
            else
            {
                return Ok(null);
            }
        }
        [HttpGet("getCompanyTutorData/{id}")]
        public async Task<IActionResult> getCompanyTutorData(Guid id)
        {
            if (id !=null)
            {
                var tutor = await _TutorService.GetById(id);
                var userid = tutor.Users.FirstOrDefault().Id;
                var existingLogins = await _UserService.GetUserLoginInfo(userid);
                var result = Mappings.Mapper.Map<Models.Tutor, DTO.Tutor>(tutor);
                result.LocalLogin = User.Claims.Any(o => o.Type == "idp" && o.Value.Contains("local"));
                result.HasGoogleAccountLinked = existingLogins.Any(o => o.LoginProvider == "Google");
                return Ok(result);
            }
            else
            {
                return Ok(null);
            }
        }

        [HttpGet("getAllCompanyTutors")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Tutor>), 200)]
        public async Task<IActionResult> GetTutorList()
        {
            var tutor = await _TutorService.GetTutorList();
            return Ok(Mappings.Mapper.Map<List<Models.Tutor>, List<DTO.Tutor>>(tutor));
        }
        
        [HttpGet("getTutorAvailabilities/{id}")]
        [ProducesResponseType(typeof(DTO.Tutor), 200)]
        public async Task<IActionResult> GetTutorAvailabilities(Guid id)
        {
            //if (Caller.IsTutor && id == Guid.Empty)
            //{
            //    id = (Guid)Caller.CurrentUser.TutorId;
            //}

            if (id == Guid.Empty)
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                if (await _UserManager.IsInRoleAsync(user, "Tutor"))
                {
                    id = (Guid)user.TutorId;
                }
            }

            var tutor = await _TutorService.GetTutorAvailabilities(id);
            var existingLogins = await _UserService.GetUserLoginInfo(tutor.UserId);
            tutor.HasGoogleAccountLinked = existingLogins.Any(o => o.LoginProvider == "Google");
            return Ok(tutor);
        }
        [AllowAnonymous]
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var tutor = await _TutorService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.Tutor, DTO.Tutor>(tutor));
        }

        [HttpGet("updateInitialRegisterStep/{step}")]
        public async Task<IActionResult> UpdateInitialRegisterStep(int step)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (user.TutorId.HasValue)
            {
                var tutor = await _TutorService.UpdateInitialRegisterStep(user.TutorId.Value, step);
                return Ok(Mappings.Mapper.Map<Models.Tutor, DTO.Tutor>(tutor));
            }
            return Ok();
        }

        [HttpGet("getBasicInfo")]
        public async Task<IActionResult> GetBasicInfo()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var tutorBasicInfo = Mappings.Mapper.Map<Models.User, DTO.TutorRegister.TutorRegisterBasicInfo>(user);
            tutorBasicInfo.CurrentCompany = await _TutorService.GetCurrentCompany(user);
            return Ok(tutorBasicInfo);
        }

        [HttpPost("saveBasicInfo")]
        public async Task<IActionResult> SaveBasicInfo([FromBody] DTO.TutorRegister.TutorRegisterBasicInfo model)
        {
           var tutorId= await _TutorService.SaveBasicInfo(model);
            return Ok(tutorId);
        }

        [HttpPost("savePayment")]
        public async Task<IActionResult> SavePayment([FromBody] DTO.TutorRegister.TutorRegisterPayment model)
        {
            try
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                model.UserId = user.Id;
                model = await _TutorService.SavePayment(model);
                if (model.TutorId.HasValue)
                {
                    var tutorSubs = await tutorSubscriptionService.CreateTutorSubscription(model.TutorId.Value, model.StripePlanId);
                }

                return Ok(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("saveBankDetails")]
        public async Task<IActionResult> SaveBankDetails([FromBody] DTO.TutorRegister.TutorRegisterBankDetails model)
        {
            try
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                model.UserId = user.Id;
                model = await _TutorService.SaveBankDetails(model);
                if (model.TutorId.HasValue)
                {
                    return Ok(model);
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("saveDbsCheck")]
        public async Task<IActionResult> SaveDbsCheck([FromBody] DTO.TutorRegister.TutorRegisterDbsCheck model)
        {
            await _TutorService.SaveDbsCheck(model);
            return Ok();
        }

        [HttpPost("saveProfile")]
        public async Task<IActionResult> SaveProfile([FromBody] DTO.TutorRegister.TutorRegisterProfile model)
        {
            await _TutorService.SaveProfile(model);
            return Ok();
        }

        [HttpPost("saveProfileOne")]
        public async Task<IActionResult> SaveProfileOne([FromBody] DTO.TutorRegister.TutorRegisterProfileOne model)
        {
            await _TutorService.SaveProfileOne(model);
            return Ok();
        }

        [HttpPost("saveProfileTwo")]
        public async Task<IActionResult> SaveProfileTwo([FromBody] DTO.TutorRegister.TutorRegisterProfileTwo model)
        {
            await _TutorService.SaveProfileTwo(model);
            return Ok();
        }

        [HttpPost("ProfileUpload")]
        public async Task<IActionResult> ProfileUpload(ICollection<IFormFile> file)
        {
            if (file.Count > 0)
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                await _TutorService.ProfileUpload(user.TutorId.Value, file.First());
                return Ok();
            }
            else
            {
                return BadRequest("No Files Sent");
            }
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPost("Paged")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.PagedTutor>), 200)]
        public async Task<IActionResult> Paged([FromBody] DTO.TutorSearchModel model)
        {
            DTO.PagedList<DTO.PagedTutor> pagedList=new DTO.PagedList<DTO.PagedTutor>();
             if (Caller.IsSuperAdmin)
            {
                pagedList = await _TutorService.GetPaged(model, "Super Admin",null);
            }
            else if (Caller.IsAdmin)
            {
                pagedList = await _TutorService.GetPaged(model, "Admin",Caller.CurrentUserCompany.CompanyId);
            }

           
            return Ok(pagedList);
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpGet("getById/admin/{id}")]
        public async Task<IActionResult> AdminGetById(Guid id)
        {
            var tutor = await _TutorService.GetById(id, "Users, StripePlan, TutorQualifications, TutorCertificates");
            var responseData = Mappings.Mapper.Map<Models.Tutor, DTO.AdminTutorDetails>(tutor);
            responseData.TutorCertificates = await _TutorService.GetTutorAllCirtificates(responseData.TutorId);
            return Ok(responseData);
        }


        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPatch("approveProfile/{id}")]
        public async Task<IActionResult> ApproveProfile(Guid id)
        {
            await _TutorService.ApproveProfile(id);
            return Ok();
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPatch("rejectProfile/{id}")]
        public async Task<IActionResult> RejectProfile(Guid id)
        {
            await _TutorService.RejectProfile(id);
            return Ok();
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPatch("approveDBS/{id}")]
        public async Task<IActionResult> ApproveDBS(Guid id)
        {
            await _TutorService.ApproveDBS(id);
            return Ok();
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPatch("rejectDBS/{id}")]
        public async Task<IActionResult> RejectDBS(Guid id)
        {
            await _TutorService.RejectDBS(id);
            return Ok();
        }

        [HttpPatch("markProfileAuthorizedMessageRead/{id}")]
        public async Task<IActionResult> MarkProfileAuthorizedMessageRead(Guid id)
        {

            await _TutorService.MarkProfileAuthorizedMessageRead(id);
            return Ok();
        }

        [HttpPatch("markDbsAdminApprovedMessageRead/{id}")]
        public async Task<IActionResult> MarkDbsAdminApprovedMessageRead(Guid id)
        {

            await _TutorService.MarkDbsAdminApprovedMessageRead(id);
            return Ok();
        }

        [HttpPost("DBSUpload/{tutorId}")]
        public async Task<IActionResult> DBSUpload(Guid tutorId, ICollection<IFormFile> file)
        {
            if (file.Count > 0)
            {
                await _TutorService.DBSUpload(tutorId, file.First());
                return Ok();
            }
            else
            {
                return BadRequest("No Files Sent");
            }
        }
        [HttpGet]
      

        [HttpPost("updatePayment")]
        public async Task<IActionResult> UpdatePayment([FromBody] DTO.TutorRegister.TutorRegisterPayment model)
        {
            try
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                model.UserId = user.Id;
                if (model.NewStripePlanId != null && model.NewSubscriptionId != null)
                {
                    if (user.TutorId != null)
                    {
                        bool OldProfileApproval = false;
                        bool OldDBSApproval = false;
                        bool NewProfileApproval = false;
                        bool NewDBSApproval=false;
                        #region Old Subcription Approval
                        var tutorId = Guid.Parse(user.TutorId.ToString());
                        var tutor = await _TutorService.GetById(tutorId);
                        var oldTutorSubcription = await _TutorService.GetActiveSubscription(tutorId);
                        var oldTutorSubcriptionFuture = await _subscriptionFeatureService.GetSubscriptionFeatures(oldTutorSubcription.SubscriptionId);
                        var oldFeatureSet = new SubscriptionFeatureSet(oldTutorSubcriptionFuture);
                        var oldSet = oldFeatureSet.ToClassSessionFeatures();
                        if (oldSet != null)
                        {
                            OldProfileApproval = oldSet.AdminDashboard_ProfileApproval_ApprovalRequired;
                            OldDBSApproval = oldSet.AdminDashboard_DBSApproval_ApprovalRequired;
                        }
                        #endregion

                        #region New Subcription Approval
                        var newTutorSubcription = await _TutorService.GetActiveSubscription(tutorId);
                        var newTutorSubcriptionFuture = await _subscriptionFeatureService.GetSubscriptionFeatures(Guid.Parse(model.NewSubscriptionId.ToString()));
                        var newFeatureSet = new SubscriptionFeatureSet(newTutorSubcriptionFuture);
                        var newSet = newFeatureSet.ToClassSessionFeatures();
                        if (newSet != null)
                        {
                            NewProfileApproval = newSet.AdminDashboard_ProfileApproval_ApprovalRequired;
                            NewDBSApproval = newSet.AdminDashboard_DBSApproval_ApprovalRequired;
                        }
                        #endregion

                        #region Check For DBS
                        if (OldDBSApproval == true && NewDBSApproval == true)
                        {
                            model.DbsApprovalStatus = tutor.DbsApprovalStatus;
                        }
                        if (OldDBSApproval == true && NewDBSApproval == false)
                        {
                            if (tutor.DbsApprovalStatus == TutorApprovalStatus.Pending || tutor.DbsApprovalStatus == TutorApprovalStatus.Rejected)
                            {
                                model.DbsApprovalStatus = TutorApprovalStatus.NotRequired;
                            }
                        }
                        if (OldDBSApproval == false && NewDBSApproval == true)
                        {
                            if (tutor.DbsApprovalStatus == TutorApprovalStatus.NotRequired)
                            {
                                //Check DBS from database and change status as per user requirement
                                if(model.DbsCheckData.HasDbsCheck==true)
                                {
                                   model.DbsApprovalStatus = TutorApprovalStatus.Pending;
                                }
                                else
                                {
                                    model.DbsApprovalStatus = TutorApprovalStatus.NotRequired;
                                }
                               
                            }
                           
                        }
                        if (OldDBSApproval == false && NewDBSApproval == false)
                        {
                            model.DbsApprovalStatus = tutor.DbsApprovalStatus;
                        }
                        #endregion

                        #region Check For Profile Approval
                        if (OldProfileApproval == true && NewProfileApproval == true)
                        {
                            model.ProfileApprovalStatus = tutor.ProfileApprovalStatus;
                        }
                        if (OldProfileApproval == true && NewProfileApproval == false)
                        {
                            if (tutor.ProfileApprovalStatus == TutorApprovalStatus.Pending || tutor.ProfileApprovalStatus == TutorApprovalStatus.Rejected)
                            {
                                model.ProfileApprovalStatus = TutorApprovalStatus.NotRequired;
                            }
                        }
                        if (OldProfileApproval == false && NewProfileApproval == true)
                        {
                            model.ProfileApprovalStatus = TutorApprovalStatus.Pending;
                        }
                        if (OldProfileApproval == false && NewProfileApproval == false)
                        {
                            model.ProfileApprovalStatus = tutor.ProfileApprovalStatus;
                        }
                        #endregion
                    }
                }




                model = await _TutorService.UpdatePayment(model);
                return Ok(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getDefaultPaymentMethodByTutor/{id}")]
        public async Task<IActionResult> GetDefaultPaymentMethodByTutor(Guid id)
        {
            var settings = await _SettingService.Get();
            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var tutor = await _TutorService.GetById(id);
                var paymentDetails = await stripeHelper.GetPaymentMethods(tutor.StripeCustomerId);
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

        [HttpGet("getSubscriptionByTutor/{id}")]
        public async Task<IActionResult> GetSubscriptionByTutor(Guid id)
        {
            var settings = await _SettingService.Get();
            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                var tutor = await _TutorService.GetById(id);
                var user = tutor.Users.FirstOrDefault();
                DTO.StripeSubscription retrunModel = new DTO.StripeSubscription();
                if (user != null)
                {
                    retrunModel.Name = user.Title + ". " + char.ToUpper(user.FullName[0]) + user.FullName.Substring(1);
                }
                else
                {
                    retrunModel.Name = "";
                }
                retrunModel.Status = "Active";
                if (string.IsNullOrEmpty(tutor.StripeSubscriptionId))
                {
                    return Ok(retrunModel);
                }
                var subscription = await stripeHelper.GetSubscription(tutor.StripeSubscriptionId);
                if (subscription != null)
                {
                    
                    retrunModel = Mappings.Mapper.Map<Stripe.Subscription, DTO.StripeSubscription>(subscription);
                    retrunModel.StripePlanId = tutor.StripePlanId;
                    retrunModel.Name = user.Title + ". " + char.ToUpper(user.FullName[0]) + user.FullName.Substring(1);
                    return Ok(retrunModel);
                }
                else
                {

                    return Ok(retrunModel);
                }
            }
        }

        [HttpPatch("markLinkAccountMessageRead/{id}")]
        public async Task<IActionResult> MarkLinkAccountMessageRead(Guid id)
        {

            await _TutorService.MarkLinkAccountMessageRead(id);
            return Ok();
        }

        
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _TutorService.Delete(id);
            return Ok();
        }

        //[AllowAnonymous]
        [HttpPost("inviteTutor")]
        [ProducesResponseType(typeof(DTO.TutorInvite), 200)]
        public async Task<IActionResult> InviteTutor([FromBody] string[] emailIds)
        {
            await _TutorService.InviteTutor(Caller.CurrentUserCompany.CompanyId,Caller.CurrentUserCompany.Name, emailIds);
            return Ok();
        }

        //[AllowAnonymous]
        [HttpPost("updateTutorSubscriptioPlan")]
        [ProducesResponseType(typeof(DTO.TutorSubcriptionPlan), 200)]
        public async Task<IActionResult> UpdateTutorSubscriptioPlan([FromBody] DTO.TutorSubcriptionPlan model)
        {
            await _TutorService.UpdateTutorSubscriptioPlan(model);
            return Ok(null);
        }
        [HttpGet("getBookedSlot/{id}")]
        public async Task<IActionResult> GetBookedSlot(Guid id)
        {
            var bookedSlot = await _TutorService.GetBookedSlot(id);
            return Ok(bookedSlot);
        }


        [AllowAnonymous]
        [HttpPost("searchTutorOrCourse")]
        [ProducesResponseType(typeof(IEnumerable<dynamic>), 200)]
        public async Task<IActionResult> SearchTutorOrCourse([FromBody] DTO.TutorOrCourseModel model)
        {
            dynamic returnObject = null;
            if (!ModelState.IsValid)
            {
                return Ok(returnObject);
            }

            
            if (model.SearchType.Contains("Tutor"))
            {
                 returnObject = await _searchService.SearchTutor(model);
            }
            if (model.SearchType.Contains("Course"))
            {
                returnObject = await _searchService.SearchCourse(model);

            }
            return Ok(returnObject);
        }
        [AllowAnonymous]
        [HttpGet("getTutorProfile/{id}")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Tutor>), 200)]
        public async Task<IActionResult> GetTutorProfile(Guid id)
        {
            var returnObject = await _TutorService.GetTutorProfile(id);
            return Ok(returnObject);
        }
       

        [AllowAnonymous]
        [HttpGet("getAllTutorSubject")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Subject>), 200)]
        public async Task<IActionResult> GetAllTutorSubject()
        {
            var LevelList = await _searchService.GetAllTutorSubject();
            return Ok(LevelList);
        }

        [AllowAnonymous]
        [HttpGet("getAllSubjectLevelBySubjectId/{id}")]
        [ProducesResponseType(typeof(IEnumerable<DTO.StudyLevel>), 200)]
        public async Task<IActionResult> GetAllSubjectLevelBySubjectId(Guid id)
        {
            var LevelList = await _searchService.GetAllSubjectLevelBySubjectId(id);
            return Ok(LevelList);
        }

        
        [HttpPost("updateIdVerificationStauts")]
        public async Task<IActionResult> UpdateIdVerificationStauts([FromBody] DTO.UpdateIdVerification model)
        {
            if (model.TutorId != null && Guid.Parse(model.TutorId) != Guid.Empty)
            {
                return Ok(await _TutorService.UpdateIdVerificationStauts(Guid.Parse(model.TutorId), model.Status));
            }
            return Ok(false);
        }
        
        [HttpGet("downloadCertificate/{id}")]
        public async Task<IActionResult> DownloadCertificate(Guid id)
        {
            var tutor = await _TutorCertificateService.GetById(id);
            var model = await _TutorCertificateService.GetFile(id);
            return File(model, "application/octect-stream", tutor.CertificateFileName);
        }
    }
}