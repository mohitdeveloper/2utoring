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
using Microsoft.Extensions.Options;
using StandingOut.Data;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [CompanyBaseAuth]
    [Area("Admin")]
    [Authorize]
    
    public class SettingsController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IOptions<AppSettings> appSettings;
        private readonly ICompanyService _CompanyService;
        private readonly IStripeService _StripeService;
        private readonly IUserService _UserService;

        public SettingsController(UserManager<Models.User> userManager, IOptions<AppSettings> appSettings, ICompanyService companyService,
            IStripeService stripeService, IUserService userService) : base(userManager, appSettings, companyService)
        {
            _UserManager = userManager;
            this.appSettings = appSettings;
            _CompanyService = companyService;
            _StripeService = stripeService;
            _UserService = userService;
        }
        [ValidatePlan]
        public async Task<IActionResult> Index()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var existingLogins = await _UserService.GetUserLoginInfo(user.Id);
            ViewBag.HasGoogleAccountLinked = existingLogins.Any(o => o.LoginProvider == "Google");
            ViewBag.isPasswordSet = string.IsNullOrEmpty(user.PasswordHash);
            return View();
        }
        [ValidatePlan]
        public async Task<IActionResult> Account()
        {
            return View();
        }

        public async Task<IActionResult> SubscriptionIssue()
        {
            if (Caller.CurrentUserCompany != null)
            {
                return View(Caller.CurrentUserCompany);
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

        //public async Task<IActionResult> Prices()
        //{
        //    var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
        //    if (user.TutorId.HasValue)
        //    {
        //        var tutor = await _TutorService.GetById(user.TutorId.Value);
        //        var tutorPricingUrl = $"/admin/{tutor.TutorId}/tutor/prices";
        //        return Redirect(tutorPricingUrl);
        //    }

        //    return RedirectToAction("Index");
        //}

        [ValidatePlan]
        public async Task<IActionResult> Cancel()
        {
            ViewBag.CompanyCancelAccountReason = new SelectList(Enum.GetValues(typeof(CompanyCancelAccountReason)).Cast<CompanyCancelAccountReason>());
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Cancel(DTO.CompanyCancel model)
        {
            if (ModelState.IsValid)
            {
                var company = Caller.CurrentUserCompany;
                if (company != null)
                {
                    await _CompanyService.Cancel(company.CompanyId, model);
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
            //var company = Caller.CurrentUserCompany;
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var company = await _CompanyService.GetByAdminUser(user);
            var settings = await _StripeService.GetSetting();
            ViewBag.Error = error;
            ViewBag.Success = success;
            ViewBag.StripeConnectAccountId = !string.IsNullOrWhiteSpace(company.StripeConnectAccountId) ? company.StripeConnectAccountId : "";
            ViewBag.StripeConnectBankAccountId = !string.IsNullOrWhiteSpace(company.StripeConnectBankAccountId) ? company.StripeConnectBankAccountId : "";
            ViewBag.StripKey = settings.StripeKey;
            ViewBag.companyId = company.CompanyId;
            return View();
        }

        public async Task<IActionResult> PayoutRedirect()
        {
            //if(Caller.CurrentUserCompany!=null)
            //{
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            //var company = await _CompanyService.GetById(Caller.CurrentUserCompany.CompanyId);
            var company = await _CompanyService.GetByAdminUser(user);
            var redirect = await _StripeService.GetStripeConnectOAuthLink(company, user);
                return Redirect(redirect);
            //}
            //return Redirect("/admin");
            //// TBC implementation
            //var redirect = await _StripeService.GetStripeConnectOAuthLink(tutor, user);

            //return Redirect(redirect);
        }

        // Company Payout registration callback Url
        public async Task<IActionResult> PayoutOAuth(string code, string state)
        {
            //return Redirect("/admin");
            //var company = Caller.CurrentUserCompany;

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var company = await _CompanyService.GetByAdminUser(user);
            bool error = false;
            if (company.CompanyId.ToString() == state)
            {
                var response = await _StripeService.AuthenticateStripeConnectResponse(company, code);
                company = response.company;
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

        [ValidatePlan]
        public async Task<IActionResult> TutorBankDetails()
        {
            return View();
        }
    }

}