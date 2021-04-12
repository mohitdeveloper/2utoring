using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data;
using Microsoft.Extensions.Options;
using StandingOutStore.Extensions;
using System.Collections.Generic;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    [CompanyBaseAuth]
    [ValidatePlan]
    public class StudentsController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly IUserService _UserService;
        private readonly ICompanyService companyService;
        private readonly AppSettings _AppSettings;

        public StudentsController(UserManager<Models.User> userManager, 
            RoleManager<IdentityRole> roleManager, ISessionAttendeeService sessionAttendeeService, IUserService userService, 
            IOptions<AppSettings> appSettings, ICompanyService companyService): base(userManager, appSettings, companyService)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
            _SessionAttendeeService = sessionAttendeeService;
            _UserService = userService;
            this.companyService = companyService;
            _AppSettings = appSettings.Value;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> View(string id)
        {
            List<DTO.StudentSession> studentSessions = null;
            if(Caller.IsSuperAdmin)
                studentSessions = await _SessionAttendeeService.GetStudentSessions(id, null);
            else if (Caller.IsAdmin && Caller?.CurrentUserCompany?.CompanyId != null)
                studentSessions = await _SessionAttendeeService.GetStudentSessions(id, null, Caller.CurrentUserCompany.CompanyId);

            DTO.ViewStudent viewStudent = new DTO.ViewStudent()
            {
                Student = await _UserManager.FindByIdAsync(id),
                StudentSessions = studentSessions
            };

            ViewBag.Area = "Admin";
            ViewBag.ClassRoomSiteUrl = _AppSettings.ClassRoomSiteUrl;

            return View("SharedStudentView", viewStudent);
        }
    }
}
