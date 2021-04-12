using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Extensions;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StandingOut.Controllers.api
{
    [Authorize(Roles = "Tutor")]
    [Route("api/Session/{classSessionId}/SessionDocuments")]
    public class SessionDocumentsController : BaseController
    {
        private readonly ISessionDocumentService _SessionDocumentService;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly UserManager<Models.User> _UserManager;

        public SessionDocumentsController(ISessionDocumentService sessionDocumentService, UserManager<Models.User> userManager, ISessionAttendeeService sessionAttendeeService)
        {
            _SessionDocumentService = sessionDocumentService;
            _UserManager = userManager;
            _SessionAttendeeService = sessionAttendeeService;
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(Google.Apis.Drive.v3.Data.FileList), 200)]
        public async Task<IActionResult> Get(Guid classSessionId)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var files = await _SessionDocumentService.Get(classSessionId, user);
            return Ok(files);
        }

        [HttpGet("navigation/same/{folderId}")]
        [ProducesResponseType(typeof(DTO.FileNavigation), 200)]
        public async Task<IActionResult> GetByFolderIdSame(Guid classSessionId, string folderId)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var files = await _SessionDocumentService.GetByFolderIdSame(classSessionId, user, folderId);
            return Ok(files);
        }

        [HttpGet("navigation/down/{folderId}")]
        [ProducesResponseType(typeof(Google.Apis.Drive.v3.Data.FileList), 200)]
        public async Task<IActionResult> GetByFolderIdDown(Guid classSessionId, string folderId)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var files = await _SessionDocumentService.GetByFolderIdDown(classSessionId, user, folderId);
            return Ok(files);
        }

        [HttpGet("navigation/up/{folderId}")]
        [ProducesResponseType(typeof(DTO.FileNavigation), 200)]
        public async Task<IActionResult> GetByFolderIdUp(Guid classSessionId, string folderId)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var files = await _SessionDocumentService.GetByFolderIdUp(classSessionId, user, folderId);
            return Ok(files);
        }

        [HttpPost("navigation/page/{folderId}")]
        [ProducesResponseType(typeof(DTO.FileNavigation), 200)]
        public async Task<IActionResult> PostForClassroomByFolderPage(Guid classSessionId, string folderId, [FromBody]DTO.GooglePaging googlePaging)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var files = await _SessionDocumentService.GetByFolderIdSame(classSessionId, user, folderId, googlePaging.PageToken);
            return Ok(files);
        }

        [HttpPost("upload/{folderId}")]
        [ProducesResponseType(typeof(Google.Apis.Drive.v3.Data.File), 200)]
        public async Task<IActionResult> Post(ICollection<IFormFile> file, Guid classSessionId, string folderId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var model = await _SessionDocumentService.Upload(folderId, user, file.First());
            return Ok(model);
        }

        [HttpDelete("{id}/delete")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid classSessionId, string id)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var success = await _SessionDocumentService.Delete(classSessionId, user, id);
            if (success)
                return Ok();
            else
                return BadRequest();
        }

        [HttpGet("getAttendeesForFileUpload")]
        [ProducesResponseType(typeof(List<DTO.SessionAttendeeFileUploader>), 200)]
        public async Task<IActionResult> GetAttendeesForFileUpload(Guid classSessionId)
        {
            var model = await _SessionAttendeeService.GetForFileUpload(classSessionId);
            return Ok(model);
        }

        [HttpGet("getAttendeesForFileSetup/{fileId}")]
        [ProducesResponseType(typeof(List<DTO.SessionAttendeeFileUploader>), 200)]
        public async Task<IActionResult> GetAttendeesForFileSetup(Guid classSessionId, string fileId)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var model = await _SessionAttendeeService.GetForFileSetup(classSessionId, user, fileId);
            return Ok(model);
        }

        [HttpPost("shareFileUpload")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> ShareFileUpload(Guid classSessionId, [FromBody]DTO.SessionAttendeeFileUploaderComplete model)
        {
            if (model.FileIds.Count == 0 || model.SessionAttendees.Count == 0)
                return BadRequest();

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            await _SessionDocumentService.ShareFileUploadSetup(classSessionId, user, model.FileIds, model.SessionAttendees);
            return Ok();
        }
    }
}
