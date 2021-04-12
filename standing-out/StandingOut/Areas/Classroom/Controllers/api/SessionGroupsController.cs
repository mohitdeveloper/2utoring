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
using System.Linq;
using Microsoft.AspNetCore.Identity;
using ssbsi = StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data.Enums;

namespace StandingOut.Classroom.Controllers.api
{
    [Authorize(Roles = "Tutor")]
    [Produces("application/json")]
    [Route("api/classroom/{classSessionId}/SessionGroups")]
    public class SessionGroupsController : BaseController
    {
        private readonly ISessionGroupService _SessionGroupService;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly ISessionWhiteBoardService _SessionWhiteBoardService;
        private readonly IClassSessionService _ClassSessionService;
        private readonly ssbsi.IClassSessionSubscriptionFeatureService _ClassSessionSubscriptionFeatureService;
        private readonly UserManager<Models.User> _UserManager;

        public SessionGroupsController(ISessionGroupService sessionGroupService, ISessionAttendeeService sessionAttendeeService,
            UserManager<Models.User> userManager, ISessionWhiteBoardService sessionWhiteBoardService, IClassSessionService classSessionService,
            ssbsi.IClassSessionSubscriptionFeatureService classSessionSubscriptionFeatureService)
        {
            _SessionGroupService = sessionGroupService;
            _SessionAttendeeService = sessionAttendeeService;
            _UserManager = userManager;
            _SessionWhiteBoardService = sessionWhiteBoardService;
            _ClassSessionService = classSessionService;
            _ClassSessionSubscriptionFeatureService = classSessionSubscriptionFeatureService;
        }

        [HttpGet("TutorCommand")]
        [ProducesResponseType(typeof(DTO.TutorCommandGroups), 200)]
        public async Task<IActionResult> GetTutorCommand(Guid classSessionId)
        {
            var attendees = await _SessionAttendeeService.GetByClassSession(classSessionId);
            var activeAttendees = attendees.Where(x => !x.IsDeleted && !x.Removed && !x.Refunded).ToList();
            var sessionGroups = await _SessionGroupService.Get(classSessionId);
            var groupData = Mappings.Mapper.Map<List<Models.SessionGroup>, List<DTO.SessionGroupDraggable>>(sessionGroups.OrderBy(o => o.Name).ToList());

            var data = new DTO.TutorCommandGroups()
            {
                AllSessionAttendees = Mappings.Mapper.Map<List<Models.SessionAttendee>, List<DTO.SessionAttendee>>(activeAttendees),
                Groups = groupData
            };

            return Ok(data);
        }

        // This is for adding groups from tutor command 
        // It'll add the other associated resources and return in a format to be distributed
        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.SessionGroupSet), 200)]
        public async Task<IActionResult> AddGroup(Guid classSessionId, [FromBody]Models.SessionGroup model)
        {
            if (!await CanAddGroup(classSessionId)) return BadRequest();
                
            var user = await _UserManager.FindByNameAsync(User.Identity.Name);
            // Create the group
            var sessionGroup = await _SessionGroupService.Create(classSessionId, new Models.SessionGroup()
            {
                Name = model.Name,
                ClassSessionId = classSessionId
            });

            // Create a whiteboard for the group
            await _SessionWhiteBoardService.Create(sessionGroup);

            return Ok(new DTO.SessionGroupSet()
            {
                Chatroom = new DTO.ChatroomInstance()
                {
                    GroupId = sessionGroup.SessionGroupId,
                    Name = sessionGroup.Name,
                    CurrentChatPosition = 0,
                },
                TutorCommandGroup = Mappings.Mapper.Map<Models.SessionGroup, DTO.SessionGroupDraggable>(sessionGroup),
                WebcamRoom = _ClassSessionService.GetWebcamRoom(sessionGroup, new List<Models.SessionAttendee>(), user, false)
            });
        }

        private async Task<bool> CanAddGroup(Guid classSessionId)
        {
            var featureSet = await _ClassSessionSubscriptionFeatureService.GetSubscriptionFeatureSetByClassSessionId(
                classSessionId);

            // Get current Groups count for session and check that against limit.
            var currentNumGroups = await _ClassSessionService.GetNumGroups(classSessionId);

            var maxGroups = featureSet.MaxGroups(FeatureArea.ClassroomTutorCommand, FeatureContext.Groups);

            return currentNumGroups < maxGroups;
        }

    }
}

