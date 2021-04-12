using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;

namespace StandingOut.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    public class ManagementInfoController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;
        private readonly IClassSessionService _ClassSessionService;
        private readonly IManagementInfoService _ManagementInfoService;

        public ManagementInfoController(UserManager<Models.User> userManager, RoleManager<IdentityRole> roleManager, IClassSessionService classSessionService, IManagementInfoService managementInfoService)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
            _ClassSessionService = classSessionService;
            _ManagementInfoService = managementInfoService;
        }

        public async Task<IActionResult> Index()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

    }
}