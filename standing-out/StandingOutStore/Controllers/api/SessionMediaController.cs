using System;
using System.Collections.Generic;
using StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using System.Threading.Tasks;

namespace StandingOutStore.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/SessionMedias")]
    public class SessionMediasController : Controller
    {
        private readonly ISessionMediaService _SessionMediaService;

        public SessionMediasController(ISessionMediaService sessionMediaService)
        {
            _SessionMediaService = sessionMediaService;
        }
        
        [HttpGet("getByClassSession/{id}")]
        [ProducesResponseType(typeof(IEnumerable<DTO.SessionMedia>), 200)]
        public async Task<IActionResult> GetByClassSession(Guid id)
        {
            var sessionMedias = await _SessionMediaService.GetByClassSession(id);
            return Ok(Mappings.Mapper.Map<List<Models.SessionMedia>, List<DTO.SessionMedia>>(sessionMedias));
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.SessionMedia), 200)]
        public async Task<IActionResult> Post([FromBody]DTO.SessionMedia sessionMedia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _SessionMediaService.Create(Mappings.Mapper.Map<DTO.SessionMedia, Models.SessionMedia>(sessionMedia));
            return Ok(Mappings.Mapper.Map<Models.SessionMedia, DTO.SessionMedia>(model));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _SessionMediaService.Delete(id);
            return Ok();
        }
    }
}
