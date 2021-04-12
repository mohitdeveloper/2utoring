using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure;
using StandingOut.Data.Enums;
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
    [Route("api/SessionDocuments")]
    public class SessionDocumentsController : Controller
    {
        private readonly ISessionDocumentService _SessionDocumentService;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly UserManager<Models.User> _UserManager;

        public SessionDocumentsController(ISessionDocumentService sessionDocumentService, ISessionAttendeeService sessionAttendeeService,
            UserManager<Models.User> userManager)
        {
            _SessionDocumentService = sessionDocumentService;
            _SessionAttendeeService = sessionAttendeeService;
            _UserManager = userManager;
        }

        [Authorize(Roles = "Tutor, Admin")]
        [HttpGet("getMasterFiles/{classSessionId}")]
        [ProducesResponseType(typeof(Google.Apis.Drive.v3.Data.FileList), 200)]
        public async Task<IActionResult> GetMasterFiles(Guid classSessionId)
        {
            var files = await _SessionDocumentService.GetMasterFiles(classSessionId);
            return Ok(files);
        }

        [Authorize(Roles = "Tutor, Admin")]
        [HttpGet("{type}/files/{classSessionId}")]
        [ProducesResponseType(typeof(Google.Apis.Drive.v3.Data.FileList), 200)]
        public async Task<IActionResult> GetFiles(Guid classSessionId, MaterialFileType type)
        {
            var files = await _SessionDocumentService.GetFiles(classSessionId, type);
            return Ok(files);
        }

        [Authorize(Roles = "Tutor, Admin")]
        [HttpPost("upload/{classSessionId}")]
        [ProducesResponseType(typeof(Google.Apis.Drive.v3.Data.File), 200)]
        public async Task<IActionResult> Post(ICollection<IFormFile> file, Guid classSessionId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _SessionDocumentService.UploadToMaster(classSessionId, file.First());
            return Ok(model);
        }

        [Authorize(Roles = "Tutor, Admin")]
        [HttpPost("{type}/upload/{classSessionId}")]
        [ProducesResponseType(typeof(Google.Apis.Drive.v3.Data.File), 200)]
        public async Task<IActionResult> PostByType(ICollection<IFormFile> file, Guid classSessionId, MaterialFileType type)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _SessionDocumentService.UploadTo(classSessionId, file.First(), type);
            return Ok(model);
        }

        [Authorize(Roles = "Tutor, Admin")]
        [HttpDelete("{classSessionId}/{fileId}")]
        [ProducesResponseType(typeof(Google.Apis.Drive.v3.Data.File), 200)]
        public async Task<IActionResult> Delete(Guid classSessionId, string fileId)
        {
            await _SessionDocumentService.Delete(classSessionId, fileId);
            await _SessionDocumentService.DeleteGoogleFilePermissions(classSessionId, fileId);
            return Ok();
        }

        [Authorize(Roles = "Tutor, Admin")]
        [HttpGet("attendees/{classSessionId}")]
        [ProducesResponseType(typeof(List<DTO.SessionAttendeeFileUploader>), 200)]
        public async Task<IActionResult> GetAttendeesForFileUpload(Guid classSessionId)
        {
            var model = await _SessionAttendeeService.GetForFileUpload(classSessionId);
            return Ok(model);
        }

        [Authorize(Roles = "Tutor, Admin")]
        [HttpPatch("attendees/{classSessionId}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> UpdatePermissions(Guid classSessionId, [FromBody] DTO.SessionAttendeeFileUploaderComplete model)
        {
            if (model.FileIds.Count == 0 || model.SessionAttendees.Count == 0)
                return BadRequest();

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            await _SessionDocumentService.UpdatePermissions(classSessionId, user, model.FileIds, model.SessionAttendees);
            return Ok();
        }
        [Authorize(Roles = "Tutor, Admin")]
        [HttpGet("sendRequestToLinkGoogleAccount/{sessionAttendeeId}")]
        [ProducesResponseType(typeof(List<DTO.SessionAttendeeFileUploader>), 200)]
        public async Task<IActionResult> SendRequestToLinkGoogleAccount(Guid sessionAttendeeId)
        {
            var model = await _SessionDocumentService.SendRequestToLinkGoogleAccount(sessionAttendeeId);
            return Ok(model);
        }
        [Authorize(Roles = "Tutor, Admin")]
        [HttpGet("getGoogleFilePermission/{classSessionId}/{fileId}")]
        [ProducesResponseType(typeof(List<DTO.GoogleFilePermission>), 200)]
        public async Task<IActionResult> GetGoogleFilePermission(Guid classSessionId,  string fileId)
        {
            var model = await _SessionDocumentService.GetGoogleFilePermissions(classSessionId,fileId);
            return Ok(model);
        }
    }
}