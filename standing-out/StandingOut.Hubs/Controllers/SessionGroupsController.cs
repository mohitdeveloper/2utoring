using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Hubs.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace StandingOut.Hubs.Controllers
{
    [Produces("application/json")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/classroom/{classSessionId}/SessionGroups")]
    public class SessionGroupsController : BaseController
    {
        // USE THIS CONTROLLER WHEN BOTH A RESPONSE AND HUB ARE REQUIRED
        // IF YOU DO NOT NEED TO USE A HUB -> USE THE API CONTROLLER IN THE CLASSROOM PROJECT
        // I MEAN IT

        // WHEN ADDING EXTRA SERVICES -> ENSURE THE STARTUP HAS THE DI SET UP FOR IT
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISessionGroupService _SessionGroupService;
        private readonly IHubContext<TutorCommandHub> _TutorCommandHub;
        private readonly ISessionWhiteBoardService _SessionWhiteBoardService;

        public SessionGroupsController(UserManager<Models.User> userManager, ISessionGroupService sessionGroupService,
            IHubContext<TutorCommandHub> tutorCommandHub, ISessionWhiteBoardService sessionWhiteBoardService)
        {
            _UserManager = userManager;
            _SessionGroupService = sessionGroupService;
            _TutorCommandHub = tutorCommandHub;
            _SessionWhiteBoardService = sessionWhiteBoardService;
        }

        // This removes a group and informs all of the users to remove their groups
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> RemoveGroup(Guid classSessionId, Guid id)
        {
            // Sets the group as deleted and associated whiteboard inactive
            await _SessionGroupService.Delete(classSessionId, id);
            await _SessionWhiteBoardService.InactiveByGroup(classSessionId, id);
            // Informs TC/SC hubs to remove anything associated with these groups
            // Elected to use one hub and broadcast out from there to reduce number of calls
            await _TutorCommandHub.Clients.Group(id.ToString()).SendAsync("removeGroup");
            return Ok();
        }
    }
}
