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

namespace StandingOut.Controllers.api
{
    [Authorize(Roles = "Tutor")]
    [Produces("application/json")]
    [Route("api/Session/{classSessionId}/SessionMedias")]
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

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.SessionMedia), 200)]
        public async Task<IActionResult> GetById(Guid classSessionId, Guid id)
        {
            var model = await _SessionMediaService.GetById(classSessionId, id);
            return Ok(Mappings.Mapper.Map<Models.SessionMedia, DTO.SessionMedia>(model));
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.SessionMedia), 200)]
        public async Task<IActionResult> Post(Guid classSessionId, [FromBody]DTO.SessionMedia sessionMedia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _SessionMediaService.Create(classSessionId, Mappings.Mapper.Map<DTO.SessionMedia, Models.SessionMedia>(sessionMedia));
            return Ok(Mappings.Mapper.Map<Models.SessionMedia, DTO.SessionMedia>(model));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DTO.SessionMedia), 200)]
        public async Task<IActionResult> Put(Guid classSessionId, Guid id, [FromBody]DTO.SessionMedia sessionMedia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if(id != sessionMedia.SessionMediaId)
            {
                return BadRequest();
            }

            var model = await _SessionMediaService.Update(classSessionId, Mappings.Mapper.Map<DTO.SessionMedia, Models.SessionMedia>(sessionMedia));
            return Ok(Mappings.Mapper.Map<Models.SessionMedia, DTO.SessionMedia>(model));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid classSessionId, Guid id)
        {
            await _SessionMediaService.Delete(classSessionId, id);
            return Ok();
        }
    }
}
