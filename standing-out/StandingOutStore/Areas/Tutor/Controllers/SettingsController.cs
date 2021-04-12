using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using StandingOut.Data.Enums;
using System.Linq;
using StandingOut.Shared;
using StandingOut.Data.DTO;
using System.Runtime.InteropServices.WindowsRuntime;

namespace StandingOutStore.Areas.Tutor.Controllers
{
    [TutorBaseAuth]
    [Area("Tutor")]
    [Authorize]
    
    public class SettingsController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutorService _TutorService;
        private readonly IStripeService _StripeService;
        private readonly IUserService _UserService;
        private readonly ISubscriptionFeatureService subscriptionFeatureService;

        public SettingsController(UserManager<Models.User> userManager, ITutorService tutorService, IStripeService stripeService, IUserService userService,
            ISubscriptionFeatureService subscriptionFeatureService)
        {
            _UserManager = userManager;
            _TutorService = tutorService;
            _StripeService = stripeService;
            _UserService = userService;
            this.subscriptionFeatureService = subscriptionFeatureService;
        }
        [ValidatePlan]
        public async Task<IActionResult> Index()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var existingLogins = await _UserService.GetUserLoginInfo(user.Id);
            var currentCompany = await _TutorService.GetCurrentCompany(user);
            ViewBag.HasGoogleAccountLinked = existingLogins.Any(o => o.LoginProvider == "Google");
            ViewBag.IsCompanyTutor = (bool)(currentCompany != null);
            ViewBag.isPasswordSet = string.IsNullOrEmpty(user.PasswordHash);
            ViewBag.ClassSessionFeatures = await _TutorService.GetSubscriptionFeatureSet(user.TutorId.Value);
            return View();
        }
        [ValidatePlan]
        public async Task<IActionResult> Account()
        {
            return View();
        }
        [ValidatePlan]
        public async Task<IActionResult> Dbs()
        {
            return View();
        }

        public async Task<IActionResult> SubscriptionIssue()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (user.TutorId.HasValue)
            {
                var tutor = await _TutorService.GetById(user.TutorId.Value);
                return View(tutor);
            }
            else
            {
                return View(null);
            }
        }

        public async Task<IActionResult> Subscription()
        {
            return View();
        }
        public async Task<IActionResult> Calendar()
        {
            return View();
        }
        [ValidatePlan]
        public async Task<IActionResult> Prices()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (user.TutorId.HasValue)
            {
                var tutor = await _TutorService.GetById(user.TutorId.Value);
                var tutorPricingUrl = $"/admin/{tutor.TutorId}/tutor/prices";
                return Redirect(tutorPricingUrl);
            }

            return RedirectToAction("Index");
        }
        [ValidatePlan]
        public async Task<IActionResult> Cancel()
        {
            ViewBag.TutorCancelAccountReason = new SelectList(Enum.GetValues(typeof(TutorCancelAccountReason)).Cast<TutorCancelAccountReason>());
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Cancel(DTO.TutorCancel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                if (user.TutorId.HasValue)
                {
                    await _TutorService.Cancel(user.TutorId.Value, model);
                    return RedirectToAction("SubscriptionIssue");
                }
                else
                {
                    return RedirectToAction("Index");
                }
            }

            return View(model);
        }
        [ValidatePlan]
        public async Task<IActionResult> Payout(bool error = false, bool? success = null)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var tutor = await _TutorService.GetById(user.TutorId.Value);
            var settings = await _StripeService.GetSetting();
            ViewBag.Error = error;
            ViewBag.Success = success;
            ViewBag.StripeConnectAccountId = !string.IsNullOrWhiteSpace(tutor.StripeConnectAccountId) ? tutor.StripeConnectAccountId : "";
            ViewBag.StripeConnectBankAccountId = !string.IsNullOrWhiteSpace(tutor.StripeConnectBankAccountId) ? tutor.StripeConnectBankAccountId : "";
            ViewBag.StripKey = settings.StripeKey;
            ViewBag.tutorId = tutor.TutorId;

            return View();
        }

        public async Task<IActionResult> PayoutRedirect()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var tutor = await _TutorService.GetById(user.TutorId.Value);
            var redirect = await _StripeService.GetStripeConnectOAuthLink(tutor, user);

            return Redirect(redirect);
        }

        // Tutor Payout registration callback Url
        public async Task<IActionResult> PayoutOAuth(string code, string state)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var tutor = await _TutorService.GetById(user.TutorId.Value);
            bool error = false;
            if (tutor.TutorId.ToString() == state)
            {
                var response = await _StripeService.AuthenticateStripeConnectResponse(tutor, code);
                tutor = response.tutor;
                error = !response.success;
            }
            else
            {
                error = true;
            }

            //doing it like this to not pass unnesscary params which expose text on the page
            if (error)
                return RedirectToAction("Payout", new { error = true });
            else
                return RedirectToAction("Payout", new { success = true });
        }
        [ValidatePlan]
        public async Task<IActionResult> ChangePassword()
        {
            return View();
        }
        [ValidatePlan]
        public async Task<IActionResult> LinkAccount()
        {
            return View();
        }
    }

}