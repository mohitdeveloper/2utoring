// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityModel;
using IdentityServer4.Events;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutIdentity.Business.Services.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;


namespace IdentityServer4.Quickstart.UI
{



    /// <summary>
    /// This sample controller implements a typical login/logout/provision workflow for local and external accounts.
    /// The login service encapsulates the interactions with the user data store. This data store is in-memory only and cannot be used for production!
    /// The interaction service provides a way for the UI to communicate with identityserver for validation and context retrieval
    /// </summary>
    [SecurityHeaders]
    [AllowAnonymous]
    public class AccountController : Controller
    {
        private readonly UserManager<StandingOut.Data.Models.User> _userManager;
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IClientStore _clientStore;
        private readonly IAuthenticationSchemeProvider _schemeProvider;
        private readonly IEventService _events;
        private readonly IUserService _UserService;
        private readonly AppSettings _AppSettings;

        public AccountController(IIdentityServerInteractionService interaction, IClientStore clientStore, IAuthenticationSchemeProvider schemeProvider,
            IEventService events, UserManager<StandingOut.Data.Models.User> userManager, IUserService userService, IOptions<AppSettings> appSettings)
        {
            _userManager = userManager;

            _interaction = interaction;
            _clientStore = clientStore;
            _schemeProvider = schemeProvider;
            _events = events;
            _UserService = userService;
            _AppSettings = appSettings.Value;
            
        }

