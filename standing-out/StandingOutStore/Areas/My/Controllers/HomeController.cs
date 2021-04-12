using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Areas.My.Controllers
{
    [Area("My")]
    [Authorize]
    public class HomeController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;

        public HomeController(UserManager<Models.User> userManager)
        {
            _UserManager = userManager;
        }

        public async Task<IActionResult> Index()
        {
            if (User.IsInRole("Admin") || await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
                return RedirectToRoute("Default");
            return RedirectToRoutePermanent("MyTimetable");
        }

        // Route is my/timetable
        public async Task<IActionResult> Timetable()
        {
            
            if (User.IsInRole("Admin") || await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
                return RedirectToRoute("Default");
            return View();
        }

        // Route is my/safeguarding
        public async Task<IActionResult> Safeguarding()
        {
            if (User.IsInRole("Admin") || await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
                return RedirectToRoute("Default");
            return View();
        }

        // Route is my/settings
        public async Task<IActionResult> Settings()
        {
            if (User.IsInRole("Admin") || await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
                return RedirectToRoute("Default");
            var user = await _UserManager.FindByNameAsync(User.Identity.Name);
            if (user.IsParent)
                return View("GuardianSettings");
            else
                return View("StudentSettings");
        }

        // Route is my/receipts
        public async Task<IActionResult> Receipts()
        {
            if (User.IsInRole("Admin") || await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
                return RedirectToRoute("Default");
            return View();
        }
    }
}