using IdentityModel;
using IdentityServer4.Events;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutIdentity.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace IdentityServer4.Quickstart.UI
{
    [SecurityHeaders]
    [AllowAnonymous]
    public class ExternalController : Controller
    {
        private readonly UserManager<StandingOut.Data.Models.User> _userManager;
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IClientStore _clientStore;
        private readonly ILogger<ExternalController> _logger;
        private readonly IEventService _events;
        private readonly AppSettings _AppSettings;
        private readonly IUserService _UserService;

        public ExternalController(IIdentityServerInteractionService interaction, IClientStore clientStore, IEventService events,
            ILogger<ExternalController> logger, UserManager<StandingOut.Data.Models.User> userManager, IOptions<AppSettings> appSettings, IUserService userService)
        {
            // if the TestUserStore is not in DI, then we'll just use the global users collection
            // this is where you would plug in your own custom identity management library (e.g. ASP.NET Identity)
            _userManager = userManager;

            _interaction = interaction;
            _clientStore = clientStore;
            _logger = logger;
            _events = events;
            _AppSettings = appSettings.Value;
            _UserService = userService;
        }

        /// <summary>
        /// initiate roundtrip to external authentication provider
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Challenge(string provider, string returnUrl, bool link, string linkAccountKeyOne, string linkAccountKeyTwo)
        {
            if (string.IsNullOrEmpty(returnUrl)) returnUrl = "/Home";

            // validate returnUrl - either it is a valid OIDC URL or back to a local page
            //if (Url.IsLocalUrl(returnUrl) == false && _interaction.IsValidReturnUrl(returnUrl) == false) CB- check ok to comment this
            //{
            //    // user might have clicked on a malicious link - should be logged
            //    throw new Exception("invalid return URL");
            //}

            if (AccountOptions.WindowsAuthenticationSchemeName == provider)
            {
                // windows authentication needs special handling
                return await ProcessWindowsLoginAsync(returnUrl);
            }
            else
            {
                // start challenge and roundtrip the return URL and scheme 
                var props = new AuthenticationProperties
                {
                    RedirectUri = Url.Action(nameof(Callback)),
                    Items =
                    {
                        { "returnUrl", returnUrl },
                        { "scheme", provider },
                        { "linkAccountKeyOne", linkAccountKeyOne },
                        { "linkAccountKeyTwo", linkAccountKeyTwo },
                    }
                };

                if (link == true)
                {
                    props.RedirectUri = Url.Action(nameof(CallbackLink));
                }

                return Challenge(props, provider);
            }
        }

        /// <summary>
        /// Post processing of external authentication
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Callback()
        {
            // read external identity from the temporary cookie
            var result = await HttpContext.AuthenticateAsync(IdentityServer4.IdentityServerConstants.ExternalCookieAuthenticationScheme);
            if (result?.Succeeded != true)
            {
                throw new Exception("External authentication error");
            }

            if (_logger.IsEnabled(LogLevel.Debug))
            {
                var externalClaims = result.Principal.Claims.Select(c => $"{c.Type}: {c.Value}");
                _logger.LogDebug("External claims: {@claims}", externalClaims);
            }

            // lookup our user and external provider info
            var (user, provider, providerUserId, claims) = await FindUserFromExternalProvider(result);
            if (user == null)
            {
                // this might be where you might initiate a custom workflow for user registration
                // in this sample we don't show how that would be done, as our sample implementation
                // simply auto-provisions new external user

                //Matts Code for creating a user

                user = new StandingOut.Data.Models.User
                {
                    FirstName = result.Principal.FindFirstValue(ClaimTypes.GivenName),
                    LastName = result.Principal.FindFirstValue(ClaimTypes.Surname),
                    Email = result.Principal.FindFirstValue(ClaimTypes.Email),
                    UserName = result.Principal.FindFirstValue(ClaimTypes.Email),
                    ContactEmail = result.Principal.FindFirstValue(ClaimTypes.Email),
                    GoogleEmail = result.Principal.FindFirstValue(ClaimTypes.Email),
                    CreatedDate = DateTime.Now
                };


                var userCreationResult = await _userManager.CreateAsync(user);

                if (!userCreationResult.Succeeded)
                    throw new Exception("External authentication error");

                user = await _userManager.FindByEmailAsync(user.Email);
                await _userManager.AddLoginAsync(user, new UserLoginInfo(provider, providerUserId, provider));
            }

            var picture = result.Principal.FindFirstValue("picture");
            if (user.GoogleProfilePicture != picture)
            {
                user.GoogleProfilePicture = picture;
                await _userManager.UpdateAsync(user);
            }


            // this allows us to collect any additonal claims or properties
            // for the specific prtotocols used and store them in the local auth cookie.
            // this is typically used to store data needed for signout from those protocols.
            var additionalLocalClaims = new List<Claim>();
            var localSignInProps = new AuthenticationProperties();
            ProcessLoginCallbackForOidc(result, additionalLocalClaims, localSignInProps, user);

            string access_token = await ProcessAdditionalClaims(result, user, provider);

            //var isuser = new IdentityServerUser(user.Id)
            //{
            //    DisplayName = user.UserName,
            //    IdentityProvider = provider,
            //    AdditionalClaims = additionalLocalClaims
            //};

            //await HttpContext.SignInAsync(isuser, localSignInProps);

            //// issue authentication cookie for user
            await HttpContext.SignInAsync(user.Id, user.UserName, provider, localSignInProps, additionalLocalClaims.ToArray());

            // delete temporary cookie used during external authentication
            await HttpContext.SignOutAsync(IdentityServer4.IdentityServerConstants.ExternalCookieAuthenticationScheme);

            // retrieve return URL
            var returnUrl = result.Properties.Items["returnUrl"] ?? "~/";

            // check if external login is in the context of an OIDC request
            var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
            await _events.RaiseAsync(new UserLoginSuccessEvent(provider, providerUserId, user.Id, user.UserName, true, context?.ClientId));

            if (context != null)
            {
                if (await _clientStore.IsPkceClientAsync(context.ClientId))
                {
                    // if the client is PKCE then we assume it's native, so this change in how to
                    // return the response is for better UX for the end user.
                    return View("Redirect", new RedirectViewModel { RedirectUrl = returnUrl });
                }
            }

            return Redirect(returnUrl);
        }

        [HttpGet]
        public async Task<IActionResult> CallbackLink()
        {
            var result = await HttpContext.AuthenticateAsync(IdentityServer4.IdentityServerConstants.ExternalCookieAuthenticationScheme);
            if (result?.Succeeded != true)
            {
                throw new Exception("External authentication error");
            }

            if (_logger.IsEnabled(LogLevel.Debug))
            {
                var externalClaims = result.Principal.Claims.Select(c => $"{c.Type}: {c.Value}");
                _logger.LogDebug("External claims: {@claims}", externalClaims);
            }

            var returnUrl = result.Properties.Items["returnUrl"] ?? "";
            var linkAccountKeyOne = result.Properties.Items["linkAccountKeyOne"] ?? "";
            var linkAccountKeyTwo = result.Properties.Items["linkAccountKeyTwo"] ?? "";
            var (user, provider, providerUserId, claims) = await FindUserFromExternalProvider(result);

            if (user == null)
            {
                user = await _UserService.GetByLinkAccountKey(linkAccountKeyOne, linkAccountKeyTwo);

                if(user == null)
                {
                    return RedirectToAction("AccountLinkError", "Account", new { RedirectUrl = returnUrl });
                }

                var existingLogins = await _UserService.GetUserLoginInfo(user.Id);
                if (existingLogins.Where(o => o.LoginProvider == "Google").Count() == 0)
                {
                    var googleEmail = claims.FirstOrDefault(o => o.Type.Contains("emailaddress")).Value;
                    await _userManager.AddLoginAsync(user, new UserLoginInfo(provider, providerUserId, provider));


                    await _UserService.UpdateContactEmailAddress(user.Id, googleEmail);
                }
                else
                {
                    return RedirectToAction("AccountAlreadyLinked", "Account", new { RedirectUrl = returnUrl });
                }
            }
            else
            {
                return RedirectToAction("AccountInUse", "Account", new { RedirectUrl = returnUrl, linkAccountKeyOne = linkAccountKeyOne, linkAccountKeyTwo = linkAccountKeyTwo });
            }

            //sign out the local user
            await HttpContext.SignOutAsync();
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
            SignOut("Cookies", "oidc");

            // sign in the google user
            var additionalLocalClaims = new List<Claim>();
            var localSignInProps = new AuthenticationProperties();
            ProcessLoginCallbackForOidc(result, additionalLocalClaims, localSignInProps, user);

            string access_token = await ProcessAdditionalClaims(result, user, provider);

            //// issue authentication cookie for user
            await HttpContext.SignInAsync(user.Id, user.UserName, provider, localSignInProps, additionalLocalClaims.ToArray());

            // delete temporary cookie used during external authentication
            await HttpContext.SignOutAsync(IdentityServer4.IdentityServerConstants.ExternalCookieAuthenticationScheme);

            // check if external login is in the context of an OIDC request
            var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
            await _events.RaiseAsync(new UserLoginSuccessEvent(provider, providerUserId, user.Id, user.UserName, true, context?.ClientId));

            //return RedirectToAction("LinkAccountConfirmation", "Account", new { RedirectUrl = returnUrl });
            return View("Redirect", new RedirectViewModel { RedirectUrl = returnUrl });
        }

        private async Task<string> ProcessAdditionalClaims(AuthenticateResult externalResult, StandingOut.Data.Models.User user, string provider)
        {
            //Get Expires at for third party so we can use it.
            var expires_at = externalResult.Properties.GetTokenValue("expires_at");
            if (expires_at != null)
                await _userManager.SetAuthenticationTokenAsync(user, provider, "expires_at", expires_at);

            //Get Refresh Token for third party so we can use it.
            var refresh_token = externalResult.Properties.GetTokenValue("refresh_token");
            if (refresh_token != null)
                await _userManager.SetAuthenticationTokenAsync(user, provider, "refresh_token", refresh_token);

            //Get Access Token for third party so we can use it.
            var access_token = externalResult.Properties.GetTokenValue("access_token");
            if (access_token != null)
                await _userManager.SetAuthenticationTokenAsync(user, provider, "access_token", access_token);

            return access_token;
        }

        private async Task<IActionResult> ProcessWindowsLoginAsync(string returnUrl)
        {
            // see if windows auth has already been requested and succeeded
            var result = await HttpContext.AuthenticateAsync(AccountOptions.WindowsAuthenticationSchemeName);
            if (result?.Principal is WindowsPrincipal wp)
            {
                // we will issue the external cookie and then redirect the
                // user back to the external callback, in essence, treating windows
                // auth the same as any other external authentication mechanism
                var props = new AuthenticationProperties()
                {
                    RedirectUri = Url.Action("Callback"),
                    Items =
                    {
                        { "returnUrl", returnUrl },
                        { "scheme", AccountOptions.WindowsAuthenticationSchemeName },
                    }
                };

                var id = new ClaimsIdentity(AccountOptions.WindowsAuthenticationSchemeName);
                id.AddClaim(new Claim(JwtClaimTypes.Subject, wp.FindFirst(ClaimTypes.PrimarySid).Value));
                id.AddClaim(new Claim(JwtClaimTypes.Name, wp.Identity.Name));

                // add the groups as claims -- be careful if the number of groups is too large
                if (AccountOptions.IncludeWindowsGroups)
                {
                    var wi = wp.Identity as WindowsIdentity;
                    var groups = wi.Groups.Translate(typeof(NTAccount));
                    var roles = groups.Select(x => new Claim(JwtClaimTypes.Role, x.Value));
                    id.AddClaims(roles);
                }

                await HttpContext.SignInAsync(
                    IdentityServer4.IdentityServerConstants.ExternalCookieAuthenticationScheme,
                    new ClaimsPrincipal(id),
                    props);
                return Redirect(props.RedirectUri);
            }
            else
            {
                // trigger windows auth
                // since windows auth don't support the redirect uri,
                // this URL is re-triggered when we call challenge
                return Challenge(AccountOptions.WindowsAuthenticationSchemeName);
            }
        }

        private async Task<(StandingOut.Data.Models.User user, string provider, string providerUserId, IEnumerable<Claim> claims)> FindUserFromExternalProvider(AuthenticateResult result)
        {
            var externalUser = result.Principal;

            // try to determine the unique id of the external user (issued by the provider)
            // the most common claim type for that are the sub claim and the NameIdentifier
            // depending on the external provider, some other claim type might be used
            var userIdClaim = externalUser.FindFirst(JwtClaimTypes.Subject) ??
                              externalUser.FindFirst(ClaimTypes.NameIdentifier) ??
                              throw new Exception("Unknown userid");

            // remove the user id claim so we don't include it as an extra claim if/when we provision the user
            var claims = externalUser.Claims.ToList();
            claims.Remove(userIdClaim);

            var provider = result.Properties.Items["scheme"];
            var providerUserId = userIdClaim.Value;

            // find external user
            var user = await _userManager.FindByLoginAsync(provider, providerUserId);

            return (user, provider, providerUserId, claims);
        }

        private void ProcessLoginCallbackForOidc(AuthenticateResult externalResult, List<Claim> localClaims, AuthenticationProperties localSignInProps, StandingOut.Data.Models.User user)
        {
            // if the external system sent a session id claim, copy it over
            // so we can use it for single sign-out
            var sid = externalResult.Principal.Claims.FirstOrDefault(x => x.Type == JwtClaimTypes.SessionId);
            if (sid != null)
            {
                localClaims.Add(new Claim(JwtClaimTypes.SessionId, sid.Value));
            }

            // if the external provider issued an id_token, we'll keep it for signout
            var id_token = externalResult.Properties.GetTokenValue("id_token");
            if (id_token != null)
            {
                localSignInProps.StoreTokens(new[] { new AuthenticationToken { Name = "id_token", Value = id_token } });
            }


            localSignInProps.StoreTokens(new[] { new AuthenticationToken { Name = "email", Value = user.Email } });
        }

        //private void ProcessLoginCallbackForWsFed(AuthenticateResult externalResult, List<Claim> localClaims, AuthenticationProperties localSignInProps)
        //{
        //}

        //private void ProcessLoginCallbackForSaml2p(AuthenticateResult externalResult, List<Claim> localClaims, AuthenticationProperties localSignInProps)
        //{
        //}

    }
}
