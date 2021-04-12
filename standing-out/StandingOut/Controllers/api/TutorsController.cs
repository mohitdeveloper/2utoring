using System;
using System.Collections.Generic;
using StandingOut.Business.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using StandingOut.Extensions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;

namespace StandingOut.Controllers.api
{
    // NOT Used at Registration - See Store > TutorsController.
    [Authorize(Roles = "Tutor")]
    [Produces("application/json")]
    [Route("api/Tutors")]
    public class TutorsController : BaseController
    {
        private readonly ITutorService _TutorService;
        private readonly UserManager<Models.User> _UserManager;

        public TutorsController(ITutorService tutorService, UserManager<Models.User> userManager)
        {
            _TutorService = tutorService;
            _UserManager = userManager;
        }
        
        [HttpGet("")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Tutor>), 200)]
        public async Task<IActionResult> Get()
        {
            var tutors = await _TutorService.Get();
            return Ok(Mappings.Mapper.Map<List<Models.Tutor>, List<DTO.Tutor>>(tutors));
        }

        [HttpGet("My")]
        [ProducesResponseType(typeof(DTO.Tutor), 200)]
        public async Task<IActionResult> GetMy()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var model = await _TutorService.GetById(user.TutorId.Value);
            return Ok(Mappings.Mapper.Map<Models.Tutor, DTO.EditTutor>(model));
        }      

        [HttpPost("{id}")]
        [ProducesResponseType(typeof(DTO.Tutor), 200)]
        public async Task<IActionResult> Put(Guid id, [FromBody]DTO.EditTutor editTutor)
        {
            if(id != editTutor.TutorId)
                return BadRequest();

            var user = await _UserManager.FindByNameAsync(User.Identity.Name);
            if (user.TutorId != editTutor.TutorId)
                return Unauthorized();

            var model = await _TutorService.UpdateMy(editTutor);
            var tutor = await _TutorService.GetById(model.TutorId);
            return Ok(Mappings.Mapper.Map<Models.Tutor, DTO.EditTutor>(tutor));
        }

        [HttpPost("upload")]
        [ProducesResponseType(typeof(DTO.EditTutor), 200)]
        public async Task<IActionResult> Upload(ICollection<IFormFile> file, Guid tutorId)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _UserManager.FindByNameAsync(User.Identity.Name);
                if (user.TutorId != tutorId)
                    return Unauthorized();

                var tutor = await _TutorService.UploadImage(tutorId, file);
                return Ok(Mappings.Mapper.Map<Models.Tutor, DTO.EditTutor>(tutor));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }
    }
}
