using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data;
using Microsoft.Extensions.Options;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Shared.Mapping;
using StandingOutStore.Extensions;
using ISessionAttendeeService = StandingOutStore.Business.Services.Interfaces.ISessionAttendeeService;
using IUserService = StandingOutStore.Business.Services.Interfaces.IUserService;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    [ValidatePlan]
    public class AdminsController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly IUserService _UserService;
        private readonly AppSettings _AppSettings;

        public AdminsController(UserManager<Models.User> userManager, 
            RoleManager<IdentityRole> roleManager, ISessionAttendeeService sessionAttendeeService, 
            IUserService userService, IOptions<AppSettings> appSettings)
            : base(userManager, appSettings)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
            _SessionAttendeeService = sessionAttendeeService;
            _UserService = userService;
            _AppSettings = appSettings.Value;
        }

        // LIST of Admins
       
        public async Task<IActionResult> Index()
        {
            if(Caller.IsAdmin)
            {
                ViewData["UserType"] = "Admin";
            }
            if(Caller.IsSuperAdmin)
            {
                ViewData["UserType"] = "Super Admin";
            }
            return View();
        }

        public async Task<IActionResult> View(string id)
        {
            DTO.ViewStudent viewStudent = new DTO.ViewStudent()
            {
                Student = await _UserManager.FindByIdAsync(id),
                StudentSessions = await _SessionAttendeeService.GetStudentSessions(id, null)
            };

            ViewBag.Area = "Admin";
            ViewBag.ClassRoomSiteUrl = _AppSettings.ClassRoomSiteUrl;

            return View("SharedStudentView", viewStudent);
        }

        public async Task<IActionResult> Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(DTO.CreateUser model)
        {
            if (ModelState.IsValid)
            {
                var user = new Models.User { UserName = model.Email, Email = model.Email, FirstName = model.FirstName, LastName = model.LastName, ContactEmail = model.Email };
                var result = await _UserManager.CreateAsync(user);

                if (result.Succeeded)
                {
                    user = await _UserManager.FindByEmailAsync(user.Email);
                    await _UserManager.AddToRoleAsync(user, "Admin");
                    return RedirectToAction("Index");
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
            }

            return View(model);
        }

        public async Task<IActionResult> Edit(string id)
        {
            var user = await _UserManager.FindByIdAsync(id);
            var data = Mappings.Mapper.Map<Models.User, DTO.EditUser>(user);
            return View(data);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(DTO.EditUser model)
        {
            if (ModelState.IsValid)
            {
                var user = await _UserManager.FindByIdAsync(model.Id);

                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Email = model.Email;

                await _UserManager.UpdateAsync(user);
                return RedirectToAction("Index");
            }

            return View(model);
        }

        public async Task<IActionResult> Delete(string id)
        {
            var user = await _UserManager.FindByIdAsync(id);
            return View(user);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> ConfirmDelete(string id)
        {
            var user = await _UserManager.FindByIdAsync(id);
            await _UserManager.RemoveFromRoleAsync(user, "Admin");
            await _UserManager.DeleteAsync(user);
            return RedirectToAction("Index");
        }
    }
}
