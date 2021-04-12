using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Extensions;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Identity;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StandingOut.Controllers.api
{
    [Produces("application/json")]
    [Route("api/managementInfos")]
    public class ManagementInfosController : BaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IManagementInfoService _ManagementInfoService;

        public ManagementInfosController(UserManager<Models.User> userManager, IManagementInfoService managementInfoService)
        {
            _UserManager = userManager;
            _ManagementInfoService = managementInfoService;
        }

        [HttpPost("dashboard")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.ClassSessionIndex>), 200)]
        public async Task<IActionResult> UpcomingSessions([FromBody]DTO.SearchModel model)
        {
            return Ok(await _ManagementInfoService.GetDashboard(model));
        }

        [HttpPost("courses")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.ClassSessionIndex>), 200)]
        public async Task<IActionResult> Search([FromBody]DTO.SearchModel model)
        {
            return Ok(await _ManagementInfoService.Courses(model));
        }
    }
}
