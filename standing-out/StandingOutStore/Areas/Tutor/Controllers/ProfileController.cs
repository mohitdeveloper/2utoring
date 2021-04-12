using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Extensions;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Areas.Tutor.Controllers
{
    [TutorBaseAuth]
    [Area("Tutor")]
    [Authorize]
    [ValidatePlan]
    public class ProfileController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        public ProfileController(UserManager<Models.User> userManager)
        {
            _UserManager = userManager;
        }

        public async Task<IActionResult> View()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            ViewBag.TutorId = user.TutorId.Value;
            return View(user);
        }

        public async Task<IActionResult> Edit()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            ViewBag.tutorId = user.TutorId.Value;
            return View(user);
        }
    }
}