using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using Models = StandingOut.Data.Models;
using System;
using StandingOut.Business.Helpers.AcuityScheduling;

namespace StandingOut.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    public class CompanysController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;

        public CompanysController(UserManager<Models.User> userManager, RoleManager<IdentityRole> roleManager, IAcuitySchedulingHelper acuitySchedulingHelper)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
        }


        public async Task<IActionResult> Index()
        {
            return RedirectPermanent("https://www.2utoring.com");
        }


        public async Task<IActionResult> Create()
        {
            return RedirectPermanent("https://www.2utoring.com");
        }

        public async Task<IActionResult> Edit(Guid id)
        {
            return RedirectPermanent("https://www.2utoring.com");
        }

        public async Task<IActionResult> Delete(Guid id)
        {
            return RedirectPermanent("https://www.2utoring.com");
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> ConfirmDelete(Guid id)
        {
            return RedirectPermanent("https://www.2utoring.com");
        }
    }

}