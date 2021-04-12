using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Hubs.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using StandingOut.Shared.Mapping;

namespace StandingOut.Hubs.Controllers
{
    [Produces("application/json")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/classroom/{classSessionId}/SessionWhiteBoards")]
    public class SessionWhiteBoardController : BaseController
    {
        // USE THIS CONTROLLER WHEN BOTH A RESPONSE AND HUB ARE REQUIRED
        // IF YOU DO NOT NEED TO USE A HUB -> USE THE API CONTROLLER IN THE CLASSROOM PROJECT
        // I MEAN IT

        // WHEN ADDING EXTRA SERVICES -> ENSURE THE STARTUP HAS THE DI SET UP FOR IT
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISessionWhiteBoardService _SessionWhiteBoardService;
        private readonly IHubContext<WhiteboardHub> _WhiteboardHub;

        public SessionWhiteBoardController(UserManager<Models.User> userManager, ISessionWhiteBoardService sessionWhiteBoardService, IHubContext<WhiteboardHub> whiteboardHub)
        {
            _UserManager = userManager;
            _SessionWhiteBoardService = sessionWhiteBoardService;
            _WhiteboardHub = whiteboardHub;
        }

        [HttpPost("{sessionWhiteBoardId}/save")]
        [ProducesResponseType(typeof(Guid), 200)]
        public async Task<IActionResult> Save(Guid classSessionId, Guid sessionWhiteBoardId, DTO.SessionWhiteBoardSaveImage imageInfo)
        {
            if (imageInfo == null || string.IsNullOrWhiteSpace(imageInfo.ImageData))
                return BadRequest();

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var sessionWhiteBoardSave = await _SessionWhiteBoardService.Save(classSessionId, sessionWhiteBoardId, user.Id, imageInfo);

            //ML Removed, this isn't right
            //if (imageInfo.Name != null && imageInfo.Name != "Individual") // Not taking any defaults
            //    await _WhiteboardHub.Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("named", sessionWhiteBoardId, imageInfo.Name, true);

            return Ok(sessionWhiteBoardSave.SessionWhiteBoardSaveId);
        }

        //[Authorize(Roles = "Tutor")]
        [HttpGet("getWhiteBoardForCollaboration")]
        [ProducesResponseType(typeof(DTO.SessionWhiteBoard), 200)]
        public async Task<IActionResult> GetWhiteBoardForCollaboration(Guid classSessionId, Guid? sessionWhiteBoardId, Guid? groupId, string userId)
        {
            //if (!User.IsInRole("Tutor"))
            //    return Forbid();

            var result = await _SessionWhiteBoardService.GetWhiteBoardForCollaboration(classSessionId, sessionWhiteBoardId, groupId, userId);
            if (result != null)
                await _WhiteboardHub.Clients.Groups(result.SessionWhiteBoardId.ToString()).SendAsync("collaborate", result.SessionWhiteBoardId, string.IsNullOrWhiteSpace(result.Name) ? "Individual" : result.Name);
            else
                return BadRequest();

            return Ok(result);
        }

        [HttpPost("uploadImage/{sessionWhiteBoardId}/{sizeX}/{sizeY}")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> UploadImage(Guid classSessionId, Guid sessionWhiteBoardId, int sizeX, int sizeY, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest();

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            List<Models.SessionWhiteBoardHistory> histories;
            string directory;
            (directory, histories) = await _SessionWhiteBoardService.UploadImage(classSessionId, sessionWhiteBoardId, user, file, sizeX, sizeY);
            return await HandleImportResponses(sessionWhiteBoardId, directory, histories);
        }

        //[HttpPost("{sessionWhiteBoardId}/importFromDrive/{fileId}/{sizeX}/{sizeY}")]
        [HttpPost("importFromDrive/{sessionWhiteBoardId}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> ImportFromDrive(Guid classSessionId, Guid sessionWhiteBoardId, string fileId, int sizeX, int sizeY)
        {
            if (string.IsNullOrEmpty(fileId))
                return BadRequest();

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            List <Models.SessionWhiteBoardHistory> histories;
            string directory;
            (directory, histories) = await _SessionWhiteBoardService.ImportFromDrive(classSessionId, sessionWhiteBoardId, user, fileId, sizeX, sizeY);
            return await HandleImportResponses(sessionWhiteBoardId, directory, histories);
        }

        private async Task<IActionResult> HandleImportResponses(Guid sessionWhiteBoardId, string directory, List<Models.SessionWhiteBoardHistory> histories)
        {
            if (histories.Count > 0)
            {
                foreach (var history in histories)
                {
                    await _WhiteboardHub.Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("draw", sessionWhiteBoardId,
                        Mappings.Mapper.Map<Models.SessionWhiteBoardHistory, DTO.SessionWhiteBoardHistory>(history)
                    );
                }

                return Ok(); // No further action required - Image was bigger than the canvas so has be resized and set, no need to move around
            }
            else
                return Ok(new { directory = directory }); // Tell front end where this is so can be moved about first before setting
        }

        [HttpPost("{sessionWhiteBoardId}/name")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> UpdateName(Guid classSessionId, Guid sessionWhiteBoardId, [FromBody]DTO.UpdateName model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            await _SessionWhiteBoardService.ChangeName(classSessionId, sessionWhiteBoardId, user, model.Name, User.IsInRole("Tutor"));

            await _WhiteboardHub.Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("named", sessionWhiteBoardId, model.Name, false);


            return Ok(); 
        }
    }
}
