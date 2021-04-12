using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Extensions;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Identity;
using System;
using StandingOut.Shared.Mapping;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StandingOut.Controllers.api
{
    [Produces("application/json")]
    [Route("api/classSession")]
    public class ClassSessionsController : BaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IClassSessionService _ClassSessionService;

        public ClassSessionsController(UserManager<Models.User> userManager, IClassSessionService classSessionService)
        {
            _UserManager = userManager;
            _ClassSessionService = classSessionService;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.ClassSessionIndex>), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            return Ok(Mappings.Mapper.Map<Models.ClassSession, DTO.ClassSession>(await _ClassSessionService.GetById(id)));
        }

        [HttpPost("upcomingSessions")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.ClassSessionIndex>), 200)]
        public async Task<IActionResult> UpcomingSessions([FromBody]DTO.SearchModel model)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            return Ok(await _ClassSessionService.GetPaged(model, user, user.TutorId.HasValue, false));
        }

        [HttpPost("previousSessions")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.ClassSessionIndex>), 200)]
        public async Task<IActionResult> PreviousSessions([FromBody]DTO.SearchModel model)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            return Ok(await _ClassSessionService.GetPaged(model, user, user.TutorId.HasValue, true));
        }

        [HttpGet("lastMonth")]
        [ProducesResponseType(typeof(List<DTO.ClassSession>), 200)]
        public async Task<IActionResult> GetLastMonth()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            return Ok(await _ClassSessionService.GetLastMonth(user.Id));
        }

        [HttpPost("search")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.ClassSessionIndex>), 200)]
        public async Task<IActionResult> Search([FromBody]DTO.SearchModel model)
        {            
            return Ok(await _ClassSessionService.Search(model));
        }
    }
}
