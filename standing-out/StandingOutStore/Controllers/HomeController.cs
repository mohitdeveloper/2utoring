using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOut.Shared.Helpers.RecaptchaHelper;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers
{

    public class HomeController : Controller
    {
        private readonly ISubjectService _SubjectService;
        private readonly ISubjectCategoryService _SubjectCategoryService;
        private readonly IStudyLevelService _StudyLevelService;
        private readonly ISettingService _SettingService;
        private readonly IClassSessionService _ClassSessionService;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IHostingEnvironment _Environment;
        private readonly AppSettings _AppSettings;
        private readonly IStripePlanService _StripePlanService;

        public HomeController(ISubjectService subjectService, ISubjectCategoryService subjectCategoryService, IStripePlanService stripePlanService,
            IStudyLevelService studyLevelService, ISettingService settingService, UserManager<Models.User> userManager,
            IHostingEnvironment hosting, IOptions<AppSettings> appSettings, IClassSessionService classSessionService, ISessionAttendeeService sessionAttendeeService)
        {
            _SubjectService = subjectService;
            _SubjectCategoryService = subjectCategoryService;
            _StudyLevelService = studyLevelService;
            _SettingService = settingService;
            _ClassSessionService = classSessionService;
            _SessionAttendeeService = sessionAttendeeService;
            _UserManager = userManager;
            _Environment = hosting;
            _AppSettings = appSettings.Value;
            _StripePlanService = stripePlanService;
        }

        public async Task<IActionResult> Index()
        {
            ViewBag.Subjects = await _SubjectService.GetOptions();
            ViewBag.SubjectCategories = await _SubjectCategoryService.GetOptions(null);
            ViewBag.StudyLevels = await _StudyLevelService.GetOptions();
            return View();
        }

        [Authorize]
        public async Task<IActionResult> SignIn()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (await _UserManager.IsInRoleAsync(user, "Super Admin"))
            {
                return RedirectToAction("Index", "Home", new { area = "Admin" });
            }
            else if (await _UserManager.IsInRoleAsync(user, "Admin"))
            {
                return RedirectToAction("Index", "Home", new { area = "Admin" });
            }
            else if (await _UserManager.IsInRoleAsync(user, "Tutor"))
            {
                return RedirectToAction("Index", "Home", new { area = "Tutor" });
            }
            else
            {
                var classSessionsCount = await _SessionAttendeeService.GetSessionAttendeesCountByUser(user.Id);
                if (classSessionsCount > 0)
                {
                    return RedirectToRoute("MyTimetable");
                }
                else
                {
                    return RedirectToAction("Index");
                }
            }
            return View("Forbidden");
        }

        [Authorize]
        public async Task<IActionResult> MyArea()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (await _UserManager.IsInRoleAsync(user, "Super Admin"))
            {
                return RedirectToAction("Index", "Home", new { area = "Admin" });
            }
            else if (await _UserManager.IsInRoleAsync(user, "Admin"))
            {
                return RedirectToAction("Index", "Home", new { area = "Admin" });
            }
            else if (await _UserManager.IsInRoleAsync(user, "Tutor"))
            {
                return RedirectToAction("Index", "Home", new { area = "Tutor" });
            }
            else
            {
                return RedirectToRoute("MyTimetable");
            }
            return View("Forbidden");
        }

        public async Task<IActionResult> Error()
        {
            return View();
        }

        public async Task<IActionResult> StatusCode(int code)
        {
            // For useage see https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.1
            var statusCodeReExecuteFeature = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
            if (statusCodeReExecuteFeature != null)
            {
                if (code == 404)
                {
                    if (statusCodeReExecuteFeature.OriginalPath != null)
                    {
                        var splitCode = statusCodeReExecuteFeature.OriginalPath.ToLower().Split('/');
                        // Handle errors for lessons that aren't available any more
                        if (splitCode.Length == 3 && splitCode[0] == "" && (splitCode[1] == "lesson" || splitCode[1] == "guardian-enroll" || splitCode[1] == "student-enroll"))
                        {
                            try
                            {
                                var classSessionId = new Guid(splitCode[2]);
                                return View("LessonUnavailable");
                            }
                            catch { }
                        }
                    }
                    return View("NotFound");
                }
                else if (code == 403)
                    return View("Forbidden");
            }
            // Other errors
            return View("Error");
        }

        public async Task<IActionResult> StyleGuide()
        {
            return View();
        }

        //Note this needs to stay for now, good SEO to redirect them somewhere
        public async Task<IActionResult> WaitingList()
        {
            return RedirectToRoutePermanent("ContactUs");
        }

        public async Task<IActionResult> ContactUs()
        {
            //ViewBag.RecaptchaSiteKey = _AppSettings.RecaptchaSiteKey;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ContactUs(DTO.ContactUs model)
        {
            //var recaptchaResponse = await RecaptchaHelper.ProcessRecaptchaV2(_AppSettings.RecaptchaSecretKey, Request.Form["g-recaptcha-response"]);
            //if (ModelState.IsValid && recaptchaResponse.Success)
            if (ModelState.IsValid)
            {
                var settings = await _SettingService.Get();
                // No try catch here - As the whole point is to send the email!
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                   System.IO.Path.Combine(_Environment.ContentRootPath, "Templates\\AdminContactUs.html"),
                   new Dictionary<string, string>()
                   {
                        { "{{siteUrl}}",  _AppSettings.MainSiteUrl + "/images/2utoring-logo.png" },
                        { "{{contactName}}",model.Name },
                        { "{{contactPhoneNo}}",model.PhoneNo!=null?model.PhoneNo:"" },
                        { "{{contactEmail}}", model.Email },
                        { "{{contactComment}}", model.Message }
                   }, settings.ContactUsEmail, settings.SendGridFromEmail, $"{model.Name} has sent you a message");

                //return View(model);
                return RedirectToRoute("ContactUsComplete");
            }

            return View(model);
        }

        public async Task<IActionResult> ContactUsComplete()
        {
            return View();
        }

        public async Task<IActionResult> Forbidden()
        {
            return View("Forbidden");
        }

        public async Task<IActionResult> LinkAccount(string returnUrl)
        {
            return View("Forbidden");
        }
        #region New implement
        public async Task<IActionResult> ClassRoom()
        {
            return View();
        }
        public async Task<IActionResult> Pricing()
        {
           
            ViewBag.MainSiteUrl = _AppSettings.MainSiteUrl;
            ViewBag.IdentitySiteUrl = _AppSettings.IdentitySiteUrl;
            var stripePlans = await _StripePlanService.Get();
            return View(stripePlans);
        }
        public async Task<IActionResult> Safeguarding()
        {
           
            return View();
        }
        public async Task<IActionResult> About()
        {
            return View();
        }

        #endregion

    }
}
