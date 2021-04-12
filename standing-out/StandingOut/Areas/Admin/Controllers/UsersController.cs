using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Mapping;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOut.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    public class UsersController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;

        public UsersController(UserManager<Models.User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
        }


        public async Task<IActionResult> Index()
        {
            return RedirectPermanent("https://www.2utoring.com");
            var adminUsers = await _UserManager.GetUsersInRoleAsync("Admin");
            return View(adminUsers);
        }


        public async Task<IActionResult> Create()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(DTO.CreateUser model)
        {
            return RedirectPermanent("https://www.2utoring.com");
            if (ModelState.IsValid)
            {
                var user = new Models.User { UserName = model.Email, Email = model.Email, FirstName = model.FirstName, LastName = model.LastName };
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
            return RedirectPermanent("https://www.2utoring.com");
            var user = await _UserManager.FindByIdAsync(id);
            var data = Mappings.Mapper.Map<Models.User, DTO.EditUser>(user);
            return View(data);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(DTO.EditUser model)
        {
            return RedirectPermanent("https://www.2utoring.com");
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
            return RedirectPermanent("https://www.2utoring.com");
            var user = await _UserManager.FindByIdAsync(id);
            return View(user);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> ConfirmDelete(string id)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var user = await _UserManager.FindByIdAsync(id);
            await _UserManager.DeleteAsync(user);
            return RedirectToAction("Index");
        }

    }

}