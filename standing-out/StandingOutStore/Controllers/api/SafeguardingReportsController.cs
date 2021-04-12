
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOut.Data.Enums;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;
using System;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers.api
{
    [Produces("application/json")]
    [Route("api/SafeguardingReports")]
    public class SafeguardingReportsController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISafeguardingReportService _SafeguardingReportService;
        private readonly ICompanyService companyService;

        public SafeguardingReportsController(UserManager<Models.User> userManager, ISafeguardingReportService safeguardingReportService,
            IOptions<AppSettings> appSettings, ICompanyService companyService)
            : base(userManager, appSettings, companyService)
        {
            _UserManager = userManager;
            _SafeguardingReportService = safeguardingReportService;
            this.companyService = companyService;
        }

        [Authorize]
        [HttpPost("")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Create([FromBody] DTO.SafeguardReport model)
        {
            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor") || User.IsInRole("Admin") || User.IsInRole("Super Admin"))
                return Forbid();
            var user = await _UserManager.FindByNameAsync(User.Identity.Name);
            await _SafeguardingReportService.Create(new Models.SafeguardReport()
            {
                ClassSessionId = model.ClassSessionId,
                UserId = user.Id,
                Status = SafeguardReportStatus.Awaiting,
                LogDate = DateTime.UtcNow,
                Title = model.Title,
                Description = model.Description
            }, user);
            return Ok();
        }

        [Authorize(Roles = "Admin, Super Admin")]
        [HttpPost("Paged")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.SafeguardReportIndex>), 200)]
        public async Task<IActionResult> PagedStudents([FromBody] DTO.SearchModel model)
        {
            DTO.PagedList<DTO.SafeguardReportIndex> reports;
            if (User.IsInRole("Admin"))
            {
                reports = await _SafeguardingReportService.GetPaged(model, Caller.CurrentUserCompany);
            }
            else
            {
                reports = await _SafeguardingReportService.GetPaged(model);
            }
            return Ok(reports);
        }
    }
}