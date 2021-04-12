using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Shared.Mapping;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOut.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IClassSessionService _ClassSessionService;
        private readonly ISettingService _SettingService;
        private readonly IHostingEnvironment _Enviroment;
        private readonly AppSettings _AppSettings;

        public HomeController(UserManager<Models.User> userManager, IClassSessionService classSessionService, ISettingService settingService,
            IHostingEnvironment enviroment, IOptions<AppSettings> appSettings)
        {
            _UserManager = userManager;
            _ClassSessionService = classSessionService;
            _SettingService = settingService;
            _Enviroment = enviroment;
            _AppSettings = appSettings.Value;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(DTO.HomePageSearch model)
        {
            return RedirectPermanent("https://www.2utoring.com");
            return Redirect("/Search/All" + (string.IsNullOrEmpty(model.Search) ? "" : ("?term=" + HttpUtility.UrlEncode(model.Search))));
        }

        [HttpGet]
        public async Task<IActionResult> WaitingList()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Welcome()
        {
            return RedirectPermanent("https://www.2utoring.com");
            var user = await _UserManager.FindByNameAsync(User.Identity.Name);
            return View(Mappings.Mapper.Map<Models.User, DTO.WelcomeUser>(user));
        }

        [HttpGet]
        public async Task<IActionResult> ContactUs()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ContactUs(DTO.ContactUs model)
        {
            return RedirectPermanent("https://www.2utoring.com");
            if (ModelState.IsValid)
            {
                var settings = await _SettingService.Get();
                var message = new SendGrid.Helpers.Mail.SendGridMessage()
                {
                    From = new SendGrid.Helpers.Mail.EmailAddress(settings.SendGridFromEmail),
                    Subject = $"Standing Out - Contact Us Enquiry",
                    HtmlContent = "<p><b>Email:</b> " + model.Email + "</p><p><b>Message:</b> " + model.Message + "</p>",
                    ReplyTo = new SendGrid.Helpers.Mail.EmailAddress(model.Email)
                };
                message.AddTo(settings.ContactUsEmail);
                //message.AddTo("jack.r@iostudios.co.uk");
                var client = new SendGrid.SendGridClient(settings.SendGridApi);
                // No try catch as whole point is the email
                await client.SendEmailAsync(message);
                
                return RedirectToAction("ContactUsComplete");
            }

            return View(model);
        }
        
        [HttpGet]
        public async Task<IActionResult> ContactUsComplete()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> TutorSignUp()
        {
        return RedirectPermanent("https://www.2utoring.com");
        return View();
        }

        [HttpPost]
        public async Task<IActionResult> TutorSignUp(DTO.TutorSignUp model)
        {
            return RedirectPermanent("https://www.2utoring.com");
            if (ModelState.IsValid)
            {
                var settings = await _SettingService.Get();
                var message = new SendGrid.Helpers.Mail.SendGridMessage()
                {
                    From = new SendGrid.Helpers.Mail.EmailAddress(settings.SendGridFromEmail),
                    Subject = $"Standing Out - Tutor Sign Up Enquiry",
                    HtmlContent = "<p><b>Email:</b> " + model.Email + "</p>" +
                    "<p><b>First Name:</b> " + model.FirstName + "</p>" +
                    "<p><b>Last Name:</b> " + model.LastName + "</p>" +
                    "<p><b>Phone:</b> " + model.Phone + "</p>" +
                    "<p><b>Additional info:</b> " + model.Message + "</p>",
                    ReplyTo = new SendGrid.Helpers.Mail.EmailAddress(model.Email)
                };
                message.AddTo(settings.TutorSignUpEmail);
                var client = new SendGrid.SendGridClient(settings.SendGridApi);
                // No try catch as whole point is the email to the admin
                await client.SendEmailAsync(message);

                // Then send an email to the tutor
                try
                {
                    await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                        System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\TutorSignUp.html"),
                        new Dictionary<string, string>()
                        {
                                    { "{{imageURL}}",  _AppSettings.MainSiteUrl + "/images/2utoringlogo.png" },
                                    { "{{firstName}}", model.FirstName },
                                    { "{{lastName}}", model.LastName }
                        }, model.Email, settings.SendGridFromEmail, "Welcome to Standing Out",
                        string.IsNullOrEmpty(settings.SignUpEmail) ? null : new string[] { settings.SignUpEmail });
                }
                catch
                {
                    // Not fussed if there is an odd issue delivering this
                }

                return RedirectToAction("TutorSignUpComplete");
            }

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> TutorSignUpComplete()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        public async Task<IActionResult> AcceptableUse()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        public async Task<IActionResult> PrivacyPolicy()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        public async Task<IActionResult> CookiePolicy()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        public async Task<IActionResult> TermsAndConditions()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        public async Task<IActionResult> WebsiteTermsAndConditions()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        public async Task<IActionResult> CancellationForm()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        public async Task<IActionResult> Error()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }

        public async Task<IActionResult> StyleGuide()
        {
            return RedirectPermanent("https://www.2utoring.com");
            return View();
        }
    }
}
