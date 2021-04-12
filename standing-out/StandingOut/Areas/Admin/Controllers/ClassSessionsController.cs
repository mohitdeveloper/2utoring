using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Helpers.Twilio;
using StandingOut.Business.Services.Interfaces;
using Models = StandingOut.Data.Models;

namespace StandingOut.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    public class ClassSessionsController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;
        private readonly IClassSessionService _ClassSessionService;
        private readonly ISettingService _SettingService;
        private readonly ITwilioHelper _TwilioHelper;
        private readonly IClassSessionVideoRoomService _ClassSessionVideoRoomService;

        public ClassSessionsController(UserManager<Models.User> userManager, RoleManager<IdentityRole> roleManager, IClassSessionService classSessionService, ITwilioHelper twilioHelper, ISettingService settingService, IClassSessionVideoRoomService classSessionVideoRoomService)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
            _ClassSessionService = classSessionService;
            _TwilioHelper = twilioHelper;
            _SettingService = settingService;
            _ClassSessionVideoRoomService = classSessionVideoRoomService;
        }


        public async Task<IActionResult> Index()
        {
            return RedirectPermanent("https://www.2utoring.com");
            var sessions = await _ClassSessionService.Get();
            return View(sessions);
        }

        public async Task<IActionResult> Rooms(Guid id)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var data = await _ClassSessionVideoRoomService.Get(id);
            var classSession = await _ClassSessionService.GetById(id);
            ViewBag.ClassSessionOwnerId = classSession.OwnerId;
            ViewBag.ClassSessionName = classSession.Name;
            return View(data);
        }

        public async Task<IActionResult> DownloadMedia(Guid id, string type)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var settings = await _SettingService.Get();
            var classSessionVideoRoom = await _ClassSessionVideoRoomService.GetById(id);
            var downloadurl = _TwilioHelper.GetDownload(settings.TwilioAccountSid, settings.TwilioAuthToken, settings.TwilioApiKey, settings.TwilioApiSecret, classSessionVideoRoom.RoomSid, classSessionVideoRoom.ParticipantSid, type);

            if (string.IsNullOrEmpty(downloadurl))
            {
                return RedirectToAction("Rooms", new { id = classSessionVideoRoom.ClassSessionId });
            }

            return Redirect(downloadurl);
        }

        public async Task<IActionResult> GenerateComposition(Guid id)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var settings = await _SettingService.Get();
            var classSessionVideoRoom = await _ClassSessionVideoRoomService.GetById(id);
            var compositionId = _TwilioHelper.GenerateComposition(settings.TwilioAccountSid, settings.TwilioAuthToken, settings.TwilioApiKey, settings.TwilioApiSecret, classSessionVideoRoom.RoomSid, classSessionVideoRoom.ParticipantSid);

            classSessionVideoRoom.CompositionSid = compositionId;
            await _ClassSessionVideoRoomService.Update(classSessionVideoRoom);

            return RedirectToAction("Rooms", new { id = classSessionVideoRoom.ClassSessionId });
        }
    }

}