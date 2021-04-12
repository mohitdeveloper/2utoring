using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutStore.Business.Services;
using StandingOutStore.Business.Services.Interfaces;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers
{
    public class AccountController : Controller
    {
        private readonly IUserService _UserService;
        private readonly AppSettings _AppSettings;

        public AccountController(IUserService userService, IOptions<AppSettings> appSettings)
        {
            _UserService = userService;
            _AppSettings = appSettings.Value;
        }


        [Authorize]
        public IActionResult Login()
        {
            return RedirectToRoute("Default", new { controller = "Home", action = "Index" });
        }

        [HttpGet]
        public IActionResult Logout(string unique)
        {
            return SignOut("Cookies", "oidc");
        }

        [HttpPost]
        public IActionResult Logout()
        {
            return SignOut("Cookies", "oidc");
        }

        public async Task<IActionResult> Forbidden()
        {
            return View();
        }

        public async Task<IActionResult> AccessDenied()
        {
            return View();
        }
        public async Task<IActionResult> TooEarlyToClass()
        {
            return View();
        }

        public async Task<IActionResult> PermissionDenied()
        {
            return View();
        }

        public async Task<IActionResult> Register()
        {
            return View();
        }

        [Authorize]
        public async Task<IActionResult> LinkAccount(string returnUrl)
        {
            var user = await _UserService.GenerateLinkAccountTokens(User.Identity.Name);

            //sign out the local user
            try
            {
                await HttpContext.SignOutAsync();
            }
            catch (Exception ex)
            {

            }
            try
            {
                await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            }
            catch (Exception ex)
            {

            }
            try
            {
                await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
            }
            catch (Exception ex)
            {

            }

            return Redirect(_AppSettings.IdentitySiteUrl + "/Account/LinkAccount?linkAccountKeyOne=" + user.LinkAccountKeyOne + "&&linkAccountKeyTwo=" + user.LinkAccountKeyTwo + "&&returnUrl=" + returnUrl);
        }

        [Authorize]
        public async Task<IActionResult> LoginAccount(string returnUrl)
        {
            //sign out the local user
            try
            {
                await HttpContext.SignOutAsync();
            }
            catch (Exception ex)
            {

            }
            try
            {
                await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            }
            catch (Exception ex)
            {

            }
            try
            {
                await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
            }
            catch (Exception ex)
            {

            }

            return Redirect(_AppSettings.IdentitySiteUrl + "/Account/Login?straightToGoogle=true&&returnUrl=" + returnUrl);
        }
    }
}