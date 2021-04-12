
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using StandingOut.Data.DTO;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using StandingOutIdentity.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.Extensions.Options;

namespace StandingOutStore.ViewComponents
{
    public class CommonViewComponent : ViewComponent
    {
        private readonly IUserService _UserService;
        private readonly UserManager<Models.User> _UserManager;
        private readonly AppSettings _AppSettings;
        public CommonViewComponent(IUserService userService, UserManager<Models.User> userManager, IOptions<AppSettings> appSettings)
        {
            _UserService = userService;
            _UserManager = userManager;
            _AppSettings = appSettings.Value;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View(_AppSettings);
        }
    }
}
