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
    [Route("api/SessionInvites")]
    public class SessionInvitesController : Controller
    {
        private readonly ISessionInviteService _SessionInviteService;

        public SessionInvitesController(ISessionInviteService sessionInviteService)
        {
            _SessionInviteService = sessionInviteService;
        }
        
        [HttpGet("getByClassSession/{id}")]
        [ProducesResponseType(typeof(IEnumerable<DTO.SessionInvite>), 200)]
        public async Task<IActionResult> GetByClassSession(Guid id)
        {
            var sessionInvites = await _SessionInviteService.GetByClassSession(id);
            return Ok(Mappings.Mapper.Map<List<Models.SessionInvite>, List<DTO.SessionInvite>>(sessionInvites));
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.SessionInvite), 200)]
        public async Task<IActionResult> Post([FromBody]DTO.SessionInvite sessionInvite)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _SessionInviteService.Create(Mappings.Mapper.Map<DTO.SessionInvite, Models.SessionInvite>(sessionInvite));
            return Ok(Mappings.Mapper.Map<Models.SessionInvite, DTO.SessionInvite>(model));
        }

        [AllowAnonymous]
        [HttpPost("createMultiple")]
        [ProducesResponseType(typeof(IEnumerable<DTO.SessionInvite>), 200)]
        public async Task<IActionResult> Post([FromBody] List<DTO.SessionInvite> sessionInvites)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sessionInviteModels = Mappings.Mapper.Map<List<DTO.SessionInvite>, List<Models.SessionInvite>>(sessionInvites);

            var models = await _SessionInviteService.Create(sessionInviteModels);

            return Ok(Mappings.Mapper.Map<List<Models.SessionInvite>, List<DTO.SessionInvite>>(models));
        }

        [HttpPost("createBulk")]
        [ProducesResponseType(typeof(DTO.SessionInvite), 200)]
        public async Task<IActionResult> CreateBulk([FromBody]DTO.SessionInvite sessionInvite)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _SessionInviteService.CreateBulk(sessionInvite);
            return Ok();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _SessionInviteService.Delete(id);
            return Ok();
        }
    }
}
