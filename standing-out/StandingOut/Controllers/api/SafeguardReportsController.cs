using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Extensions;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data.Enums;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StandingOut.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/safeguardReports")]
    public class SafeguardReportsController : BaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISafeguardReportService _SafeguardReportService;

        public SafeguardReportsController(UserManager<Models.User> userManager, ISafeguardReportService safeguardReportService)
        {
            _UserManager = userManager;
            _SafeguardReportService = safeguardReportService;
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpGet("")]
        [ProducesResponseType(typeof(IEnumerable<DTO.SafeguardReport>), 200)]
        public async Task<IActionResult> Get()
        {
            var sessionGroups = await _SafeguardReportService.Get();
            return Ok(Mappings.Mapper.Map<List<Models.SafeguardReport>, List<DTO.SafeguardReport>>(sessionGroups));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.SafeguardReport), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var model = await _SafeguardReportService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.SafeguardReport, DTO.SafeguardReport>(model));
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.SafeguardReport), 200)]
        public async Task<IActionResult> Post([FromBody]DTO.SafeguardReport safeguardReport)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);

            safeguardReport.UserId = user.Id;
            safeguardReport.LogDate = DateTime.Now;
            safeguardReport.Status = SafeguardReportStatus.Awaiting;
            var model = Mappings.Mapper.Map<DTO.SafeguardReport, Models.SafeguardReport>(safeguardReport);
            model.User = user;
            await _SafeguardReportService.Create(model);
            return Ok(Mappings.Mapper.Map<Models.SafeguardReport, DTO.SafeguardReport>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DTO.SafeguardReport), 200)]
        public async Task<IActionResult> Put(Guid id, [FromBody]DTO.SafeguardReport safeguardReport)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != safeguardReport.SafeguardReportId)
            {
                return BadRequest();
            }

            var model = await _SafeguardReportService.Update(Mappings.Mapper.Map<DTO.SafeguardReport, Models.SafeguardReport>(safeguardReport));
            return Ok(Mappings.Mapper.Map<Models.SafeguardReport, DTO.SafeguardReport>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _SafeguardReportService.Delete(id);
            return Ok();
        }
    }
}
