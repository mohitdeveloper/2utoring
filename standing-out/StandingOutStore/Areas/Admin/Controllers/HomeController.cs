using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Data.Migrations;
using StandingOut.Shared.Excel;
using StandingOut.Shared.Helpers.AzureFileHelper;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using StandingOutStore.Extensions;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data;
using Microsoft.Extensions.Options;
using StandingOut.Data.Enums;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize]
    [CompanyBaseAuth]
    [ValidatePlan]
    public class HomeController : NewBaseController
    {
        private readonly IDashboardService _DashboardService;
        private readonly ICompanyService companyService;
        private readonly IAzureFileHelper azureFileHelper;
        private readonly UserManager<StandingOut.Data.Models.User> userManager;
        private readonly IOptions<AppSettings> appSettings;

        public HomeController(IDashboardService dashboardService, ICompanyService companyService,
            IAzureFileHelper azureFileHelper, UserManager<StandingOut.Data.Models.User> userManager,
            IOptions<AppSettings> appSettings) :
            base(userManager, appSettings)
        {
            _DashboardService = dashboardService;
            this.companyService = companyService;
            this.azureFileHelper = azureFileHelper;
            this.userManager = userManager;
            this.appSettings = appSettings;
        }
       
        public async Task<IActionResult> Index()  // Link = /Admin
        {
            if (Caller.IsAdmin)
            {
                return await Dashboard();
            }
            return View(); // Superadmin Management dashboard.
            // Temporary redirect here as nothing on the dashboard
            //return RedirectToRoute("areaRoute", new { area = "Admin", controller = "Students", action = "Index" });
        }

        [Route("Dashboard")] // Company dashboard (landing page after Registration)
        public async Task<IActionResult> Dashboard()  // Link = /Admin
        {
            if (Caller.IsAdmin)
            {
                var company = await companyService.GetByAdminUser(await GetCurrentUser());
                return View("../Company/Dashboard", company); // Company dashboard
            }
            return await Index();
        }
        [Route("Profile")] // Company dashboard (landing page after Registration)
        public async Task<IActionResult> CompanyProfile()  // Link = /Admin
        {
            if (Caller.IsAdmin)
            {
                var company = await companyService.GetByAdminUser(await GetCurrentUser());
                return View("../Company/CompanyProfile", company); // Company dashboard
            }
            return await Index();
        }

        [Route("Company/Details/{id}")] // Admin company details link (also in admin notification of registration email)
        public async Task<IActionResult> CompanyDetails(Guid id)
        {
            var company = await companyService.GetById(id); // Public profile no auth chk
            return View("CompanyProfile", company);
        }

        [Route("Company/Profile/Edit")] // Admin company details link (also in admin notification of registration email)
        public async Task<IActionResult> Edit()
        {

            if (Caller.IsAdmin)
            {
                var company = await companyService.GetByAdminUser(await GetCurrentUser());
                var id = company.CompanyId;
                return View("Edit", company);
            }
            return await Index();


        }

        [AllowAnonymous]
        public async Task<IActionResult> Middleware(int redirect)
        {
            //if (redirect == 1)
            //{
            return RedirectToAction("Index");
            //} else
            //{
            //    return RedirectToAction("Create", "ClassSessions", new { area = "Tutor" });
            //}
        }

        public async Task<IActionResult> ExportClassSessions()
        {
            DTO.SearchModel model = new DTO.SearchModel()
            {
                Page = 1,
                Take = int.MaxValue,
                SortType = ""
            };
            model.StartDate = Convert.ToDateTime(Request.Form["StartDate"]);
            model.EndDate = Convert.ToDateTime(Request.Form["EndDate"]);


            using (var excel = new ExcelGeneration())
            {
                var data = await _DashboardService.GetSessions(model);
                var str = excel.GenerateClassSessionExport(data.Data);
                return File(str, "application/vnd.ms-excel", "SessionExport" + DateTime.Now.ToString("yyyyMMdd") + ".xlsx");
            }
        }

        [AllowAnonymous]
        [Route("Company/Home/DownloadCompanyProfileImage/{id}")]
        public async Task<IActionResult> DownloadCompanyProfileImage(Guid id)
        {
            var company = await companyService.GetById(id);
            var stream = await azureFileHelper.DownloadBlob(company.ProfileImageFileLocation, "companyprofileimages");
            return File(stream, "image/jpeg", company.ProfileImageFileName);
        }

        [Route("company-id-verification")]
        public async Task<IActionResult> GetPayoutStatus()
        {
            if (Caller.IsAdmin)
            {
                var company = await companyService.GetByAdminUser(await GetCurrentUser());
                if (company.StripeConnectAccountId!=null && company.IDVerificationtStatus == TutorApprovalStatus.Pending && company.InitialRegistrationComplete)
                {
                    return Ok(true);
                }
                return Ok(false);
            }
            return Ok(false);
        }

    }
}