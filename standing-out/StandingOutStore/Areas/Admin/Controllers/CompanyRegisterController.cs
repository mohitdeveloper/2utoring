using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using Models = StandingOut.Data.Models;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CompanyRegisterController : NewBaseController
    {
        private readonly IStripePlanService _StripePlanService;
        private readonly ICompanyService companyService;
        private readonly AppSettings _AppSettings;

        public CompanyRegisterController(IStripePlanService stripePlanService,
            UserManager<Models.User> userManager,
            IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings)
        {
            _StripePlanService = stripePlanService;
            this.companyService = companyService;
            _AppSettings = appSettings.Value;
        }

        //[Route("company/plans")]
        //[Route("company-plans")]
        public async Task<IActionResult> Index()
        {
            var stripePlans = await _StripePlanService.Get();
            ViewBag.MainSiteUrl = _AppSettings.MainSiteUrl;
            ViewBag.IdentitySiteUrl = _AppSettings.IdentitySiteUrl;
            return View(stripePlans);
        }

        /// <summary>
        /// Has to pass in a company plan type
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize]
        [Route("company/register/process/{id}")]
        public async Task<IActionResult> Process(Guid id)
        {
            var company = await companyService.GetByAdminUser(Caller.CurrentUser);

            // Already registered with this UserId.
            if (Caller.IsTutor || Caller.IsSuperAdmin ||
                (company != null && company.InitialRegistrationComplete))
            {
                return Redirect("/dashboard"); // Company dshboard
            };

            // Check valid stripe plan
            var stripePlan = await _StripePlanService.GetById(id);
            if (stripePlan == null || 
                stripePlan.StripePlanType != StandingOut.Data.Enums.StripePlanType.Company ||
                stripePlan.Subscription == null)
            {
                return Redirect("/Account/Forbidden#InvalidSubscriptionId");
            };

            ViewBag.StripePlanId = id;
            return View();
        }
    }
}
