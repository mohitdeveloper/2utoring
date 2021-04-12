using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers
{
    public class CourseController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ICourseService _CourseService;
        private readonly IUserService _UserService;
        public CourseController(UserManager<Models.User> userManager, ICourseService courseService, IUserService userService)
        {
            _UserManager = userManager;
            _CourseService = courseService;
            _UserService = userService;
        }

        // Route is course/{id}
        [HttpGet]
        public async Task<IActionResult> View(Guid id)
        {
            var FutureLessions = await _CourseService.GetFutureLessons(id);
            if (FutureLessions.Count == 0)
            {
                return NotFound();
            }
            var course = await _CourseService.GetById(id);
            ViewData["Title"] = course.Name.Length <= 60 ? course.Name : Utilities.StringUtilities.GetTextOfLength(course.Name, 60);
            ViewBag.Description = $"Sign up to {course.Name} with {course.Tutor.Users.FirstOrDefault().FirstName} {course.Tutor.Users.FirstOrDefault().LastName} here.";
            ViewBag.CourseId = id;
            ViewBag.CanUserBuy = !(User.Identity.IsAuthenticated && (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor") || User.IsInRole("Admin")));
            ViewBag.IsLoggedIn = User.Identity.IsAuthenticated;
            if (User.Identity.IsAuthenticated)
            {
                var user = await _UserManager.FindByNameAsync(User.Identity.Name);
                ViewBag.IsGuardian = user.IsParent;
            }
            else
                ViewBag.IsGuardian = false;
            return View("courseDetail");
        }

        // Route is course-student-enroll/{id}
        [Authorize]
        public async Task<IActionResult> StudentEnroll(Guid id, bool? cameFromLinkAccount)
        {
            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor") || User.IsInRole("Admin"))
                return RedirectToRoute("courseView", new { id = id });
            var FutureLessions = await _CourseService.GetFutureLessons(id);
            if (FutureLessions.Count == 0)
            {
                return NotFound();
            }
            ViewBag.CourseId = id;
            ViewBag.CameFromLinkAccount = cameFromLinkAccount;
            return View();
        }

        // Route is course-guardian-enroll/{id}
        [Authorize]
        public async Task<IActionResult> GuardianEnroll(Guid id, bool? cameFromLinkAccount)
        {
            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor") || User.IsInRole("Admin"))
                return RedirectToRoute("courseView", new { id = id });
            var FutureLessions = await _CourseService.GetFutureLessons(id);
            if (FutureLessions.Count == 0)
            {
                return NotFound();
            }
            ViewBag.CourseId = id;
            ViewBag.CameFromLinkAccount = cameFromLinkAccount;
            return View();
        }

        // Route is course-sign-in/{id}
        [Authorize]
        public async Task<IActionResult> CourseSignIn(Guid id,string type, bool? cameFromLinkAccount)
        {

            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor") || User.IsInRole("Admin"))
                return RedirectToRoute("courseView", new { id = id });
            var FutureLessions = await _CourseService.GetFutureLessons(id);
            if (FutureLessions.Count == 0)
            {
                return NotFound();
            }

            ViewBag.CourseId = id;
            ViewBag.CameFromLinkAccount = cameFromLinkAccount;
            if(!type.Contains("MyCourse"))
            { var usr = await _UserService.GetByEmail(User.Identity.Name);
                if(usr!=null && usr.IsParent)
                {
                    return RedirectToRoute("GuardianEnroll", new { id = id });
                }
                else
                {
                    return RedirectToRoute("StudentEnroll", new { id = id });
                }
            }
           
            
            //return View();
            return RedirectToRoute("MyCourse");
            
        }

        public async Task<IActionResult> ParentStudentCouse()
        {
            return View();
        }


        public async Task<IActionResult> CourseDetail()
        {
            ViewBag.CourseId = null;
            return View();
        }
    }
}
