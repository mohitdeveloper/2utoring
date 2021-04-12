using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DTO = StandingOut.Data.DTO;
using StandingOut.Extensions;
using System.Threading.Tasks;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Shared.Mapping;
using Models = StandingOut.Data.Models;
using Microsoft.AspNetCore.Identity;

namespace StandingOut.Classroom.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/classroom/{classSessionId}/sessionAttendees")]
    public class SessionAttendeesController : BaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISettingService _SettingService;
        private readonly IUserService _UserService;
        private readonly ISessionAttendeeService _SessionAttendeeService;

        public SessionAttendeesController(UserManager<Models.User> userManager, ISettingService settingService, IUserService userService, ISessionAttendeeService sessionAttendeeService)
        {
            _UserManager = userManager;
            _SettingService = settingService;
            _SessionAttendeeService = sessionAttendeeService;
            _UserService = userService;
        }

        [HttpGet("My")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> GetMy(Guid classSessionId)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var model = await _SessionAttendeeService.GetMyByClassSessionId(user.Id, classSessionId);
            return Ok(Mappings.Mapper.Map<Models.SessionAttendee, DTO.SessionAttendee>(model));
        }  
    }
}
