using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Helpers.Twilio;
using StandingOut.Business.Services.Interfaces;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using Microsoft.AspNetCore.Authentication;
using StandingOut.Data;
using Microsoft.Extensions.Options;
using IdentityModel.Client;
using System.Net.Http;
using System.Globalization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using ssbsi = StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data.Enums;
using System.Collections.Generic;
using StandingOut.Data.Models;
using StandingOut.Shared;
using StandingOut.Data.Migrations;
using StandingOutStore.Business.Services;
using Twilio.Rest.Api.V2010;
using StandingOut.Shared.Integrations.Stripe;

namespace StandingOut.Areas.Classroom.Controllers
{
    [Authorize]
    [Area("Classroom")]
    public class SessionsController : Controller
    {
        private readonly ITwilioHelper _TwilioHelper;
        private readonly ISettingService _SettingService;
        private readonly IClassSessionService _ClassSessionService;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly IHubService _HubService;
        private readonly UserManager<Models.User> _UserManager;
        private readonly AppSettings _AppSettings;
        private readonly IJWTService _JwtService;
        private readonly IDiscoveryCache _DiscoveryCache;
        private readonly IHttpClientFactory _HttpClientFactory;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly IUserService _UserService;
        private readonly ssbsi.IClassSessionSubscriptionFeatureService _ClassSessionSubscriptionFeatureService;
        private readonly ssbsi.ICompanySubscriptionFeatureService companySubscriptionFeatureService;
        private readonly ssbsi.ITutorSubscriptionFeatureService tutorSubscriptionFeatureService;
        private readonly ssbsi.IClassSessionService classSessionServiceStore;
        private readonly ssbsi.ISessionAttendeeService sessionAttendeeServiceStore;
        private readonly ssbsi.IVendorEarningService vendorEarningService;
        private SubscriptionFeatureSet featureSet = null;

        public SessionsController(ITwilioHelper twilioHelper, ISettingService settingService, IClassSessionService classSessionService
            , ISessionAttendeeService sessionAttendeeService, IHubService hubService, UserManager<Models.User> userManager,
            IOptions<AppSettings> appSettings, IJWTService jWTService, IDiscoveryCache discoveryCache, IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContext, IUserService userService, ssbsi.IClassSessionSubscriptionFeatureService classSessionSubscriptionFeatureService,
            ssbsi.ICompanySubscriptionFeatureService companySubscriptionFeatureService, ssbsi.ITutorSubscriptionFeatureService tutorSubscriptionFeatureService,
            ssbsi.IClassSessionService classSessionServiceStore, ssbsi.ISessionAttendeeService sessionAttendeeServiceStore,
            ssbsi.IVendorEarningService vendorEarningService)
        {
            _TwilioHelper = twilioHelper;
            _SettingService = settingService;
            _ClassSessionService = classSessionService;
            _SessionAttendeeService = sessionAttendeeService;
            _HubService = hubService;
            _UserManager = userManager;
            _AppSettings = appSettings.Value;
            _JwtService = jWTService;
            _DiscoveryCache = discoveryCache;
            _HttpClientFactory = httpClientFactory;
            _HttpContext = httpContext;
            _UserService = userService;
            _ClassSessionSubscriptionFeatureService = classSessionSubscriptionFeatureService;
            this.companySubscriptionFeatureService = companySubscriptionFeatureService;
            this.tutorSubscriptionFeatureService = tutorSubscriptionFeatureService;
            this.classSessionServiceStore = classSessionServiceStore;
            this.sessionAttendeeServiceStore = sessionAttendeeServiceStore;
            this.vendorEarningService = vendorEarningService;
        }

