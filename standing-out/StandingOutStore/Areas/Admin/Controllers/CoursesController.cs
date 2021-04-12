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
    [ValidatePlan]
    public class CoursesController : NewBaseController
    {
        private readonly IStripePlanService _StripePlanService;
        private readonly ICompanyService companyService;
        private readonly AppSettings _AppSettings;
        public CoursesController(IStripePlanService stripePlanService, UserManager<Models.User> userManager, IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings)
        {
            _StripePlanService = stripePlanService;
            this.companyService = companyService;
            _AppSettings = appSettings.Value;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Route("admin/courses/manage-course")]
        public IActionResult ManageCourse()
        {
            return View();
        }

    }
}
