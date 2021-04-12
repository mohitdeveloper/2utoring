using StandingOut.Business.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace StandingOut.ViewComponents
{
    public class AdminProfileViewComponent : ViewComponent
    {
        private readonly IUserService _UserService;

        public AdminProfileViewComponent(IUserService userService)
        {
            _UserService = userService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var user = await _UserService.GetByEmail(User.Identity.Name);
            return View(user);
        }
        
    }
}
