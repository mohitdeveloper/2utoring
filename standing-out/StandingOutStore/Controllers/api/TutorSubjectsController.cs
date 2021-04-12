using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers.api
{
    
    [Produces("application/json")]
    [Route("api/TutorSubjects")]
    public class TutorSubjectsController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutorSubjectService _TutorSubjectService;

        public TutorSubjectsController(UserManager<Models.User> userManager, ITutorSubjectService tutorSubjectService)
        {
            _UserManager = userManager;
            _TutorSubjectService = tutorSubjectService;
        }

        [AllowAnonymous]
        [HttpGet("getByTutor/{id}")]
        public async Task<IActionResult> GetByTutor(Guid id)
        {
            var tutorSubjects = await _TutorSubjectService.GetByTutor(id);
            return Ok(Mappings.Mapper.Map<List<Models.TutorSubject>, List<DTO.TutorSubject>>(tutorSubjects));
        }

        [AllowAnonymous]
        [HttpGet("getByTutorForProfile/{id}")]
        public async Task<IActionResult> GetByTutorForProfile(Guid id)
        {
            var tutorSubjects = await _TutorSubjectService.GetByTutorForProfile(id);
            return Ok(tutorSubjects);
        }

        [Authorize]
        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.TutorSubject), 200)]
        public async Task<IActionResult> Create([FromBody]DTO.TutorSubject model)
        {
            var tutorSubject = await _TutorSubjectService.Create(Mappings.Mapper.Map<DTO.TutorSubject, Models.TutorSubject>(model));
            return Ok(Mappings.Mapper.Map<Models.TutorSubject, DTO.TutorSubject>(tutorSubject));
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _TutorSubjectService.Delete(id);
            return Ok();
        }
    }
}