        [HttpGet]
        public async Task<IActionResult> Register(string returnUrl)
        {
            if (string.IsNullOrEmpty(returnUrl)) returnUrl = _AppSettings.MainSiteUrl + "/find-a-lesson";
            var vm = await BuildLoginViewModelAsync(returnUrl);
            if (vm.ExternalProviders.Count() > 0)
            {
                ViewBag.GoogleAuthenticationScheme = vm.ExternalProviders.First().AuthenticationScheme;
            }
            else
            {
                ViewBag.GoogleAuthenticationScheme = "";
            }
            var registerVm = new StandingOut.Data.DTO.SystemObjects.RegisterUser() { ReturnUrl = returnUrl };
            return View(registerVm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(StandingOut.Data.DTO.SystemObjects.RegisterUser model)
        {
            StandingOut.Data.Models.User existing = null;

            if (ModelState.IsValid)
            {
                existing = await _UserService.GetByEmail(model.Email);
                if (existing == null)
                {
                    #region Verification Code and User IP
                    string iPAddress = HttpContext.Connection.RemoteIpAddress.ToString();
                    model.IPAddress = iPAddress;
                    //Random generator = new Random();
                    //String code = generator.Next(0, 1000000).ToString("D6");
                    //model.VerificationCode = code; 
                    #endregion
                    var result = await _UserService.RegisterLocal(model);
                    if (result.Succeeded == true)
                    {
                        // auto login
                        var user = await _userManager.FindByNameAsync(model.Email);
                        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
                        {
                            #region User Role For Company
                            if (!string.IsNullOrEmpty(model.ReturnUrl))
                            {
                                string urlString = model.ReturnUrl.ToLower();
                                bool isCompany = System.Text.RegularExpressions.Regex.IsMatch(urlString, (@"\bcompany\b"));
                                string[] userType = model.ReturnUrl.Split("/");
                                if (isCompany && userType.Contains("company"))
                                {
                                    await _userManager.AddToRoleAsync(user, "Admin");
                                }
                            }
                            #endregion

                            #region Generate Email Confirmation Token
                            if (user.EmailConfirmed == false)
                            {
                               
                                //await _UserService.SendEmailConfirmation(model.Email,code);
                                ViewData["Msg"] = "Please check your inbox we have emailed you a registration link. Please click on the link to proceed.";
                                return RedirectToAction("CodeVerification", new { id = user.Id, returnUrl = model.ReturnUrl });

                            }
                            #endregion

                            #region comment if user need to login after Register
                            //await _events.RaiseAsync(
                            //    new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName));
                            //AuthenticationProperties props = null;
                            //await HttpContext.SignInAsync(user.Id, user.UserName, props);
                            //if (string.IsNullOrEmpty(model.ReturnUrl)) model.ReturnUrl = "/Home";
                            //return View("Redirect", new RedirectViewModel { RedirectUrl = model.ReturnUrl }); 
                            #endregion
                        }
                        return RedirectToAction("Login", new { returnUrl = model.ReturnUrl });
                    }
                    else
                    {
                        return View(model);
                    }
                }
            }

            if (existing != null)
                ModelState.AddModelError("Email", "Email is already in use.");

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> CodeVerification(string id, string returnUrl)
        {

            #region Verification Code and User IP
            StandingOut.Data.Models.User user = _userManager.FindByIdAsync(id).Result;
            //string iPAddress = HttpContext.Connection.RemoteIpAddress.ToString();
            //user.IPAddress = iPAddress;
            Random generator = new Random();
            String code = generator.Next(0, 1000000).ToString("D6");
            user.VerificationCode = code;
            await _UserService.SendEmailConfirmation(user.Email, code);
            await _UserService.Update(user);
            ViewData["Msg"] = "Please check your inbox we have emailed you verification code!";
            #endregion


            StandingOut.Data.DTO.CodeVerification model = new StandingOut.Data.DTO.CodeVerification();
            model.UserId = id;
            model.ReturnUrl = returnUrl;
            return View(model);

        }

        [HttpPost]
        public async Task<IActionResult> CodeVerification(StandingOut.Data.DTO.CodeVerification model)
        {
            if (ModelState.IsValid)
            {
                #region comment if user need to login after Register
                StandingOut.Data.Models.User user = _userManager.FindByIdAsync(model.UserId).Result;

                if(user.VerificationCode==model.VCode)
                {
                    user.EmailConfirmed = true;
                    await _UserService.Update(user);
                    await _events.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName));
                    AuthenticationProperties props = null;
                    await HttpContext.SignInAsync(user.Id, user.UserName, props);
                    if (string.IsNullOrEmpty(model.ReturnUrl)) model.ReturnUrl = "/Home";
                    return View("Redirect", new RedirectViewModel { RedirectUrl = model.ReturnUrl });
                }
                ModelState.AddModelError("Info", "Entered verification code not matched!");
                return View(model);

                #endregion
            }
            return View(model);
        }

        #region Code for Resend Verification Code
        //[HttpGet("{id}")]
        //public async void ReSendVerificationCode(string id)
        //{
        //    #region Verification Code and User IP
        //    StandingOut.Data.Models.User user = _userManager.FindByIdAsync(id).Result;
        //    string iPAddress = HttpContext.Connection.RemoteIpAddress.ToString();
        //    user.IPAddress = iPAddress;
        //    Random generator = new Random();
        //    String code = generator.Next(0, 1000000).ToString("D6");
        //    user.VerificationCode = code;
        //    await _UserService.SendEmailConfirmation(user.Email, code);
        //    await _UserService.Update(user);
        //    ViewData["Msg"] = "Please check your inbox we have emailed you verification code!";
        //    return;
        //    //return RedirectToAction("CodeVerification", new { userId = id, returnUrl = returnUrl });
        //    #endregion
        //}

        #endregion

        public async Task<IActionResult> VerifyEmail(string key,string token)
        {
            StandingOut.Data.Models.User user = _userManager.FindByIdAsync(key).Result;
            IdentityResult result = _userManager.ConfirmEmailAsync(user, token).Result;
            if (result.Succeeded)
            {
                ViewData["Message"] = "Thank you for verifing your email, Please login here!";
                //return View("Redirect", new RedirectViewModel { RedirectUrl = "/Home" });
                return View();
            }
            else
            {
                ViewData["Message"] = "Error while verifing your email!";
                return View();
            }
           
        }

        /// <summary>
        /// Entry point into the login workflow
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Login(string returnUrl, bool? straightToGoogle)
        {
            if (string.IsNullOrEmpty(returnUrl)) returnUrl = _AppSettings.MainSiteUrl;
            // build a model so we know what to show on the login page
            var vm = await BuildLoginViewModelAsync(returnUrl);

            if(straightToGoogle == true && vm.VisibleExternalProviders.Count() > 0)
            {
                return RedirectToAction("Challenge", "External", new { provider = vm.VisibleExternalProviders.First().AuthenticationScheme, returnUrl = returnUrl });
            }

            if (vm.IsExternalLoginOnly)
            {
                // we only have one option for logging in and it's an external provider
                return RedirectToAction("Challenge", "External", new { provider = vm.ExternalLoginScheme, returnUrl });
            }

            ViewBag.MainSiteUrl = _AppSettings.MainSiteUrl;
            return View(vm);
        }

        /// <summary>
        /// Handle postback from username/password login
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginInputModel model, string button)
        {
            // check if we are in the context of an authorization request
            var context = await _interaction.GetAuthorizationContextAsync(model.ReturnUrl);

            // the user clicked the "cancel" button
            if (button != "login")
            {
                if (context != null)
                {
                    // if the user cancels, send a result back into IdentityServer as if they 
                    // denied the consent (even if this client does not require consent).
                    // this will send back an access denied OIDC error response to the client.
                    await _interaction.GrantConsentAsync(context, ConsentResponse.Denied);

                    // we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non-null
                    if (await _clientStore.IsPkceClientAsync(context.ClientId))
                    {
                        // if the client is PKCE then we assume it's native, so this change in how to
                        // return the response is for better UX for the end user.
                        return View("Redirect", new RedirectViewModel { RedirectUrl = model.ReturnUrl });
                    }

                    return Redirect(model.ReturnUrl);
                }
                else
                {
                    // since we don't have a valid context, then we just go back to the home page
                    return Redirect("~/");
                }
            }

            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.Username);
                
