using StandingOut.Business.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;

namespace StandingOut.ViewComponents
{
    public class IntercomViewComponent : ViewComponent
    {
        private readonly IUserService _UserService;
        private readonly string _IntercomAppId = "qoskikpv";

        public IntercomViewComponent(IUserService userService)
        {
            _UserService = userService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            ViewData["IntercomAppId"] = _IntercomAppId;
            if (User.Identity.IsAuthenticated && !string.IsNullOrEmpty(User.Identity.Name))
            {
                var localUser = await _UserService.GetByEmail(User.Identity.Name);
                var user = Mappings.Mapper.Map<Models.User, DTO.Intercom.IntercomUser>(localUser);
                ViewData["IntercomName"] = user.Name;
                ViewData["IntercomEmail"] = user.Email;
                ViewData["IntercomCreatedAt"] = user.CreatedAt;
                ViewData["UserId"] = localUser.Id;
                ViewData["isTutor"] = localUser.TutorId.HasValue && localUser.Tutor.IsDeleted == false;
                ViewData["isParent"] = localUser.IsParent;
                ViewData["isStudent"] = !localUser.IsParent && !(localUser.TutorId.HasValue && localUser.Tutor.IsDeleted == false);

                return View();
            }
            else
                return View();
        }
    }
}