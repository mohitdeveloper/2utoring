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

namespace StandingOutStore.Areas.Tutor.Controllers
{
    [Area("Tutor")]
    [ValidatePlan]

    public class CoursesController : NewBaseController
    {
        private readonly ICourseService _courseService;
        private readonly IStripePlanService _StripePlanService;
        private readonly ICompanyService companyService;
        private readonly AppSettings _AppSettings;
        public CoursesController(ICourseService courseService, IStripePlanService stripePlanService, UserManager<Models.User> userManager, IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings)
        {
            _courseService = courseService;
            _StripePlanService = stripePlanService;
            this.companyService = companyService;
            _AppSettings = appSettings.Value;
        }
        
        public IActionResult Index()
        {
            #region Get Course
            //StandingOut.Data.DTO.SearchModel model = new StandingOut.Data.DTO.SearchModel();
            //model.Filter = "upcoming";
            //model.Order = "ASC";
            //model.Page = 1;
            //model.Search = "";
            //model.SortType = "StartDate";
            //model.Take = 10;
            //model.Page = 1;
            //var result = _courseService.GetPaged(model, (Guid)Caller.CurrentUser.TutorId, "Tutor"); 
            #endregion
            return View();
        }
        [Route("tutor/courses/create-course")]
        public IActionResult CreateCourse()
        {
            return View();
        }

        [Route("tutor/courses/edit-course")]
        public IActionResult EditCourse()
        {
            return View();
        }
    }
}
