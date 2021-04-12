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

namespace StandingOut.Classroom.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/classroom/{classSessionId}/SessionWhiteBoards")]
    public class SessionWhiteBoardsController : BaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IUserService _UserService;
        private readonly ISessionWhiteBoardService _SessionWhiteBoardService;
        private readonly ISessionDocumentService _SessionDocumentService;

        public SessionWhiteBoardsController(UserManager<Models.User> userManager, IUserService userService, 
            ISessionWhiteBoardService sessionWhiteBoardService, ISessionDocumentService sessionDocumentService)
        {
            _UserManager = userManager;
            _UserService = userService;
            _SessionWhiteBoardService = sessionWhiteBoardService;
            _SessionDocumentService = sessionDocumentService;
        }
        
        [HttpGet("getMyWhiteBoards")]
        [ProducesResponseType(typeof(IEnumerable<DTO.SessionWhiteBoard>), 200)]
        public async Task<IActionResult> GetMyWhiteBoards(Guid classSessionId, int sizeX, int sizeY)
        {
            var sessionWhiteBoards = await _SessionWhiteBoardService.GetMyWhiteBoards(classSessionId, sizeX, sizeY);
            return Ok(sessionWhiteBoards);
        }

        //[HttpPost("addCommand")]
        //[ProducesResponseType(typeof(void), 200)]
        //public async Task<IActionResult> AddCommand(Guid classSessionId, [FromBody]DTO.SessionWhiteBoardHistory model)
        //{
        //    var command = await _SessionWhiteBoardService.AddCommand(classSessionId, model);
        //    var result = Mappings.Mapper.Map<Models.SessionWhiteBoardHistory, DTO.SessionWhiteBoardHistory>(command);
        //    result.IntermediateId = model.IntermediateId;
        //    await _WhiteboardHub.Clients.Group(model.SessionWhiteBoardId.ToString()).SendAsync("draw", model.SessionWhiteBoardId, result);
        //    return Ok();
        //}

        //[HttpPost("{sessionWhiteBoardId}/addLoadCommand")]
        //[ProducesResponseType(typeof(void), 200)]
        //public async Task<IActionResult> AddLoadCommand(Guid classSessionId, Guid sessionWhiteBoardId, [FromBody]DTO.LoadCommand model)
        //{
        //    var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
        //    var histories = await _SessionWhiteBoardService.AddLoadCommand(classSessionId, sessionWhiteBoardId, user.Id, model);
        //    foreach (var history in histories)
        //    {
        //        await _WhiteboardHub.Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("draw", sessionWhiteBoardId,
        //            Mappings.Mapper.Map<Models.SessionWhiteBoardHistory, DTO.SessionWhiteBoardHistory>(history)
        //        );
        //    }
        //    return Ok();
        //}

        [HttpPost("createIndividualBoard")]
        [ProducesResponseType(typeof(DTO.SessionWhiteBoard), 200)]
        public async Task<IActionResult> CreateIndividualBoard(Guid classSessionId, [FromBody] DTO.SessionWhiteBoard model)
        {
            var sessionWhiteBoard = await _SessionWhiteBoardService.Create(Mappings.Mapper.Map<DTO.SessionWhiteBoard, Models.SessionWhiteBoard>(model));
            return Ok(Mappings.Mapper.Map<Models.SessionWhiteBoard, DTO.SessionWhiteBoard>(sessionWhiteBoard));
        }

        [HttpGet("openIndividualBoard/{sessionWhiteBoardSaveId}")]
        [ProducesResponseType(typeof(DTO.SessionWhiteBoard), 200)]
        public async Task<IActionResult> OpenIndividualBoard(Guid classSessionId, Guid sessionWhiteBoardSaveId)
        {
            var sessionWhiteBoard = await _SessionWhiteBoardService.Open(classSessionId, sessionWhiteBoardSaveId);
            return Ok(sessionWhiteBoard);
        }

        [HttpGet("openInactiveBoard/{sessionWhiteBoardId}")]
        [ProducesResponseType(typeof(DTO.SessionWhiteBoard), 200)]
        public async Task<IActionResult> OpenInactiveBoard(Guid classSessionId, Guid sessionWhiteBoardId)
        {
            var user = await _UserService.GetByEmail(User.Identity.Name);
            var sessionWhiteBoard = await _SessionWhiteBoardService.OpenInactiveBoard(classSessionId, user.Id, sessionWhiteBoardId);
            return Ok(sessionWhiteBoard);
        }

        [HttpGet("getMySavedWhiteBoards")]
        [ProducesResponseType(typeof(List<DTO.SessionWhiteBoardSaveResult>), 200)]
        public async Task<IActionResult> GetMySavedWhiteBoards(Guid classSessionId)
        {
            var results = await _SessionWhiteBoardService.GetSavedWhiteBoards(classSessionId);
            return Ok(results);
        }

        [HttpDelete("sessionWhiteBoardSaves/{sessionWhiteBoardSaveId}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> DeleteSessionWhiteBoardSave(Guid classSessionId, Guid sessionWhiteBoardSaveId)
        {
            await _SessionWhiteBoardService.DeleteSessionWhiteBoardSave(sessionWhiteBoardSaveId);
            return Ok();
        }

        [HttpPost("getLoadData")]
        [ProducesResponseType(typeof(List<DTO.WhiteboardData>), 200)]
        public async Task<IActionResult> GetLoadData(Guid classSessionId, [FromBody]DTO.SessionWhiteBoardSaveResult model)
        {
            var results = await _SessionWhiteBoardService.GetLoadData(model);
            return Ok(results);
        }

        [HttpGet("getUsersForShare")]
        [ProducesResponseType(typeof(List<DTO.SessionWhiteBoardShare>), 200)]
        public async Task<IActionResult> GetUsersForShare(Guid classSessionId, Guid sessionWhiteBoardId, string userId, bool individual, string whiteBoardUserId)
        {
            var result = await _SessionWhiteBoardService.GetUsersForShare(classSessionId, sessionWhiteBoardId, userId, individual, whiteBoardUserId);
            return Ok(result);
        }

        [HttpGet("getSharedBoard")]
        [ProducesResponseType(typeof(DTO.SessionWhiteBoard), 200)]
        public async Task<IActionResult> GetSharedBoard(Guid classSessionId, Guid sessionWhiteBoardId, string userId)
        {
            var result = await _SessionWhiteBoardService.GetSharedBoard(classSessionId, sessionWhiteBoardId, userId);
            return Ok(result);
        }

        [HttpGet("getMySharedWhiteBoards")]
        [ProducesResponseType(typeof(List<DTO.SessionWhiteBoardShareLoad>), 200)]
        public async Task<IActionResult> GetMySharedWhiteBoards(Guid classSessionId, string userId)
        {
            var result = await _SessionWhiteBoardService.GetSharedWhiteBoards(classSessionId, userId);
            return Ok(result);
        }

        [HttpGet("getMyInactiveWhiteboards")]
        [ProducesResponseType(typeof(List<DTO.SessionWhiteBoardShareLoad>), 200)]
        public async Task<IActionResult> GetMyInactiveWhiteboards(Guid classSessionId, string userId)
        {
            var result = await _SessionWhiteBoardService.GetMyInactiveWhiteboards(classSessionId, userId);
            return Ok(result);
        }

        [Authorize(Roles = "Tutor")]
        [HttpGet("getWhiteBoardsForCollaborate")]
        [ProducesResponseType(typeof(DTO.SessionWhiteBoardCollaborateOverall), 200)]
        public async Task<IActionResult> GetWhiteBoardsForCollaborate(Guid classSessionId, string userId)
        {
            var result = await _SessionWhiteBoardService.GetWhiteBoardsForCollaborate(classSessionId, userId);
            return Ok(result);
        }

        [HttpGet("getImage/{sessionWhiteBoardId}/{fileName}")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> GetImage(Guid classSessionId, Guid sessionWhiteBoardId, string fileName)
        {
            var fileBytes = await _SessionWhiteBoardService.GetImage(classSessionId, fileName);
            return File(fileBytes, "application/octect-stream", fileName);
        }

        [HttpPost("exportWhiteBoard/{userId}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> ExportWhiteBoard(Guid classSessionId, string userId, [FromForm]DTO.SessionWhiteBoardSaveImage imageInfo)
        {
            if (imageInfo == null || string.IsNullOrWhiteSpace(imageInfo.ImageData))
                return BadRequest();

            await _SessionDocumentService.ExportWhiteBoard(classSessionId, userId, imageInfo);
            return Ok();
        }

        [HttpGet("sessionGroup/{sessionGroupId}")]
        [ProducesResponseType(typeof(DTO.SessionWhiteBoard), 200)]
        public async Task<IActionResult> GetGroupWhiteBoard(Guid classSessionId, Guid sessionGroupId)
        {
            var sessionWhiteBoard = await _SessionWhiteBoardService.GetGroupWhiteBoard(classSessionId, sessionGroupId);
            return Ok(sessionWhiteBoard);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(IEnumerable<DTO.SessionWhiteBoard>), 200)]
        public async Task<IActionResult> GetById(Guid classSessionId, Guid id)
        {
            var command = await _SessionWhiteBoardService.GetFullWhiteBoard(id);
            return Ok(Mappings.Mapper.Map<Models.SessionWhiteBoard, DTO.SessionWhiteBoard>(command));
        }
    }
}
