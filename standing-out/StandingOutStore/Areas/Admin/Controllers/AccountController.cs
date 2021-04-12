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

namespace StandingOutStore.Areas.Admin.Controllers
{
    // ####################
    // TODO amend for Company Settings and Account 
    // ####################





    [Area("Admin")]
    [Authorize]
    //[CompanyBaseAuth]
    public class AccountController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutorService _TutorService;
        private readonly IStripeService _StripeService;
        private readonly IUserService _UserService;

        public AccountController(UserManager<Models.User> userManager, ITutorService tutorService, IStripeService stripeService, IUserService userService)
        {
            _UserManager = userManager;
            _TutorService = tutorService;
            _StripeService = stripeService;
            _UserService = userService;
        }

        public async Task<IActionResult> Index()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var existingLogins = await _UserService.GetUserLoginInfo(user.Id);
            ViewBag.HasGoogleAccountLinked = existingLogins.Any(o => o.LoginProvider == "Google");
            return View();
        }

        public async Task<IActionResult> Account()
        {
            return View(null);
            return View();
        }

        public async Task<IActionResult> SubscriptionIssue()
        {
            return View(null);

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

        public async Task<IActionResult> Prices()
        {
            return View(null);

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (user.TutorId.HasValue)
            {
                var tutor = await _TutorService.GetById(user.TutorId.Value);
                var tutorPricingUrl = $"/admin/{tutor.TutorId}/tutor/prices";
                return Redirect(tutorPricingUrl);
            }

            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Cancel()
        {
            return View(null);
            ViewBag.TutorCancelAccountReason = new SelectList(Enum.GetValues(typeof(TutorCancelAccountReason)).Cast<TutorCancelAccountReason>());
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Cancel(DTO.TutorCancel model)
        {
            return View(null);
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

        public async Task<IActionResult> Payout(bool error = false, bool? success = null)
        {
            return View(null);
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var tutor = await _TutorService.GetById(user.TutorId.Value);

            ViewBag.Error = error;
            ViewBag.Success = success;
            ViewBag.StripeConnectAccountId = !string.IsNullOrWhiteSpace(tutor.StripeConnectAccountId) ? tutor.StripeConnectAccountId : "";
            ViewBag.StripeConnectBankAccountId = !string.IsNullOrWhiteSpace(tutor.StripeConnectBankAccountId) ? tutor.StripeConnectBankAccountId : "";


            return View();
        }

        public async Task<IActionResult> PayoutRedirect()
        {
            return View(null);
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var tutor = await _TutorService.GetById(user.TutorId.Value);
            var redirect = await _StripeService.GetStripeConnectOAuthLink(tutor, user);

            return Redirect(redirect);
        }

        public async Task<IActionResult> PayoutOAuth(string code, string state)
        {
            return View(null);
        }

        public async Task<IActionResult> ChangePassword()
        {
            return View(null);
            return View();
        }

        public async Task<IActionResult> LinkAccount()
        {
            return View(null);
            return View();
        }
    }

}