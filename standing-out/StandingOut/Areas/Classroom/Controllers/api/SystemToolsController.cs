using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DTO = StandingOut.Data.DTO;
using StandingOut.Extensions;
using System.Threading.Tasks;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Shared.Mapping;
using Models = StandingOut.Data.Models;
using System;

namespace StandingOut.Classroom.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/classroom/SystemTools")]
    public class SystemToolsController : BaseController
    {
        private readonly ISystemToolService _SystemToolService;

        public SystemToolsController(ISystemToolService systemToolService)
        {
            _SystemToolService = systemToolService;
        }

        [HttpGet("{classSessionId}")]
        [ProducesResponseType(typeof(List<DTO.SystemTool>), 200)]
        public async Task<IActionResult> Get(Guid classSessionId)
        {
            var models = await _SystemToolService.Get(classSessionId);
            return Ok(Mappings.Mapper.Map <List<Models.SystemTool>, List<DTO.SystemTool>>(models));
        }
    }
}
