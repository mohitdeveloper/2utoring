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

namespace StandingOut.Classroom.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/classroom/{classSessionId}/SessionMedias")]
    public class SessionMediasController : BaseController
    {
        private readonly ISessionMediaService _SessionMediaService;

        public SessionMediasController(ISessionMediaService sessionMediaService)
        {
            _SessionMediaService = sessionMediaService;
        }
        
        [HttpGet("")]
        [ProducesResponseType(typeof(IEnumerable<DTO.SessionMedia>), 200)]
        public async Task<IActionResult> Get(Guid classSessionId)
        {
            var sessionMedias = await _SessionMediaService.Get(classSessionId);
            return Ok(Mappings.Mapper.Map<List<Models.SessionMedia>, List<DTO.SessionMedia>>(sessionMedias));
        }
    }
}