        // id is classSessionId
        public async Task<IActionResult> Main(Guid id, bool devMode = false)
        {
            //my main method
            if (id == Guid.Empty)
            {
                return Redirect(_AppSettings.StoreSiteUrl);
            }
            var accessToken = await HttpContext.GetTokenAsync("access_token");
            var utcExpiryTime = _JwtService.GetExpiryTimestamp(accessToken);
            var remainingLifeTime = Convert.ToInt32(utcExpiryTime.Subtract(DateTime.UtcNow).TotalMinutes);

            //ML 08/06/2020 START
            //if we're cutting it close to the end of the token throw unauth
            if (remainingLifeTime <= 70)
            {
                //definately not the correct way to do this but it will force a relog if they only have 70m on the token remaining.
                //should cover all bases, needs to be done here because we arent refreshing the page after this point.
                //signal r uses token on connect so we cant change it mid page really either.

                await HttpContext.SignOutAsync();

                //could be done in single redirect but i dont want to show devMode unless we're in devMode.
                if (devMode == false)
                    return RedirectToRoute("ClassroomMain", new { id = id });
                else
                    return RedirectToRoute("ClassroomMain", new { id = id, devMode = devMode });


                //FOR FUTURE DEVELOPMENT
                /*
                 * https://github.com/IdentityServer/IdentityServer4
                 * There is a way to get a new token via an access token see ids4 samples MVC Hybrid Client > Home Controller
                 * this will involve changing out the response type in start up, too much work for the time i have at the moment.
                 * We do not have refresh tokens the way we're doing it at the moment.
                 */
            }
            //ML 08/06/2020 END


            ViewBag.AccessToken = accessToken;

            // This setting is just to prevent webcams running (so no charges)
            ViewBag.DevMode = devMode && (_AppSettings.MainSiteUrl.Contains("test") || _AppSettings.MainSiteUrl.Contains("localhost"));

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var session = await _ClassSessionService.GetById(id);
            await LoadClassSessionFeatureSet(session.ClassSessionId);

            var activeAttendees = GetActiveAttendees(session.SessionAttendees);

            // If the user is not part of this session then forbid them entry
            if (session.OwnerId != user.Id && !activeAttendees.Any(x => x.UserId == user.Id))
                return Redirect(_AppSettings.StoreSiteUrl + "/Account/PermissionDenied");

            if (session.RequiresGoogleAccount == true && User.Claims.Any(o => o.Type == "idp" && o.Value.Contains("local")))
            {// they are logged in with a local account but session requires google
                var existingLogins = await _UserService.GetUserLoginInfo(user.Id);
                if (existingLogins.Where(o => o.LoginProvider == "Google").Count() == 0)
                {
                    return Redirect(_AppSettings.IdentitySiteUrl + "/Account/LinkAccount?returnUrl=" + _AppSettings.ClassRoomSiteUrl + "/c/" + id);
                }
                else
                {
                    return Redirect(_AppSettings.IdentitySiteUrl + "/Account/Login?straightToGoogle=true&&returnUrl=" + _AppSettings.ClassRoomSiteUrl + "/c/" + id);
                }
            }

            // Student should respect minutes before entry setting
            if (!IsRespectingMinutesBeforeEntry(user, session))
            {
                return Redirect(_AppSettings.StoreSiteUrl + "/Account/TooEarlyToClass");
            }

            DTO.Hub hub = null;
            if (!session.HubId.HasValue)
            {
                // Assign a hub to this session
                hub = await _HubService.GetHubToUse();
                session.HubId = hub.HubId;
                await _ClassSessionService.Update(session);
            }
            if (!session.Ended && session.DueEndDate.HasValue && session.DueEndDate.Value.AddMinutes(5) < DateTime.Now)
            {
                session.Ended = true;
                session.EndedAtDate = DateTime.Now;
                await _ClassSessionService.Update(session);
            }

            var sessionAttendee = await _SessionAttendeeService.GetByClassSessionAtendeeId(id, user.Id);

            ViewBag.ClassSessionId = session.ClassSessionId;
            ViewBag.UserId = user.Id;
            ViewBag.TutorId = session.OwnerId;
            ViewBag.HubUrl = _HubService.GetDomain(hub == null ? session.Hub.SubDomain : hub.SubDomain);
            ViewBag.StoreSiteUrl = _AppSettings.StoreSiteUrl;

            if (sessionAttendee != null)
            {
                if (!sessionAttendee.Attended)
                {
                    sessionAttendee.Attended = true;
                    sessionAttendee = await _SessionAttendeeService.Update(sessionAttendee);
                }
                ViewBag.SessionAttendeeId = sessionAttendee.SessionAttendeeId;
                ViewBag.GroupId = sessionAttendee.SessionGroupId;
                ViewBag.studentFolderId = sessionAttendee.SessionAttendeeDirectoryId;
            }
            else
            {
                ViewBag.SessionAttendeeId = null;
                ViewBag.GroupId = null;
                ViewBag.studentFolderId = null;
            }

            ViewBag.SessionEnded = session.Ended;

            //if (user.Id == session.OwnerId) //ML 2020-06-19 - removed as it causes issues when a people keep re-arranging classes
            await _ClassSessionService.CopyFilesFromMasterToStudentFolders(user, session, activeAttendees);


            var profile = Mappings.Mapper.Map<Models.User, DTO.UserProfileComponent>(user);
            ViewBag.UserProfileImageUrl = profile.GoogleProfilePicture;
            ViewBag.Initials = profile.Initials;
            ViewBag.ClassSessionSubscriptionFeatures = featureSet;

            return View();
        }

        public async Task<IActionResult> Twilio(Guid id)
        {
            var session = await _ClassSessionService.GetById(id);
            ViewBag.ClassSessionId = session.ClassSessionId;
            return View();
        }

