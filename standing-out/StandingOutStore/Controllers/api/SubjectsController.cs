
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using StandingOutStore.Extensions;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using System.Linq;

namespace StandingOutStore.Controllers.api
{
    [Produces("application/json")]
    [Route("api/Subjects")]
    public class SubjectsController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISubjectService _SubjectService;
        private readonly ITutorService _tutorService;

        public SubjectsController(ISubjectService subjectService, ITutorService tutorService, UserManager<Models.User> userManager, IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings, companyService)
        {
            _UserManager = userManager;
            _SubjectService = subjectService;
            _tutorService = tutorService;
        }

        [HttpGet("options")]
        [ProducesResponseType(typeof(List<Utilities.DTOS.GuidOption>), 200)]
        public async Task<IActionResult> GetOptions()
        {
            return Ok(await _SubjectService.GetOptions());
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Subject>), 200)]
        public async Task<IActionResult> Get()
        {
            var subjects = await _SubjectService.Get();
            return Ok(Mappings.Mapper.Map<List<Models.Subject>, List<DTO.Subject>>(subjects));
        }

        [HttpGet("getTutorCompanysubjects")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Subject>), 200)]
        public async Task<IActionResult> GetTutorCompanysubjects()
        {
            List<Models.Subject> subjectList = null;
            List<Models.Subject> tutorSubjectList = null;
            if (Caller.IsAdmin)
            {
                subjectList = await _SubjectService.GetCompanySubjects(Caller.CurrentUserCompany.CompanyId);
                subjectList = subjectList.OrderBy(x => x.Name).ToList();
            }
            if (Caller.IsTutor)
            {
                //subjectList = await _SubjectService.GetTutorSubjects(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));
                
                var companyTutor = await _tutorService.GetCurrentCompanyTutor(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));
                if (companyTutor != null)
                {
                    subjectList = await _SubjectService.GetCompanySubjects(companyTutor.CompanyId);
                    tutorSubjectList = await _SubjectService.GetTutorSubjects(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));

                    subjectList = subjectList.Intersect(tutorSubjectList).ToList();
                }
                else
                {
                    subjectList = await _SubjectService.GetTutorSubjects(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));
                }
                subjectList = subjectList.OrderBy(x => x.Name).ToList();
            }
            return Ok(Mappings.Mapper.Map<List<Models.Subject>, List<DTO.Subject>>(subjectList));
        }

        [HttpPost("Paged")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.Subject>), 200)]
        public async Task<IActionResult> Paged([FromBody]DTO.SearchModel model)
        {
            var subjects = await _SubjectService.GetPaged(model);
            return Ok(subjects);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.Subject), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var model = await _SubjectService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.Subject, DTO.Subject>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.Subject), 200)]
        public async Task<IActionResult> Post([FromBody]DTO.Subject subject)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _SubjectService.Create(Mappings.Mapper.Map<DTO.Subject, Models.Subject>(subject));
            return Ok(Mappings.Mapper.Map<Models.Subject, DTO.Subject>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DTO.Subject), 200)]
        public async Task<IActionResult> Put(Guid id, [FromBody]DTO.Subject subject)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != subject.SubjectId)
            {
                return BadRequest();
            }

            var model = await _SubjectService.Update(Mappings.Mapper.Map<DTO.Subject, Models.Subject>(subject));
            return Ok(Mappings.Mapper.Map<Models.Subject, DTO.Subject>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _SubjectService.Delete(id);
            return Ok();
        }
    }
}