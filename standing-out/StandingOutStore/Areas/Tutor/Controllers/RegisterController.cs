using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;
using System;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Areas.Tutor.Controllers
{
    [Area("Tutor")]
    public class RegisterController : NewBaseController
    {

        private readonly IStripePlanService _StripePlanService;
        private readonly ITutorService tutorService;
        private readonly ICompanyService companyService;
        private readonly AppSettings _AppSettings;

        public RegisterController(IStripePlanService stripePlanService, IOptions<AppSettings> appSettings,
            UserManager<Models.User> userManager, ITutorService tutorService,
            ICompanyService companyService) : base(userManager, appSettings)
        {
            _StripePlanService = stripePlanService;
            this.tutorService = tutorService;
            this.companyService = companyService;
            _AppSettings = appSettings.Value;
        }

        public async Task<IActionResult> Index()
        {
            var stripePlans = await _StripePlanService.Get();
            ViewBag.MainSiteUrl = _AppSettings.MainSiteUrl;
            ViewBag.IdentitySiteUrl = _AppSettings.IdentitySiteUrl;
            return View(stripePlans);
        }

        [Authorize]
        public async Task<IActionResult> Process(Guid id)
        {
            Models.Tutor tutor = null;
            if (Caller.IsTutor && Caller.CurrentUser.TutorId.HasValue)
            {
                tutor = await tutorService.GetById(Caller.CurrentUser.TutorId.Value);
            }
            // Already registered with this UserId or Other role not allowed
            if (Caller.IsAdmin || Caller.IsSuperAdmin ||
                (tutor != null && tutor.InitialRegistrationComplete))
            {
                return Redirect("/"); // Tutor dashboard
            };

            // Check valid stripe plan
            var stripePlan = await _StripePlanService.GetById(id);
            if (stripePlan == null ||
                stripePlan.StripePlanType != StandingOut.Data.Enums.StripePlanType.Tutor ||
                stripePlan.Subscription == null)
            {
                //return Redirect("/Account/Forbidden#InvalidSubscriptionId");
                return RedirectToAction("Index"); // Pick a plan
            };


            ViewBag.StripePlanId = id;
            return View();
        }

        [Authorize]
        [Route("tutor/register/companyprocess/{companyId}")]
        public async Task<IActionResult> CompanyProcess(Guid companyId)
        {
            Models.Tutor tutor = null;
            if (Caller.IsTutor)
            {
                tutor = await tutorService.GetById(Caller.CurrentUser.TutorId.Value);
            }
            // Already registered with this UserId or Other role not allowed
            if (Caller.IsAdmin || Caller.IsSuperAdmin ||
                (tutor != null && tutor.InitialRegistrationComplete))
            {
                return Redirect("/"); // Admin/Tutor dashboard
            };

            // Check valid company
            var company = await companyService.GetById(companyId);
            if (company == null)
            {
                return Redirect("/Account/Forbidden#InvalidCompanyInviteLink");
            };


            ViewBag.CompanyId = companyId;
            return View();
        }
    }
}