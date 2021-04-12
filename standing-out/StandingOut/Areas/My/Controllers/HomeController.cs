using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using Models = StandingOut.Data.Models;

namespace StandingOut.Areas.My.Controllers
{
    [Authorize]
    [Area("My")]
    public class HomeController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly AppSettings _AppSettings;

        public HomeController(UserManager<Models.User> userManager, IOptions<AppSettings> appSettings)
        {
            _UserManager = userManager;
            _AppSettings = appSettings.Value;
        }
        
        public async Task<IActionResult> Index(bool past = false)
        {
            return RedirectPermanent(_AppSettings.StoreSiteUrl+ "/tutor");
            //return RedirectPermanent("https://www.2utoring.com");
            if (User.IsInRole("Super Admin") || User.IsInRole("Admin"))
                return RedirectToRoute("areaRoute", new { area = "Admin", controller = "Home", action = "Index" });

            //var user = await _UserManager.FindByIdAsync(HttpContext.User.Claims.FirstOrDefault(p => p.Type == "sub").Value);
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            ViewBag.IsTutor = user.TutorId.HasValue;
            ViewBag.IsParent = user.IsParent;
            return View();
        }
    }
}
