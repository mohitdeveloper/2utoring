using StandingOut.Business.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;

namespace StandingOut.ViewComponents
{
    public class MyProfileHeaderViewComponent : ViewComponent
    {
        private readonly IUserService _UserService;

        public MyProfileHeaderViewComponent(IUserService userService)
        {
            _UserService = userService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            if (User.Identity.Name != null)
            {
                var user = Mappings.Mapper.Map<Models.User, DTO.UserProfileComponent>(await _UserService.GetByEmail(User.Identity.Name));
                ViewBag.UserProfileLoggedIn = true;
                ViewBag.UserProfileFullName = user.FullName;
                ViewBag.UserProfileImageUrl = User.IsInRole("Tutor") && !string.IsNullOrEmpty(user.ImageDownlaodUrl) ? user.ImageDownlaodUrl : user.GoogleProfilePicture;
                return View();
            }
            else
            {
                ViewBag.UserProfileLoggedIn = false;
                ViewBag.UserProfileFullName = null;
                ViewBag.UserProfileImageUrl = null;
                return View();
            }
        }
    }
}