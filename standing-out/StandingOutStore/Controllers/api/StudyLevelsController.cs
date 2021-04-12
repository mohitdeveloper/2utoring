
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using Microsoft.AspNetCore.Authorization;
using Models = StandingOut.Data.Models;
using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutStore.Extensions;
using System.Linq;

namespace StandingOutStore.Controllers.api
{
    [Produces("application/json")]
    [Route("api/StudyLevels")]
    public class StudyLevelsController : NewBaseController
    {
        private readonly IStudyLevelService _StudyLevelService;
        private readonly ITutorService _tutorService;

        public StudyLevelsController(IStudyLevelService studyLevelService, ITutorService tutorService, UserManager<Models.User> userManager, IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings, companyService)
        {
            _StudyLevelService = studyLevelService;
            _tutorService = tutorService;
        }

        [HttpGet("options")]
        [ProducesResponseType(typeof(List<DTO.GuidOptionExpanded>), 200)]
        public async Task<IActionResult> GetOptions()
        {
            return Ok(await _StudyLevelService.GetOptions());
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(IEnumerable<DTO.StudyLevel>), 200)]
        public async Task<IActionResult> Get()
        {
            var studyLevels = await _StudyLevelService.Get();
            var studyLevelsList = studyLevels.OrderBy(x => x.Name).ToList();
            return Ok(Mappings.Mapper.Map<List<Models.StudyLevel>, List<DTO.StudyLevel>>(studyLevelsList));
        }

        [HttpGet("getTutorCompanyLevels")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Subject>), 200)]
        public async Task<IActionResult> GetTutorCompanyLevels()
        {
            List<Models.StudyLevel> studyLevelList = null;

            if (Caller.IsAdmin)
            {
                studyLevelList = await _StudyLevelService.GetCompanyLevels(Caller.CurrentUserCompany.CompanyId);
                studyLevelList = studyLevelList.OrderBy(x => x.Name).ToList();
            }
            if (Caller.IsTutor)
            {
                var tutor = await _tutorService.GetById(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));
                var companyTutor = await _tutorService.GetCurrentCompanyTutor(tutor?.TutorId);
                if (companyTutor != null)
                {
                    studyLevelList = await _StudyLevelService.GetCompanyLevels(companyTutor.CompanyId);

                }
                else
                {
                    studyLevelList = await _StudyLevelService.GetTutorLevels(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));
                }
                studyLevelList = studyLevelList.OrderBy(x => x.Name).ToList();
            }

            return Ok(Mappings.Mapper.Map<List<Models.StudyLevel>, List<DTO.StudyLevel>>(studyLevelList));
        }


        [HttpGet("getTutorCompanyLevelsBySubject/{id}")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Subject>), 200)]
        public async Task<IActionResult> getTutorCompanyLevelsBySubject(Guid id)
        {
            List<Models.StudyLevel> studyLevelList = null;

            if (Caller.IsAdmin)
            {
                studyLevelList = await _StudyLevelService.GetCompanyLevelsBySubject(Caller.CurrentUserCompany.CompanyId,id);
                if (id != null)
                {
                    studyLevelList = studyLevelList.OrderBy(x => x.Name).ToList();
                }
                studyLevelList = studyLevelList.OrderBy(x => x.Name).ToList();
            }
            if (Caller.IsTutor)
            {
                studyLevelList = await _StudyLevelService.GetTutorLevelsBySubject(Guid.Parse(Caller.CurrentUser.TutorId.ToString()), id);
                //var tutor = await _tutorService.GetById(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));
                //var companyTutor = await _tutorService.GetCurrentCompanyTutor(tutor);
                //if (companyTutor != null)
                //{
                //    studyLevelList = await _StudyLevelService.GetCompanyLevelsBySubject(companyTutor.CompanyId,id);

                //}
                //else
                //{
                //    studyLevelList = await _StudyLevelService.GetTutorLevelsBySubject(Guid.Parse(Caller.CurrentUser.TutorId.ToString()),id);
                //}
                studyLevelList = studyLevelList.OrderBy(x => x.Name).ToList();
            }

            return Ok(Mappings.Mapper.Map<List<Models.StudyLevel>, List<DTO.StudyLevel>>(studyLevelList));
        }



        [HttpPost("Paged")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.StudyLevel>), 200)]
        public async Task<IActionResult> Paged([FromBody]DTO.SearchModel model)
        {
            var studyLevels = await _StudyLevelService.GetPaged(model);
            return Ok(studyLevels);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.StudyLevel), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var model = await _StudyLevelService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.StudyLevel, DTO.StudyLevel>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.StudyLevel), 200)]
        public async Task<IActionResult> Post([FromBody]DTO.StudyLevel studyLevel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _StudyLevelService.Create(Mappings.Mapper.Map<DTO.StudyLevel, Models.StudyLevel>(studyLevel));
            return Ok(Mappings.Mapper.Map<Models.StudyLevel, DTO.StudyLevel>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DTO.StudyLevel), 200)]
        public async Task<IActionResult> Put(Guid id, [FromBody]DTO.StudyLevel studyLevel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != studyLevel.StudyLevelId)
            {
                return BadRequest();
            }

            var model = await _StudyLevelService.Update(Mappings.Mapper.Map<DTO.StudyLevel, Models.StudyLevel>(studyLevel));
            return Ok(Mappings.Mapper.Map<Models.StudyLevel, DTO.StudyLevel>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _StudyLevelService.Delete(id);
            return Ok();
        }
    }
}