        public async Task<IActionResult> Complete(Guid id)
        {
            var session = await _ClassSessionService.GetById(id);
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            ViewBag.ClassSessionId = session.ClassSessionId;
            ViewBag.SessionName = session.Name;
            var activeAttendees = GetActiveAttendees(session.SessionAttendees);

            var settings = await _SettingService.Get();
            if (User.IsInRole("Tutor"))
            {
                if (await SessionComplete_UpdateEarnings(session, activeAttendees.ToList()))
                {
                    //await vendorEarningService.TransferPendingVendorEarnings(settings);
                    await vendorEarningService.TransferPendingVendorEarnings(settings, id);
                }
            }
            //comment by wizcraft
            //if (User.IsInRole("Tutor") && session.Complete)
            //    return RedirectToRoute("default", new { controller = "Home", action = "Index" });

            if (User.IsInRole("Tutor"))
            {
                if (session.OwnerId != user.Id)
                    return Forbid();
                ViewBag.SessionAttendees = activeAttendees;
                return View("TutorComplete");
            }
            else
            {
                ViewBag.StoreSiteUrl = _AppSettings.StoreSiteUrl;
                return View("Complete", session);
            }
        }

        private async Task<bool> SessionComplete_UpdateEarnings(ClassSession session, List<SessionAttendee> activeAttendees)
        {
            // All Attendees have been updated, nothing to do.
            if (activeAttendees.All(x => x.VendorEarningId.HasValue)) return true;

            VendorType vendorType = VendorType.Tutor;
            if (session.Course != null && session.Course.CompanyId.HasValue)
                vendorType = VendorType.Company;

            await LoadClassSessionFeatureSet(session.ClassSessionId);
            List<DTO.CommissionPerStudentTier> commissionPerStudentTiers = featureSet.ToClassSessionFeatures().Admin_CommissionPerStudent_StudentAttendancePerMonthTiers;
           // var soCut = await sessionAttendeeServiceStore.CalcStandingOutCut(session, session.Owner.TutorId.Value, featureSet.ToClassSessionFeatures().Admin_CommissionPerStudent_StudentAttendancePerMonthTiers);
            await sessionAttendeeServiceStore.UpdateStandingOutCut(session, session.Owner.TutorId.Value,activeAttendees, commissionPerStudentTiers);
          return  await classSessionServiceStore.CreateVendorEarnings(session, vendorType, activeAttendees);
        }


        public async Task<IActionResult> TwilioTest(Guid id)
        {
            var session = await _ClassSessionService.GetById(id);
            ViewBag.ClassSessionId = session.ClassSessionId;
            return View();
        }

        [HttpPost("complete/{id}")]
        [Authorize(Roles = "Tutor")]
        public async Task<IActionResult> Complete(Guid id, DTO.ClassSessionComplete model)
        {
            if (ModelState.IsValid && User.IsInRole("Tutor"))
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);

                await _ClassSessionService.SendCompletionEmail(id, user.Id, model);

                return Redirect(_AppSettings.StoreSiteUrl + "/Tutor");
            }
            else
            {
                var session = await _ClassSessionService.GetById(id);
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                ViewBag.ClassSessionId = session.ClassSessionId;
                ViewBag.SessionName = session.Name;

                if (session.Complete)
                    return RedirectToRoute("default", new { controller = "Home", action = "Index" });

                if (session.OwnerId != user.Id)
                    return Forbid();
                ViewBag.SessionAttendees = session.SessionAttendees;
                return View("TutorComplete", model);
            }
        }

        public async Task<IActionResult> AccountSetupIssue(Guid id)
        {
            ViewBag.ReturnUrl = "https://" + _HttpContext.HttpContext.Request.Host + "/Classroom/Sessions/Main/" + id;
            ViewBag.IdentitySiteUrl = _AppSettings.IdentitySiteUrl;
            return View();
        }

        private async Task LoadClassSessionFeatureSet(Guid classSessionId)
        {
            // 21 Sep changed approach - classSession -> course -> companyId set then get the FeaturesByCompany
            // AND If classSession -> course -> companyId set then get the FeaturesByTutor
            var session = await _ClassSessionService.GetById(classSessionId);
            if (session.Course != null && session.Course.CompanyId.HasValue)
                featureSet = await companySubscriptionFeatureService.GetSubscriptionFeatureSetByCompanyId(
                    session.Course.CompanyId.Value);
            else
                featureSet = await tutorSubscriptionFeatureService.GetSubscriptionFeatureSetByTutorId(
                    session.Owner.TutorId.Value);

            //featureSet = await _ClassSessionSubscriptionFeatureService.GetSubscriptionFeatureSetByClassSessionId(
            //    classSessionId);
        }

        private bool IsRespectingMinutesBeforeEntry(Models.User user, Models.ClassSession session)
        {
            if (session.OwnerId == user.Id) return true; // Tutor can always enter

            var minutesBeforeEntry = featureSet.MinutesBeforeEntry(FeatureArea.Classroom, FeatureContext.ClassroomEntryTime);
            //var minutesToStart = session.StartDate.Subtract(DateTime.UtcNow).TotalMinutes;
            var minutesToStart = session.StartDate.UtcDateTime.Subtract(DateTime.UtcNow).TotalMinutes;

            return (minutesToStart <= minutesBeforeEntry);
        }
        private IList<SessionAttendee> GetActiveAttendees(IList<SessionAttendee> allAttendees) {
            return allAttendees.Where(x => !x.Refunded && !x.Removed && !x.IsDeleted).ToList();
        }
    }
}