                if (user != null)
                {
                    if (user.EmailConfirmed==false)
                    {
                        ModelState.AddModelError("", "Email not verified!");
                        // build a model so we know what to show on the login page
                        var returModel = await BuildLoginViewModelAsync(model.ReturnUrl);
                        ViewBag.MainSiteUrl = _AppSettings.MainSiteUrl;
                        ViewBag.EmailConfirmed = false;
                        ViewBag.id = user.Id;
                        return View(returModel);
                    }
                 
                }

                

                // validate username/password against in-memory store
                if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    await _events.RaiseAsync(
                        new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName));

                    // only set explicit expiration here if user chooses "remember me". 
                    // otherwise we rely upon expiration configured in cookie middleware.
                    AuthenticationProperties props = null;
                    if (AccountOptions.AllowRememberLogin && model.RememberLogin)
                    {
                        props = new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTimeOffset.UtcNow.Add(AccountOptions.RememberMeLoginDuration)
                        };
                    };

                    // issue authentication cookie with subject ID and username
                    await HttpContext.SignInAsync(user.Id, user.UserName, props);

                    if (context != null)
                    {
                        if (await _clientStore.IsPkceClientAsync(context.ClientId))
                        {
                            // if the client is PKCE then we assume it's native, so this change in how to
                            // return the response is for better UX for the end user.
                            return View("Redirect", new RedirectViewModel { RedirectUrl = model.ReturnUrl });
                        }

                        // we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non-null
                        return Redirect(model.ReturnUrl);
                    }

                    // request for a local page
                    if (!string.IsNullOrEmpty(model.ReturnUrl))
                    {
                        return Redirect(model.ReturnUrl);
                    }
                    else if (string.IsNullOrEmpty(model.ReturnUrl))
                    {
                        return Redirect("~/");
                    }
                    else
                    {
                        // user might have clicked on a malicious link - should be logged
                        throw new Exception("invalid return URL");
                    }
                }

                await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "invalid credentials", clientId: context?.ClientId));
                ModelState.AddModelError(string.Empty, AccountOptions.InvalidCredentialsErrorMessage);
            }

            // something went wrong, show form with error
            var vm = await BuildLoginViewModelAsync(model);
            return View(vm);
        }

       // [Authorize]
        public async Task<IActionResult> LinkAccount(string linkAccountKeyOne, string linkAccountKeyTwo, string returnUrl)
        {
            var vm = await BuildLoginViewModelAsync("");
            vm.ReturnUrl = returnUrl;

            // auto send them to the google page
            if (vm.VisibleExternalProviders.Count() > 0)
            {
                return RedirectToAction("Challenge", "External", new { provider = vm.VisibleExternalProviders.First().AuthenticationScheme, link = true, returnUrl = returnUrl, linkAccountKeyOne = linkAccountKeyOne, linkAccountKeyTwo = linkAccountKeyTwo });
            }

            return View(vm);
        }

        public async Task<IActionResult> ForgottenPassword()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgottenPassword(StandingOut.Data.DTO.ForgotPassword model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    await _UserService.SendResetPasswordEmail(model.Email);
                    return View("ForgotPasswordConfirmation");
                }

                catch (Exception ex)
                {
                    return View("ForgotPasswordConfirmation");
                }
            }

            return View("ForgottenPassword");
        }

        public async Task<IActionResult> ForgotPasswordConfirmation()
        {
            return View();
        }

        public async Task<IActionResult> ResetPassword(string id)
        {
            var user = await _UserService.GetByForgottenKey(id);

            if (user == null)
                return View("ResetPasswordExpired");
            var model = new StandingOut.Data.DTO.ResetPassword { ForgottenKey = id };
            return View(model);
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(StandingOut.Data.DTO.ResetPassword model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    await _UserService.ResetForgotPassword(model.ForgottenKey, model.Password);
                    return View("ResetConfirmation");
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, ex.Message);
                }

            }
            return View(model);
        }

        public async Task<IActionResult> ResetPasswordExpired()
        {
            return View();
        }

        public async Task<IActionResult> ResetConfirmation()
        {
            return View();
        }

        public async Task<IActionResult> AccountInUse(string redirectUrl, string linkAccountKeyOne, string linkAccountKeyTwo)
        {
            ViewBag.LinkAccountKeyOne = linkAccountKeyOne;
            ViewBag.LinkAccountKeyTwo = linkAccountKeyTwo;
            return View(new RedirectViewModel { RedirectUrl = string.IsNullOrEmpty(redirectUrl) ? _AppSettings.MainSiteUrl : redirectUrl });
        }

        public async Task<IActionResult> AccountAlreadyLinked(string redirectUrl)
        {
            return View(new RedirectViewModel { RedirectUrl = string.IsNullOrEmpty(redirectUrl) ? _AppSettings.MainSiteUrl : redirectUrl });
        }

        public async Task<IActionResult> AccountLinkError(string redirectUrl)
        {
            return View(new RedirectViewModel { RedirectUrl = string.IsNullOrEmpty(redirectUrl) ? _AppSettings.MainSiteUrl : redirectUrl });
        }

        public async Task<IActionResult> LinkAccountConfirmation(string redirectUrl)
        {
            return View(new RedirectViewModel { RedirectUrl = string.IsNullOrEmpty(redirectUrl) ? _AppSettings.MainSiteUrl : redirectUrl });
        }
        /// <summary>
        /// Show logout page
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Logout(string logoutId)
        {
            // build a model so the logout page knows what to display
            var vm = await BuildLogoutViewModelAsync(logoutId);

            if (vm.ShowLogoutPrompt == false)
            {
                // if the request for logout was properly authenticated from IdentityServer, then
                // we don't need to show the prompt and can just log the user out directly.
                return await Logout(vm);
            }

            return View(vm);
        }

        /// <summary>
        /// Handle logout page postback
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout(LogoutInputModel model)
        {
            // build a model so the logged out page knows what to display
            var vm = await BuildLoggedOutViewModelAsync(model.LogoutId);

            if (User?.Identity.IsAuthenticated == true)
            {
                // delete local authentication cookie
                await HttpContext.SignOutAsync();
                // Clear the existing external cookie to ensure a clean login process
                await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
                // Clear the existing external cookie to ensure a clean login process
                await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

                // raise the logout event
                await _events.RaiseAsync(new UserLogoutSuccessEvent(User.GetSubjectId(), User.GetDisplayName()));
            }

            // check if we need to trigger sign-out at an upstream identity provider
            if (vm.TriggerExternalSignout)
            {
                // build a return URL so the upstream provider will redirect back
                // to us after the user has logged out. this allows us to then
                // complete our single sign-out processing.
                string url = Url.Action("Logout", new { logoutId = vm.LogoutId });

                // this triggers a redirect to the external provider for sign-out
                return SignOut(new AuthenticationProperties { RedirectUri = url }, vm.ExternalAuthenticationScheme);
            }

            return View("LoggedOut", vm);
            //return Redirect(vm.PostLogoutRedirectUri);
        }

        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }


        /*****************************************/
        /* helper APIs for the AccountController */
        /*****************************************/
        private async Task<LoginViewModel> BuildLoginViewModelAsync(string returnUrl)
        {
            var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
            if (context?.IdP != null && await _schemeProvider.GetSchemeAsync(context.IdP) != null)
            {
                var local = context.IdP == IdentityServer4.IdentityServerConstants.LocalIdentityProvider;

                // this is meant to short circuit the UI and only trigger the one external IdP
                var vm = new LoginViewModel
                {
                    EnableLocalLogin = local,
                    ReturnUrl = returnUrl,
                    Username = context?.LoginHint,
                };

                if (!local)
                {
                    vm.ExternalProviders = new[] { new ExternalProvider { AuthenticationScheme = context.IdP } };
                }

                return vm;
            }

            var schemes = await _schemeProvider.GetAllSchemesAsync();

            var providers = schemes
                .Where(x => x.DisplayName != null ||
                            (x.Name.Equals(AccountOptions.WindowsAuthenticationSchemeName, StringComparison.OrdinalIgnoreCase))
                )
                .Select(x => new ExternalProvider
                {
                    DisplayName = x.DisplayName,
                    AuthenticationScheme = x.Name
                }).ToList();

            var allowLocal = true;
            if (context?.ClientId != null)
            {
                var client = await _clientStore.FindEnabledClientByIdAsync(context.ClientId);
                if (client != null)
                {
                    allowLocal = client.EnableLocalLogin;

                    if (client.IdentityProviderRestrictions != null && client.IdentityProviderRestrictions.Any())
                    {
                        providers = providers.Where(provider => client.IdentityProviderRestrictions.Contains(provider.AuthenticationScheme)).ToList();
                    }
                }
            }

            return new LoginViewModel
            {
                AllowRememberLogin = AccountOptions.AllowRememberLogin,
                EnableLocalLogin = allowLocal && AccountOptions.AllowLocalLogin,
                ReturnUrl = returnUrl,
                Username = context?.LoginHint,
                ExternalProviders = providers.ToArray(),
            };
        }

        private async Task<LoginViewModel> BuildLoginViewModelAsync(LoginInputModel model)
        {
            var vm = await BuildLoginViewModelAsync(model.ReturnUrl);
            vm.Username = model.Username;
            vm.RememberLogin = model.RememberLogin;
            return vm;
        }

        private async Task<LogoutViewModel> BuildLogoutViewModelAsync(string logoutId)
        {
            var vm = new LogoutViewModel { LogoutId = logoutId, ShowLogoutPrompt = AccountOptions.ShowLogoutPrompt };

            if (User?.Identity.IsAuthenticated != true)
            {
                // if the user is not authenticated, then just show logged out page
                vm.ShowLogoutPrompt = false;
                return vm;
            }

            var context = await _interaction.GetLogoutContextAsync(logoutId);
            if (context?.ShowSignoutPrompt == false)
            {
                // it's safe to automatically sign-out
                vm.ShowLogoutPrompt = false;
                return vm;
            }

            // show the logout prompt. this prevents attacks where the user
            // is automatically signed out by another malicious web page.
            return vm;
        }

        private async Task<LoggedOutViewModel> BuildLoggedOutViewModelAsync(string logoutId)
        {
            // get context information (client name, post logout redirect URI and iframe for federated signout)
            var logout = await _interaction.GetLogoutContextAsync(logoutId);

            var vm = new LoggedOutViewModel
            {
                AutomaticRedirectAfterSignOut = AccountOptions.AutomaticRedirectAfterSignOut,
                PostLogoutRedirectUri = logout?.PostLogoutRedirectUri,
                ClientName = string.IsNullOrEmpty(logout?.ClientName) ? logout?.ClientId : logout?.ClientName,
                SignOutIframeUrl = logout?.SignOutIFrameUrl,
                LogoutId = logoutId
            };

            if (User?.Identity.IsAuthenticated == true)
            {
                var idp = User.FindFirst(JwtClaimTypes.IdentityProvider)?.Value;
                if (idp != null && idp != IdentityServer4.IdentityServerConstants.LocalIdentityProvider)
                {
                    var providerSupportsSignout = await HttpContext.GetSchemeSupportsSignOutAsync(idp);
                    if (providerSupportsSignout)
                    {
                        if (vm.LogoutId == null)
                        {
                            // if there's no current logout context, we need to create one
                            // this captures necessary info from the current logged in user
                            // before we signout and redirect away to the external IdP for signout
                            vm.LogoutId = await _interaction.CreateLogoutContextAsync();
                        }

                        vm.ExternalAuthenticationScheme = idp;
                    }
                }
            }

            return vm;
        }
    }
}
