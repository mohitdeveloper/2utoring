using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Users")]
    public class UsersController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IUserService _UserService;
        private readonly ICompanyService companyService;
        private readonly IStripeCountryService _StripeCountryService;
        private readonly ISettingService _SettingService;

        public UsersController(UserManager<Models.User> userManager, IUserService userService, ICompanyService companyService,IStripeCountryService stripeCountryService, ISettingService settingService)
        {
            _UserManager = userManager;
            _UserService = userService;
            this.companyService = companyService;
            _StripeCountryService = stripeCountryService;
            _SettingService = settingService;
        }

        [HttpGet("my/student")]
        [ProducesResponseType(typeof(DTO.UserDetail), 200)]
        public async Task<IActionResult> GetMy()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var existingLogins = await _UserService.GetUserLoginInfo(user.Id);
            var result = Mappings.Mapper.Map<Models.User, DTO.UserDetail>(user);
            if (user!=null)
            {
                if(user.StripeCountryID!=null)
                {
                    var stripeCountry = await _StripeCountryService.GetById(Guid.Parse(user.StripeCountryID.ToString()));
                    result.StripeCountry = Mappings.Mapper.Map<Models.StripeCountry, DTO.StripeCountry>(stripeCountry);
                }
            }
           
            result.LocalLogin = User.Claims.Any(o => o.Type == "idp" && o.Value.Contains("local"));
            result.HasGoogleAccountLinked = existingLogins.Any(o => o.LoginProvider == "Google");
            return Ok(result);
        }

        [HttpGet("my/guardian")]
        [ProducesResponseType(typeof(DTO.UserGuardianDetail), 200)]
        public async Task<IActionResult> GetMyGuardian()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var existingLogins = await _UserService.GetUserLoginInfo(user.Id);
            var model = Mappings.Mapper.Map<Models.User, DTO.UserGuardianDetail>(user);
            if (!model.IsSetupComplete)
            {
                // Adjust the mapping slightly here for first time set up
                model.FirstName = model.ChildFirstName;
                model.ChildFirstName = null;
                model.LastName = model.ChildLastName;
                model.ChildLastName = null;
                model.ChildDateOfBirth = default;
            }

            if (user != null)
            {
                if (user.StripeCountryID != null)
                {
                    var stripeCountry = await _StripeCountryService.GetById(Guid.Parse(user.StripeCountryID.ToString()));
                    model.StripeCountry = Mappings.Mapper.Map<Models.StripeCountry, DTO.StripeCountry>(stripeCountry);
                }
            }
            model.LocalLogin = User.Claims.Any(o => o.Type == "idp" && o.Value.Contains("local"));
            model.HasGoogleAccountLinked = existingLogins.Any(o => o.LoginProvider == "Google");
            return Ok(model);
        }

        [HttpPatch("completeSetup/student")]
        [ProducesResponseType(typeof(DTO.UserDetail), 200)]
        public async Task<IActionResult> CompleteSetup([FromBody] DTO.UserDetail model)
        {
            if (!model.TermsAndConditionsAccepted)
                return BadRequest("Terms must be accepted");
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);

            user = await _UserService.CompleteSetup(user, model);

            return Ok(Mappings.Mapper.Map<Models.User, DTO.UserDetail>(user));
        }

        [HttpPatch("completeSetup/guardian")]
        [ProducesResponseType(typeof(DTO.UserGuardianDetail), 200)]
        public async Task<IActionResult> CompleteGuardianSetup([FromBody] DTO.UserGuardianDetail model)
        {
            if (!model.TermsAndConditionsAccepted)
                return BadRequest("Terms must be accepted");
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);

            user = await _UserService.CompleteSetup(user, model);

            return Ok(Mappings.Mapper.Map<Models.User, DTO.UserGuardianDetail>(user));
        }

        [HttpPatch("settings/student")]
        [ProducesResponseType(typeof(DTO.UserDetail), 200)]
        public async Task<IActionResult> UpdateSettings([FromBody] DTO.UserDetail model)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.TelephoneNumber = model.TelephoneNumber;
            user.MobileNumber = model.MobileNumber;
            user.MarketingAccepted = model.MarketingAccepted;
            await _UserManager.UpdateAsync(user);
            return Ok(Mappings.Mapper.Map<Models.User, DTO.UserDetail>(user));
        }

        [HttpPatch("settings/guardian")]
        [ProducesResponseType(typeof(DTO.UserGuardianDetail), 200)]
        public async Task<IActionResult> UpdateGuardianSettings([FromBody] DTO.UserGuardianDetail model)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            user.FirstName = model.ChildFirstName;
            user.LastName = model.ChildLastName;

            user.ParentFirstName = model.FirstName;
            user.ParentLastName = model.LastName;
            user.TelephoneNumber = model.TelephoneNumber;
            user.MobileNumber = model.MobileNumber;
            user.MarketingAccepted = model.MarketingAccepted;
            await _UserManager.UpdateAsync(user);
            return Ok(Mappings.Mapper.Map<Models.User, DTO.UserGuardianDetail>(user));
        }

        [Authorize]
        [HttpPost("Students/Paged")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.UserProfile>), 200)]
        public async Task<IActionResult> PagedStudents([FromBody] DTO.SearchModel model)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);

            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
            {
                var students = await _UserService.GetStudentsPaged(model, user.Id);
                return Ok(students);
            }
            else if (User.IsInRole("Admin"))
            {
                var company = await companyService.GetByAdminUser(user);
                if (company == null) return NoContent();
                var students = await _UserService.GetStudentsPaged(model, null, company.CompanyId);
                return Ok(students);
            }
            else if (User.IsInRole("Super Admin"))
            {
                var students = await _UserService.GetStudentsPaged(model, null);
                return Ok(students);
            }
            else
            {
                return Forbid();
            }
        }

        [Authorize]
        [HttpPost("Admins/Paged")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.UserProfile>), 200)]
        public async Task<IActionResult> PagedAdmins([FromBody] DTO.SearchModel model)
        {
            if (User.IsInRole("Admin")) model.Search = User.Identity.Name;

            if (User.IsInRole("Super Admin") || User.IsInRole("Admin"))
            {
                var admins = await _UserService.GetAdminsPaged(model);
                return Ok(admins);
            }
            else
            {
                return Forbid();
            }
        }

        [HttpPost("changePassword")]
        [ProducesResponseType(typeof(DTO.UserDetail), 200)]
        public async Task<IActionResult> ChangePassword([FromBody] DTO.ChangePassword model)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var result = await _UserService.ChangePassword(user.Id, model.OldPassword, model.Password);
            return Ok(result);
        }
        [AllowAnonymous]
        [HttpGet("userAlert")]
        public async Task<IActionResult> UserAlert()
        {
            DTO.UserAlertViewModel model = new DTO.UserAlertViewModel();
            if (User.Identity.IsAuthenticated)
            {

                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                #region Find User Type
                string UserType = "";
                if (await _UserManager.IsInRoleAsync(user, "Admin"))
                {
                    UserType = "Company";
                }
                else if (await _UserManager.IsInRoleAsync(user, "Tutor"))
                {
                    if (await companyService.IsCompanyTutor(user))
                    {
                        UserType = "CompanyTutor";
                    }
                    else
                    {
                        UserType = "Tutor";
                    }
                }
                else if (user.IsParent)
                {
                    UserType = "Parent";
                }
                else
                {
                    UserType = "Student";
                }
                #endregion
                model = await _UserService.UserAlert(user, UserType);
            }
            return Ok(model);
        }

        [HttpPost("messageStatusUpdate")]
        public async Task<IActionResult> MessageStatusUpdate([FromBody] DTO.UserMessageUpdateModel model)
        {
            var returnObject = await _UserService.MessageStatusUpdate(model);
            return Ok(returnObject);
        }

        [HttpGet("readMessage/{msgId}/{refId}")]
        [ProducesResponseType(typeof(DTO.UserMessageUpdateModel), 200)]
        public async Task<IActionResult> ReadMessage(Guid msgId,Guid refId)
        {
            var returnObject = await _UserService.ReadMessage(msgId, refId);
            return Ok(true);
        }
    }
}