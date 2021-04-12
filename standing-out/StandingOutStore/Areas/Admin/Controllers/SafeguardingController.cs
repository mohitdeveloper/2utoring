using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data;
using Microsoft.Extensions.Options;
using System;
using StandingOut.Data.Enums;
using StandingOutStore.Extensions;
using StandingOut.Data.Models;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    [CompanyBaseAuth]

    [ValidatePlan]
    public class SafeguardingController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly IUserService _UserService;
        private readonly ICompanyService companyService;
        private readonly AppSettings _AppSettings;
        private readonly ISafeguardingReportService _SafeguardReportService;

        public SafeguardingController(UserManager<Models.User> userManager, RoleManager<IdentityRole> roleManager, ISafeguardingReportService safeguardingReportService,
            IUserService userService, IOptions<AppSettings> appSettings, ICompanyService companyService)
            : base(userManager, appSettings, companyService)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
            _UserService = userService;
            this.companyService = companyService;
            _AppSettings = appSettings.Value;
            _SafeguardReportService = safeguardingReportService;
        }

        
        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> View(Guid id)
        {
            var data = await _SafeguardReportService.GetById(id);
            if (!CanAccessSafeguardingItem(data)) return Forbid();

            return View(data);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateNotes(Models.SafeguardReport model)
        {
            var data = await _SafeguardReportService.GetById(model.SafeguardReportId);
            if (!CanAccessSafeguardingItem(data)) return Forbid();

            data.Notes = model.Notes;
            await _SafeguardReportService.Update(data);
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> UpdateStatus(Guid id, SafeguardReportStatus status)
        {
            var data = await _SafeguardReportService.GetById(id);
            if (!CanAccessSafeguardingItem(data)) return Forbid();

            data.Status = status;
            await _SafeguardReportService.Update(data);

            return RedirectToAction("View", new { id = id });
        }

        private bool CanAccessSafeguardingItem(SafeguardReport data)
        {
            return Caller.IsSuperAdmin || (data.ClassSession?.Course?.CompanyId) == (Caller?.CurrentUserCompany?.CompanyId);
        }
    }
}
