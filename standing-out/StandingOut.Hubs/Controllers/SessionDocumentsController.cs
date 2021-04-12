using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Hubs.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace StandingOut.Hubs.Controllers
{
    [Produces("application/json")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/classroom/{classSessionId}/SessionDocuments")]
    public class SessionDocumentsController : BaseController
    {
        // USE THIS CONTROLLER WHEN BOTH A RESPONSE AND HUB ARE REQUIRED
        // IF YOU DO NOT NEED TO USE A HUB -> USE THE API CONTROLLER IN THE CLASSROOM PROJECT
        // I MEAN IT

        // WHEN ADDING EXTRA SERVICES -> ENSURE THE STARTUP HAS THE DI SET UP FOR IT
        private readonly UserManager<Models.User> _UserManager;
        private readonly IHubContext<TutorCommandHub> _TutorCommandHub;
        private readonly ISessionDocumentService _SessionDocumentService;

        public SessionDocumentsController(UserManager<Models.User> userManager, IHubContext<TutorCommandHub> tutorCommandHub, 
            ISessionDocumentService sessionDocumentService)
        {
            _UserManager = userManager;
            _TutorCommandHub = tutorCommandHub;
            _SessionDocumentService = sessionDocumentService;
        }

        // This updates the permissions of an uploaded item - Informs the user this has happened
        [HttpPost("updatePermissions")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> UpdatePermissions(Guid classSessionId, [FromBody]DTO.SessionAttendeeFileUploaderComplete model)
        {
            // Check for files
            if (model.FileIds.Count == 0 || model.SessionAttendees.Count == 0)
                return BadRequest();

            // Update permissions
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            await _SessionDocumentService.UpdatePermissions(classSessionId, user, model.FileIds, model.SessionAttendees);
            // Inform other users
            await _TutorCommandHub.Clients.Group(classSessionId.ToString()).SendAsync("filePermissionsChange", model.FileIds);
            // Inform this user
            return Ok();
        }
    }
}
