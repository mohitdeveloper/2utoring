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
using StandingOut.Shared.Mapping;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StandingOut.Controllers.api
{
    [Authorize(Roles = "Tutor")]
    [Produces("application/json")]
    [Route("api/Session/{classSessionId}/SessionGroups")]
    public class SessionGroupsController : BaseController
    {
        private readonly ISessionGroupService _SessionGroupService;
        private readonly ISessionAttendeeService _SessionAttendeeService;

        public SessionGroupsController(ISessionGroupService sessionGroupService, ISessionAttendeeService sessionAttendeeService)
        {
            _SessionGroupService = sessionGroupService;
            _SessionAttendeeService = sessionAttendeeService;
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(IEnumerable<DTO.SessionGroup>), 200)]
        public async Task<IActionResult> Get(Guid classSessionId)
        {
            var sessionGroups = await _SessionGroupService.Get(classSessionId);
            return Ok(Mappings.Mapper.Map<List<Models.SessionGroup>, List<DTO.SessionGroup>>(sessionGroups));
        }

        [HttpGet("Draggable")]
        [ProducesResponseType(typeof(IEnumerable<DTO.SessionGroupDraggable>), 200)]
        public async Task<IActionResult> GetDraggable(Guid classSessionId)
        {
            var sessionGroups = await _SessionGroupService.Get(classSessionId);
            var unassigned = await _SessionAttendeeService.GetUnassigned(classSessionId);
            
            var groupData = Mappings.Mapper.Map<List<Models.SessionGroup>, List<DTO.SessionGroupDraggable>>(sessionGroups.OrderBy(o => o.Name).ToList());

            groupData.Add(new DTO.SessionGroupDraggable()
            {
                Name = "Whole Class",
                SessionAttendees = unassigned != null && unassigned.Count > 0 ? Mappings.Mapper.Map<List<Models.SessionAttendee>, List<DTO.SessionAttendee>>(unassigned) : new List<DTO.SessionAttendee>()
            });

            return Ok(groupData);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.SessionGroup), 200)]
        public async Task<IActionResult> GetById(Guid classSessionId, Guid id)
        {
            var model = await _SessionGroupService.GetById(classSessionId, id);
            return Ok(Mappings.Mapper.Map<Models.SessionGroup, DTO.SessionGroup>(model));
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.SessionGroup), 200)]
        public async Task<IActionResult> Post(Guid classSessionId, [FromBody]DTO.SessionGroup sessionGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _SessionGroupService.Create(classSessionId, Mappings.Mapper.Map<DTO.SessionGroup, Models.SessionGroup>(sessionGroup));
            return Ok(Mappings.Mapper.Map<Models.SessionGroup, DTO.SessionGroup>(model));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DTO.SessionGroup), 200)]
        public async Task<IActionResult> Put(Guid classSessionId, Guid id, [FromBody]DTO.SessionGroup sessionGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sessionGroup.SessionGroupId)
            {
                return BadRequest();
            }

            var model = await _SessionGroupService.Update(classSessionId, Mappings.Mapper.Map<DTO.SessionGroup, Models.SessionGroup>(sessionGroup));
            return Ok(Mappings.Mapper.Map<Models.SessionGroup, DTO.SessionGroup>(model));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid classSessionId, Guid id)
        {
            await _SessionGroupService.Delete(classSessionId, id);
            return Ok();
        }

        [HttpPut("Move/{sessionAttendeeId}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid classSessionId, Guid sessionAttendeeId, Guid? sessionGroupId = null)
        {
            await _SessionGroupService.MoveAttendee(classSessionId, sessionAttendeeId, sessionGroupId);
            return Ok();
        }
    }
}
