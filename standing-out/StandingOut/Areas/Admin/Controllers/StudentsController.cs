using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using StandingOut.Business.Services.Interfaces;

namespace StandingOut.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    public class StudentsController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly IUserService _UserService;

        public StudentsController(UserManager<Models.User> userManager, RoleManager<IdentityRole> roleManager, ISessionAttendeeService sessionAttendeeService, IUserService userService)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
            _SessionAttendeeService = sessionAttendeeService;
            _UserService = userService;
        }

        public async Task<IActionResult> Index()
        {
            return RedirectPermanent("https://www.2utoring.com");
            var students = await _UserService.GetStudents();
            return View(students);
        }

        public async Task<IActionResult> View(string id)
        {
            return RedirectPermanent("https://www.2utoring.com");
            DTO.ViewStudent viewStudent = new DTO.ViewStudent()
            {
                Student = await _UserManager.FindByIdAsync(id),
                StudentSessions = await _SessionAttendeeService.GetStudentSessions(id)
            };

            return View(viewStudent);
        }
    }
}
