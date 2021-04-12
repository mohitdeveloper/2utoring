
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
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
    [Route("api/{classSessionId}/SessionGroups")]
    public class SessionGroupsController : Controller
    {
        private readonly ISessionGroupService _SessionGroupService;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly IClassSessionService _ClassSessionService;
        private readonly UserManager<Models.User> _UserManager;

        public SessionGroupsController(ISessionGroupService sessionGroupService, ISessionAttendeeService sessionAttendeeService,
            UserManager<Models.User> userManager, IClassSessionService classSessionService)
        {
            _SessionGroupService = sessionGroupService;
            _SessionAttendeeService = sessionAttendeeService;
            _UserManager = userManager;
            _ClassSessionService = classSessionService;
        }


        [HttpGet("TutorCommand")]
        [ProducesResponseType(typeof(DTO.TutorCommandGroups), 200)]
        public async Task<IActionResult> GetTutorCommand(Guid classSessionId)
        {
            var attendees = await _SessionAttendeeService.GetByClassSession(classSessionId);
            var sessionGroups = await _SessionGroupService.Get(classSessionId);
            var groupData = Mappings.Mapper.Map<List<Models.SessionGroup>, List<DTO.SessionGroupDraggable>>(sessionGroups.OrderBy(o => o.Name).ToList());

            var data = new DTO.TutorCommandGroups()
            {
                AllSessionAttendees = Mappings.Mapper.Map<List<Models.SessionAttendee>, List<DTO.SessionAttendee>>(attendees),
                Groups = groupData
            };

            return Ok(data);
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.SessionGroupDraggable), 200)]
        public async Task<IActionResult> Post(Guid classSessionId, [FromBody] DTO.SessionGroupDraggable sessionGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _SessionGroupService.Create(classSessionId, Mappings.Mapper.Map<DTO.SessionGroupDraggable, Models.SessionGroup>(sessionGroup));
            return Ok(Mappings.Mapper.Map<Models.SessionGroup, DTO.SessionGroupDraggable>(model));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DTO.SessionGroupDraggable), 200)]
        public async Task<IActionResult> Put(Guid classSessionId, Guid id, [FromBody] DTO.SessionGroupDraggable sessionGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sessionGroup.SessionGroupId)
            {
                return BadRequest();
            }

            var model = await _SessionGroupService.Update(classSessionId, Mappings.Mapper.Map<DTO.SessionGroupDraggable, Models.SessionGroup>(sessionGroup));
            return Ok(Mappings.Mapper.Map<Models.SessionGroup, DTO.SessionGroupDraggable>(model));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid classSessionId, Guid id)
        {
            await _SessionGroupService.Delete(classSessionId, id);
            return Ok();
        }


        [HttpPut("{id}/Users")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> RemoveUsers(Guid classSessionId, Guid id, [FromBody] DTO.StoreGroupManagement model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.GroupId)
            {
                return BadRequest();
            }

            await _SessionGroupService.RemoveAttendees(classSessionId, model.UserIds);
            return Ok();
        }

        [HttpPatch("{id}/Users")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> MoveAttendees(Guid classSessionId, Guid id, [FromBody] DTO.StoreGroupManagement model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.GroupId)
            {
                return BadRequest();
            }

            await _SessionGroupService.MoveAttendees(classSessionId, id, model.UserIds);
            return Ok();
        }

    }
}