using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOut.Data.Enums;
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

namespace StandingOutStore.Controllers.api
{

    [Authorize]
    [Produces("application/json")]
    [Route("api/CompanyTutor")]
    public class CompanyTutorController : NewBaseController
    {

        private readonly ICompanyTutorService _CompanyTutorService;
        private readonly UserManager<Models.User> _UserManager;
        private readonly ICompanyService _companyService;
        public CompanyTutorController(ICompanyTutorService companyTutorService, UserManager<Models.User> userManager, IUserService userService, IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings, companyService)
        {
            _CompanyTutorService = companyTutorService;
            _UserManager = userManager;
            _companyService = companyService;
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.CompanyTutor), 200)]
        public async Task<IActionResult> Post([FromBody] DTO.CompanyTutor model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newModel = await _CompanyTutorService.Create(Mappings.Mapper.Map<DTO.CompanyTutor, Models.CompanyTutor>(model));
            return Ok(Mappings.Mapper.Map<Models.CompanyTutor, DTO.CompanyTutor>(newModel));

        }

        [HttpGet("getTutorByCompany")]
        [ProducesResponseType(typeof(IEnumerable<DTO.CompanyTutor>), 200)]
        public async Task<IActionResult> GetTutorByCompany()
        {
            List<Models.Tutor> model = new List<Models.Tutor>();
            if (Caller.IsAdmin)
            {
                model = await _CompanyTutorService.GetTutorByCompany(Caller.CurrentUserCompany.CompanyId);
            }

            return Ok(Mappings.Mapper.Map<List<Models.Tutor>, List<DTO.Tutor>>(model));
        }

        [HttpPost("getCompanyTutorBySubject")]
        [ProducesResponseType(typeof(IEnumerable<DTO.CompanyTutor>), 200)]
        public async Task<IActionResult> GetCompanyTutorBySubject([FromBody] DTO.SubjectStudyLevelSetupPrice subjectStudy)
        {
            List<Models.Tutor> model = new List<Models.Tutor>();
            if (Caller.IsAdmin)
            {
                model = await _CompanyTutorService.GetCompanyTutorBySubject(Caller.CurrentUserCompany.CompanyId, subjectStudy.SubjectId, subjectStudy.StudyLevelId);
            }

            return Ok(Mappings.Mapper.Map<List<Models.Tutor>, List<DTO.Tutor>>(model));
        }



        [HttpGet("getUserType")]
        public async Task<IActionResult> GetUserType()
        {
            string UserType = string.Empty;
            if (Caller.IsAdmin)
            {
                UserType = "Company";
            }
            else if (Caller.IsTutor && Caller.CurrentUser.TutorId != null)
            {
                var CT = await _CompanyTutorService.GetTutorCompany(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));
                if (CT != null)
                    UserType = "CompanyTutor";
                else
                    UserType = "Tutor";

            }
            return Ok(UserType);
        }




        [HttpPost("getCompanyTutors")]
        public async Task<IActionResult> GetTutorsByCompanySubjectAndLevel([FromBody] DTO.CTutor model)
        {

            List<DTO.TutorDDL> tutors = new List<DTO.TutorDDL>();

            if (Caller.IsAdmin)
            {
                var TutorList = await _CompanyTutorService.GetTutorsByCompanySubjectAndLevel(Guid.Parse(Caller.CurrentUserCompany.CompanyId.ToString()), model.SubjectId, model.StudyLevelId);
                foreach (var item in TutorList)
                {
                    var user = item.Users.FirstOrDefault();
                    if (model.IsGoogleEnabled)
                    {
                        var existingLogins = await _UserManager.GetLoginsAsync(user);
                        if (existingLogins.Any(o => o.LoginProvider == "Google"))
                        {
                            tutors.Add(new DTO.TutorDDL { TutorId = item.TutorId, Name = (user.Title + " " + user.FirstName + " " + user.LastName) });
                        }
                    }
                    else
                    {
                        tutors.Add(new DTO.TutorDDL { TutorId = item.TutorId, Name = (user.Title + " " + user.FirstName + " " + user.LastName) });
                    }
                }
            }
            return Ok(tutors);
        }

        [HttpPost("getTutorByAvailability")]
        public async Task<IActionResult> GetTutorByAvailability([FromBody] DTO.CTutorAvailability model)
        {
            List<DTO.TutorDDL> tutors = new List<DTO.TutorDDL>();
            if (Caller.IsAdmin)
            {
                 tutors = await _CompanyTutorService.GetTutorByAvailability(Guid.Parse(Caller.CurrentUserCompany.CompanyId.ToString()), model);
            }
            return Ok(tutors);
        }

      
        [HttpGet("getTutorDetail/{id}")]
        public async Task<IActionResult> GetTutorByAvailability(Guid id)
        {
            DTO.Tutor tutorDetail = new DTO.Tutor();
            if (Caller.IsAdmin)
            {
                tutorDetail = await _CompanyTutorService.GetTutorDetail(Guid.Parse(Caller.CurrentUserCompany.CompanyId.ToString()), id);
            }
            return Ok(tutorDetail);
        }

        [HttpGet("checkCompanyUsersHasDBS")]
        public async Task<IActionResult> CheckCompanyUserHasDBS()
        {
            bool isDBSApprove = false;
            if (Caller.IsAdmin)
            {
                var CT = await _CompanyTutorService.GetTutorByCompany(Guid.Parse(Caller.CurrentUserCompany.CompanyId.ToString()));
                isDBSApprove = CT.Any(x => x.DbsApprovalStatus == TutorApprovalStatus.Approved);


            }
            return Ok(isDBSApprove);

        }

        [HttpGet("getCompanyTutorsSubject")]
        public async Task<IActionResult> GetCompanyTutorSubject()
        {
            if (Caller.IsAdmin)
            {
                return Ok(await _CompanyTutorService.GetCompanyTutorSubject(Guid.Parse(Caller.CurrentUserCompany.CompanyId.ToString())));
            }
            else
            {
                return Ok(null);
            }


        }
        [HttpGet("getCompanyTutorsLevelBySubject/{id}")]
        public async Task<IActionResult> GetCompanyTutorsLevelBySubject(Guid id)
        {
            if (Caller.IsAdmin)
            {
                return Ok(await _CompanyTutorService.GetCompanyTutorsLevelBySubject(Guid.Parse(Caller.CurrentUserCompany.CompanyId.ToString()), id));
            }
            else
            {
                return Ok(null);
            }


        }

    }

}
