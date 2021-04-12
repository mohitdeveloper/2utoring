using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers
{
    public class LessonsController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IClassSessionService _ClassSessionService;
        public LessonsController(UserManager<Models.User> userManager, IClassSessionService classSessionService)
        {
            _UserManager = userManager;
            _ClassSessionService = classSessionService;
        }

        // Route is lesson/{id}
        [HttpGet]
        public async Task<IActionResult> View(Guid id)
        {
            var classSession = await _ClassSessionService.GetById(id, "Owner");
            if (classSession == null || classSession.StartDate.UtcDateTime < DateTime.UtcNow.AddHours(1))
                return NotFound();
            ViewData["Title"] = classSession.Name.Length <= 60 ? classSession.Name : Utilities.StringUtilities.GetTextOfLength(classSession.Name, 60);
            ViewBag.Description = $"Sign up to {classSession.Name} with {classSession.Owner.FirstName} {classSession.Owner.LastName} here.";

            ViewBag.ClassSessionId = id;
            ViewBag.CanUserBuy = !(User.Identity.IsAuthenticated && (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor") || User.IsInRole("Admin")));
            ViewBag.IsLoggedIn = User.Identity.IsAuthenticated;
            if (User.Identity.IsAuthenticated)
            {
                var user = await _UserManager.FindByNameAsync(User.Identity.Name);
                ViewBag.IsGuardian = user.IsParent;
            }
            else
                ViewBag.IsGuardian = false;
            return View();
        }

        // Route is student-enroll/{id}
        [Authorize]
        public async Task<IActionResult> StudentEnroll(Guid id, bool? cameFromLinkAccount)
        {
            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor") || User.IsInRole("Admin"))
                return RedirectToRoute("LessonView", new { id = id });
            var classSession = await _ClassSessionService.GetById(id, "");
            if (classSession == null || classSession.StartDate.UtcDateTime < DateTime.UtcNow.AddHours(1))
                return NotFound();
            ViewBag.ClassSessionId = id;
            ViewBag.CameFromLinkAccount = cameFromLinkAccount;
            return View();
        }

        // Route is guardian-enroll/{id}
        [Authorize]
        public async Task<IActionResult> GuardianEnroll(Guid id, bool? cameFromLinkAccount)
        {
            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor") || User.IsInRole("Admin"))
                return RedirectToRoute("LessonView", new { id = id });
            var classSession = await _ClassSessionService.GetById(id, "");
            if (classSession == null || classSession.StartDate.UtcDateTime < DateTime.UtcNow.AddHours(1))
                return NotFound();
            ViewBag.ClassSessionId = id;
            ViewBag.CameFromLinkAccount = cameFromLinkAccount;
            return View();
        }
    }
}
