using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Data.Enums;
using Models = StandingOut.Data.Models;

namespace StandingOut.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    public class SafeguardingController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;
       private readonly ISafeguardReportService _SafeguardReportService;
        private readonly ISettingService _SettingService;

        public SafeguardingController(UserManager<Models.User> userManager, RoleManager<IdentityRole> roleManager, ISafeguardReportService safeguardReportService, ISettingService settingService)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
            _SafeguardReportService = safeguardReportService;
            _SettingService = settingService;
        }


        public async Task<IActionResult> Index()
        {
            return RedirectPermanent("https://www.2utoring.com");
            var data = await _SafeguardReportService.Get();
            return View(data);
        }

        public async Task<IActionResult> View(Guid id)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var data = await _SafeguardReportService.GetById(id);
            return View(data);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateNotes(Models.SafeguardReport model)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var data = await _SafeguardReportService.GetById(model.SafeguardReportId);
            data.Notes = model.Notes;
            await _SafeguardReportService.Update(data);
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> UpdateStatus(Guid id, SafeguardReportStatus status)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var data = await _SafeguardReportService.GetById(id);
            data.Status = status;
            await _SafeguardReportService.Update(data);

            return RedirectToAction("View", new { id = id });
        }

        public async Task<IActionResult> AlertEmails()
        {
            return RedirectPermanent("https://www.2utoring.com");
            var data = await _SettingService.Get();
            return View(data);
        }

        [HttpPost]
        public async Task<IActionResult> AlertEmails(Models.Setting model)
        {
            return RedirectPermanent("https://www.2utoring.com");
            if (!string.IsNullOrEmpty(model.SafeguardReportAlertEmail))
            {
                var data = await _SettingService.UpdateSafeguardAlertEmail(model);
                return RedirectToAction("Index");
            }

            ModelState.AddModelError("SafeguardReportAlertEmail", "This field is required");
            return View(model);
        }
    }

}