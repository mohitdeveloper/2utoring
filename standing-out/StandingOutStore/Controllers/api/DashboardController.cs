using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;

namespace StandingOutStore.Controllers.api
{
    [Authorize(Roles = "Super Admin")]
    [Produces("application/json")]
    [Route("api/Dashboard")]
    public class DashboardController : Controller
    {
        private readonly IDashboardService _DashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _DashboardService = dashboardService;
        }

        [HttpPost("ManagementInfo")]
        public async Task<IActionResult> GetManagementInfo([FromBody]DTO.SearchModel model)
        {
            var data = await _DashboardService.GetManagementInfo(model);
            return Ok(data);
        }

        [HttpPost("Sessions")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.ClassSessionIndex>), 200)]
        public async Task<IActionResult> Sessions([FromBody] DTO.SearchModel model)
        {
            return Ok(await _DashboardService.GetSessions(model));
        }




    }
}