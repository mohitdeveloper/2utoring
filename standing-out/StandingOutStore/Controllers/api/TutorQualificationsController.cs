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
    [Authorize]
    [Produces("application/json")]
    [Route("api/TutorQualifications")]
    public class TutorQualificationsController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutorQualificationService _TutorQualificationService;

        public TutorQualificationsController(UserManager<Models.User> userManager, ITutorQualificationService tutorQualificationService)
        {
            _UserManager = userManager;
            _TutorQualificationService = tutorQualificationService;
        }

        [AllowAnonymous]
        [HttpGet("getByTutor/{id}")]
        public async Task<IActionResult> GetByTutor(Guid id)
        {
            var tutorQualifications = await _TutorQualificationService.GetByTutor(id);
            return Ok(Mappings.Mapper.Map<List<Models.TutorQualification>, List<DTO.TutorQualification>>(tutorQualifications));
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.TutorQualification), 200)]
        public async Task<IActionResult> Create([FromBody]DTO.TutorQualification model)
        {
            var tutorQualification = await _TutorQualificationService.Create(Mappings.Mapper.Map<DTO.TutorQualification, Models.TutorQualification>(model));
            return Ok(Mappings.Mapper.Map<Models.TutorQualification, DTO.TutorQualification>(tutorQualification));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _TutorQualificationService.Delete(id);
            return Ok();
        }
    }
}