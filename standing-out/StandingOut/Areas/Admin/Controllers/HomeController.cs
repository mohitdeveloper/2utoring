using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;

namespace StandingOut.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    public class HomeController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;

        public HomeController(UserManager<Models.User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
        }


        public async Task<IActionResult> Index()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }
    }

}