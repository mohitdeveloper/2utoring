// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using System.Threading.Tasks;

namespace IdentityServer4.Quickstart.UI
{
    [SecurityHeaders]
    [AllowAnonymous]
    public class HomeController : Controller
    {
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger _logger;
        private readonly AppSettings _AppSettings;

        public HomeController(IIdentityServerInteractionService interaction, IWebHostEnvironment environment, ILogger<HomeController> logger, IOptions<AppSettings> appSettings)
        {
            _interaction = interaction;
            _environment = environment;
            _logger = logger;
            _AppSettings = appSettings.Value;
        }

        public IActionResult Index()
        {
            return RedirectPermanent(_AppSettings.MainSiteUrl + "/Home/SignIn");

            if (_environment.IsDevelopment())
            {
                // only show in development
                return View();
            }

            _logger.LogInformation("Homepage is disabled in production. Returning 404.");
            return NotFound();
        }

        /// <summary>
        /// Shows the error page
        /// </summary>
        public async Task<IActionResult> Error(string errorId)
        {
            var vm = new ErrorViewModel();

            // retrieve error details from identityserver
            var message = await _interaction.GetErrorContextAsync(errorId);
            if (message != null)
            {
                vm.Error = message;

                if (!_environment.IsDevelopment())
                {
                    // only show in development
                    message.ErrorDescription = null;
                }
            }

            return View("Error", vm);
        }

        public async Task<IActionResult> PrivacyPolicy()
        {
            return RedirectPermanent("https://www.2utoring.com/privacy-policy");
        }
        public async Task<IActionResult> Terms()
        {
            return RedirectPermanent("https://www.2utoring.com/terms-of-website-use");
        }

        public async Task<IActionResult> Redirect(string returnUrl)
        {
            return View("Redirect", new RedirectViewModel { RedirectUrl = returnUrl });
        }
    }
}