using StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using StandingOut.Data.DTO;

namespace StandingOutStore.ViewComponents
{
    public class ProfileViewComponent : ViewComponent
    {
        private readonly IUserService _UserService;

        public ProfileViewComponent(IUserService userService)
        {
            _UserService = userService;
        }

        public async Task<IViewComponentResult> InvokeAsync(string layotType)
        {
            UserProfileHeader model = new UserProfileHeader();
            if(!string.IsNullOrEmpty(layotType))
            {
                model.LayoutType = layotType;
            }
            //var user = await _UserService.GetById(HttpContext.User.Claims.FirstOrDefault(p => p.Type == "sub").Value);
            if (User.Identity.IsAuthenticated)
            {
                var user = await _UserService.GetByEmail(User.Identity.Name);
                if(!string.IsNullOrEmpty(user.Title))
                {
                    model.Title = user.Title + ".";
                }
                if (!string.IsNullOrEmpty(user.FirstName))
                {
                    model.ShortName = string.Concat(user.FirstName[0].ToString() , !string.IsNullOrEmpty(user.LastName)?user.LastName[0].ToString():"");
                }
                else
                {
                    model.ShortName = user.Email[0].ToString();
                }
                model.FirstName = user.FirstName;
                model.LastName = user.LastName;
                model.Email = user.Email;
                return View(model);
            } else
            {
                return View(model);
            }
        }
    }
}
