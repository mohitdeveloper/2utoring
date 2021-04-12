using System;
using System.Collections.Generic;
using StandingOut.Business.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Extensions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using StandingOut.Data.Enums;

namespace StandingOut.Classroom.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/classroom/{classSessionId}/SessionDocuments")]
    public class SessionDocumentsController : BaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISessionDocumentService _SessionDocumentService;
        private readonly ISessionAttendeeService _SessionAttendeeService;

        public SessionDocumentsController(UserManager<Models.User> userManager, ISessionDocumentService sessionDocumentService, 
            ISessionAttendeeService sessionAttendeeService)
        {
            _UserManager = userManager;
            _SessionDocumentService = sessionDocumentService;
            _SessionAttendeeService = sessionAttendeeService;
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(Google.Apis.Drive.v3.Data.FileList), 200)]
        public async Task<IActionResult> Get(Guid classSessionId, string studentId, bool sharedFolder = false)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var files = await _SessionDocumentService.Get(classSessionId, user, studentId, sharedFolder);
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

        [HttpPost("screenshot")]
        [ProducesResponseType(typeof(Google.Apis.Drive.v3.Data.File), 200)]
        public async Task<IActionResult> Post(Guid classSessionId, [FromBody]DTO.ScreenshotData model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var file = await _SessionDocumentService.Upload(classSessionId, user, model);
            return Ok(file);
        }

        [HttpDelete("delete/{id}")]
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

        [HttpGet("getMasterFilePermission/{fileId}")]
        [ProducesResponseType(typeof(List<DTO.SessionAttendeeFileUploader>), 200)]
        public async Task<IActionResult> GetFilePermission(Guid classSessionId,string fileId)
        {
            var model = await _SessionAttendeeService.GetFilePermission(classSessionId,fileId);
            return Ok(model);
        }

        [HttpPost("upload/{folderId}")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> Post(IFormFile file, Guid classSessionId, string folderId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (!User.IsInRole("Tutor"))
                return BadRequest();

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var model = await _SessionDocumentService.Upload(folderId, user, file);
            return Ok(model.Id);
        }

        [HttpPost("shareFileUpload")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> ShareFileUpload(Guid classSessionId, [FromBody]DTO.SessionAttendeeFileUploaderComplete model)
        {
            if (model.FileIds.Count == 0 || model.SessionAttendees.Count == 0)
                return BadRequest();
            if (!User.IsInRole("Tutor"))
                return BadRequest();

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            await _SessionDocumentService.ShareFileUpload(classSessionId, user, model.FileIds, model.SessionAttendees);

            return Ok();
        }

        [HttpGet("getPermissions/{fileId}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> GetPermissions(Guid classSessionId, string fileId, string folderId = null)
        {
            if (!User.IsInRole("Tutor"))
                return BadRequest();

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var models = await _SessionAttendeeService.GetForFileUpload(classSessionId, folderId);
            await _SessionDocumentService.GetPermissions(classSessionId, user, fileId, models);
            return Ok(models);
        }

        //[HttpPut("updatePermissions")]
        //[ProducesResponseType(typeof(void), 200)]
        //public async Task<IActionResult> UpdatePermissions(Guid classSessionId, [FromBody]DTO.SessionAttendeeFileUploaderComplete model)
        //{
        //    if (model.FileIds.Count == 0 || model.SessionAttendees.Count == 0)
        //        return BadRequest();
        //    if (!User.IsInRole("Tutor"))
        //        return BadRequest();

        //    var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
        //    await _SessionDocumentService.UpdatePermissions(classSessionId, user, model.FileIds, model.SessionAttendees);
        //    await _TutorCommandHub.Clients.Group(classSessionId.ToString()).SendAsync("filePermissionsChange", model.FileIds);
        //    return Ok();
        //}

        [HttpPost("createGoogleFile")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> CreateGoogleFile(Guid classSessionId, [FromBody]DTO.CreateGoogleFile model)
        {
            if (string.IsNullOrWhiteSpace(model.Name))
                model.Name = DateTime.Now.ToString() + "_" + Enum.GetName(typeof(FileType), model.FileType);

            
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (!User.IsInRole("Tutor"))
            {
                var sessionAttendee = await _SessionAttendeeService.GetByClassSessionAtendeeId(classSessionId, user.Id);

                if(model.FolderId != sessionAttendee.SessionAttendeeDirectoryId)
                    return BadRequest();
            }

            await _SessionDocumentService.CreateGoogleFile(classSessionId, user, model);
            return Ok();
        }
    }
}
