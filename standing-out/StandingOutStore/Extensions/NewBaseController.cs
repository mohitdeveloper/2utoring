using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOut.Data.DTO;
using StandingOutStore.Business.Services.Interfaces;
using IUserService = StandingOutStore.Business.Services.Interfaces.IUserService;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Extensions
{
    [ProducesResponseType(typeof(ModelStateDictionary), 400)]
    public class NewBaseController : Controller, IGetCallerContext
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;
        private readonly IUserService _UserService;
        private readonly IOptions<AppSettings> _AppSettings;
        private readonly ICompanyService companyService;
        private Models.User _currentUser;
        private CallContext _callContext;

        public ICallContext Caller => _callContext;

        public NewBaseController(UserManager<Models.User> userManager,
            IOptions<AppSettings> appSettings,
            //RoleManager<IdentityRole> roleManager,
            //IUserService userService, 
            ICompanyService companyService = null
            )
        {
            _UserManager = userManager;
            _AppSettings = appSettings;
            this.companyService = companyService;
            //_RoleManager = roleManager;
            //_UserService = userService;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            _currentUser = await GetCurrentUser();

            await base.OnActionExecutionAsync(context, next);
            return;
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            ViewData["CallerContext"] = Caller;
            base.OnActionExecuted(context);
        }

        public async Task<Models.User> GetCurrentUser()
        {
            if (User?.Identity?.Name == null) return null;
            if (_currentUser == null)
            {
                _currentUser = await _UserManager.FindByEmailAsync(User.Identity.Name);
                if (_currentUser == null) _currentUser = await _UserManager.FindByNameAsync(User.Identity.Name);
                _callContext = await GetCallerContext(_currentUser);
            }

            return _currentUser;
        }

        public async Task<CallContext> GetCallerContext(Models.User user)
        {
            if (_callContext == null)
            {
                var isTutor = await _UserManager.IsInRoleAsync(user, "Tutor");
                var isAdmin = await _UserManager.IsInRoleAsync(user, "Admin");
                var isSuperAdmin = await _UserManager.IsInRoleAsync(user, "Super Admin");
                _callContext = new CallContext
                {
                    CurrentUser = _currentUser,
                    IsTutor = isTutor,
                    IsAdmin = isAdmin,
                    IsSuperAdmin = isSuperAdmin,
                    CurrentUserCompany = await GetCompany()
                };
            }

            return _callContext;
        }

        private async Task<Models.Company> GetCompany()
        {
            if (companyService != null)
                return await companyService.GetByAdminUser(_currentUser);
            else
                return null;
        }
    }

    public interface IGetCallerContext
    {
        Task<CallContext> GetCallerContext(Models.User user);
    }
}
