using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutStore.Extensions;
using System.Threading.Tasks;
using StandingOut.Business.Services.Interfaces;
using DTO = StandingOut.Data.DTO;
using ISessionAttendeeService = StandingOutStore.Business.Services.Interfaces.ISessionAttendeeService;
using Models = StandingOut.Data.Models;
using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Business.Services;
using StandingOut.Shared;

namespace StandingOutStore.Areas.Tutor.Controllers
{
    [TutorBaseAuth]
    [Area("Tutor")]
    [Authorize]
    [ValidatePlan]
    public class StudentsController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly ITutorSubscriptionFeatureService _TutorSubscriptionFeatureService;
        private readonly ICompanySubscriptionFeatureService companySubscriptionFeatureService;
        private readonly ICompanyService companyService;
        private readonly Business.Services.Interfaces.ITutorService tutorService;
        private readonly AppSettings _AppSettings;

        public StudentsController(UserManager<Models.User> userManager, ISessionAttendeeService sessionAttendeeService,
            IOptions<AppSettings> appSettings,
            ITutorSubscriptionFeatureService tutorSubscriptionFeatureService,
            ICompanySubscriptionFeatureService companySubscriptionFeatureService,
            ICompanyService companyService, 
            Business.Services.Interfaces.ITutorService tutorService)
            : base(userManager, appSettings, companyService)
        {
            _UserManager = userManager;
            _SessionAttendeeService = sessionAttendeeService;
            _TutorSubscriptionFeatureService = tutorSubscriptionFeatureService;
            this.companySubscriptionFeatureService = companySubscriptionFeatureService;
            this.companyService = companyService;
            this.tutorService = tutorService;
            _AppSettings = appSettings.Value;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> View(string id)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            DTO.ViewStudent viewStudent = new DTO.ViewStudent()
            {
                Student = await _UserManager.FindByIdAsync(id),
                StudentSessions = await _SessionAttendeeService.GetStudentSessions(id, user.Id)
            };

            ViewBag.Area = "Tutor";
            ViewBag.ClassRoomSiteUrl = _AppSettings.ClassRoomSiteUrl;

            var tutorId = user?.TutorId; // VS2019 is so stupid..
            if (tutorId.HasValue)
            {
                SubscriptionFeatureSet subscriptionFeatureSet;
                var tutor = await tutorService.GetById(tutorId.Value);
                var companyTutor = await tutorService.GetCurrentCompanyTutor(tutor?.TutorId);
                if (Caller.IsTutor && companyTutor != null)
                    subscriptionFeatureSet = await companySubscriptionFeatureService.GetSubscriptionFeatureSetByCompanyId(companyTutor.CompanyId);
                else
                    subscriptionFeatureSet = await _TutorSubscriptionFeatureService.GetSubscriptionFeatureSetByTutorId(tutorId.Value);
                ViewBag.SubscriptionFeatureSet = subscriptionFeatureSet;
            }

            return View("SharedStudentView", viewStudent);
        }
    }
}