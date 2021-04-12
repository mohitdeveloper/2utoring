using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOut.Controllers
{
    [Authorize(Roles = "Tutor")]
    public class SetupController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IClassSessionService _ClassSessionService;

        public SetupController(UserManager<Models.User> userManager, IClassSessionService classSessionService)
        {
            _UserManager = userManager;
            _ClassSessionService = classSessionService;
        }

        public async Task<IActionResult> Index(Guid classSessionId)
        {
            //return RedirectPermanent("https://www.2utoring.com");
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var classSession = await _ClassSessionService.GetById(classSessionId);

            if(classSession != null && classSession.OwnerId != user.Id)
            {
                return RedirectToRoute("default", new { controller = "Home", action = "Index" });
            }

            var accessToken = await HttpContext.GetTokenAsync("access_token");
            ViewBag.AccessToken = accessToken;

            return View(classSession);
        }
    }
}
