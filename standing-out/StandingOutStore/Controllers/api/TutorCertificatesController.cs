using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
    [Route("api/TutorCertificates")]
    public class TutorCertificatesController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutorCertificateService _TutorCertificateService;

        public TutorCertificatesController(UserManager<Models.User> userManager, ITutorCertificateService tutorCertificateService)
        {
            _UserManager = userManager;
            _TutorCertificateService = tutorCertificateService;
        }

        [HttpGet("getByTutor/{id}")]
        public async Task<IActionResult> GetByTutor(Guid id)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var tutorCertificates = await _TutorCertificateService.GetByTutor(user.TutorId.Value);
            return Ok(Mappings.Mapper.Map<List<Models.TutorCertificate>, List<DTO.TutorCertificate>>(tutorCertificates));
        }

        [HttpPost("Upload")]
        public async Task<IActionResult> Upload(ICollection<IFormFile> file)
        {
            if (file.Count > 0)
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                await _TutorCertificateService.Upload(user.TutorId.Value, file.First());
                return Ok();
            }
            else
            {
                return BadRequest("No Files Sent");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _TutorCertificateService.Delete(id);
            return Ok();
        }
    }
}