using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Helpers.AzureFileHelper;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;
using System;
using System.Threading.Tasks;
using StandingOut.Data.Models;
using StandingOut.Data.Enums;



namespace StandingOutStore.Areas.Tutor.Controllers
{
    [TutorBaseAuth]
    [Area("Tutor")]
    [Authorize]
    [ValidatePlan]

    public class HomeController : Controller
    {
        private readonly ITutorService _TutorService;
        private readonly IAzureFileHelper _AzureFileHelper;
        private readonly UserManager<User> _UserManager;

        public HomeController(ITutorService tutorService, IAzureFileHelper azureFileHelper, UserManager<User> userManager)
        {
            _TutorService = tutorService;
            _AzureFileHelper = azureFileHelper;
            _UserManager = userManager;
        }

        [AllowAnonymous]
        public async Task<IActionResult> Middleware(int redirect)
        {
            //await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (redirect == 1)
            {
                return RedirectToAction("Index");
            } else
            {
                //return RedirectToAction("Create", "ClassSessions", new { area = "Tutor" });
                return RedirectToAction("Index", "Courses", new { area = "Tutor" });
            }
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Tutor Dash";
            return View();
        }

        [AllowAnonymous]
        public async Task<IActionResult> DownloadTutorProfileImage(Guid id)
        {
            var tutor = await _TutorService.GetById(id);
            var stream = await _AzureFileHelper.DownloadBlob(tutor.ProfileImageFileLocation, "tutorprofileimages");
            return File(stream, "image/jpeg", tutor.ProfileImageFileName);
        }
        [Route("tutor-id-verification")]
        public async Task<IActionResult> GetPayoutStatus()
        {
            if(User.Identity.IsAuthenticated)
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                var currentCompany = await _TutorService.GetCurrentCompany(user);
                if (currentCompany == null)
                {
                    var tutor = await _TutorService.GetById(Guid.Parse(user.TutorId.ToString()));
                    if (tutor != null && tutor.StripeConnectAccountId!=null && tutor.IDVerificationtStatus == TutorApprovalStatus.Pending && tutor.InitialRegistrationComplete)
                    {
                        return Ok(true);
                    }
                }
                return Ok(false);
            }
            return Ok(false);
        }
    }

}