using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Extensions;
using DTO = StandingOut.Data.DTO;

namespace StandingOut.Areas.Classroom.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/classroom/{classSessionId}/SessionMessages")]
    public class SessionMessagesController : BaseController
    {
        private readonly ISessionGroupService _SessionGroupService;
        private readonly ISessionAttendeeService _SessionAttendeeService;

        public SessionMessagesController(ISessionGroupService sessionGroupService, ISessionAttendeeService sessionAttendeeService)
        {
            _SessionGroupService = sessionGroupService;
            _SessionAttendeeService = sessionAttendeeService;
        }

        [HttpGet("Chatrooms")]
        [ProducesResponseType(typeof(IEnumerable<DTO.ChatroomInstance>), 200)]
        public async Task<IActionResult> Chatrooms(Guid classSessionId)
        {
            var instances = await _SessionGroupService.GetMyChatrooms(classSessionId);

            return Ok(instances);
        }

        [HttpGet("ChatPermissions/{userId}")]
        [ProducesResponseType(typeof(DTO.ChatPermissions), 200)]
        public async Task<IActionResult> ChatPermissions(Guid classSessionId, string userId)
        {
            var chatPermissions = await _SessionAttendeeService.GetChatPermissions(classSessionId, userId);
            return Ok(chatPermissions);
        }

        [HttpGet("GroupInstance/{groupId}")]
        [ProducesResponseType(typeof(DTO.ChatroomInstance), 200)]
        public async Task<IActionResult> GroupInstance(Guid classSessionId, Guid groupId)
        {
            var groupInstance = await _SessionGroupService.GetGroupChatroom(classSessionId, groupId);
            return Ok(groupInstance);
        }
    }
}