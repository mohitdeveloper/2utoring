using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Identity;
using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Shared.Helpers.Twilio;
using StandingOutStore.Extensions;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    [CompanyBaseAuth]
    [ValidatePlan]
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
            return View();
        }

        public async Task<IActionResult> Details(Guid id)
        {
            var classSession = await _ClassSessionService.GetById(id);
            return View(classSession);
        }

        public async Task<IActionResult> DownloadMedia(Guid id, string type)
        {
            var settings = await _SettingService.Get();
            var classSessionVideoRoom = await _ClassSessionVideoRoomService.GetById(id);
            var downloadurl = _TwilioHelper.GetDownload(settings.TwilioAccountSid, settings.TwilioAuthToken, settings.TwilioApiKey, settings.TwilioApiSecret, classSessionVideoRoom.RoomSid, classSessionVideoRoom.ParticipantSid, type);

            if (string.IsNullOrEmpty(downloadurl))
            {
                return RedirectToAction("Details", new { id = classSessionVideoRoom.ClassSessionId });
            }

            return Redirect(downloadurl);
        }

        public async Task<IActionResult> GenerateComposition(Guid id)
        {
            var settings = await _SettingService.Get();
            var classSessionVideoRoom = await _ClassSessionVideoRoomService.GetById(id);
            var compositionId = _TwilioHelper.GenerateComposition(settings.TwilioAccountSid, settings.TwilioAuthToken, settings.TwilioApiKey, settings.TwilioApiSecret, classSessionVideoRoom.RoomSid, classSessionVideoRoom.ParticipantSid);

            classSessionVideoRoom.CompositionSid = compositionId;
            await _ClassSessionVideoRoomService.Update(classSessionVideoRoom);

            return RedirectToAction("Details", new { id = classSessionVideoRoom.ClassSessionId });
        }

        public async Task<IActionResult> DownloadComposition(Guid id, string compositionSid)
        {
            var settings = await _SettingService.Get();
            var classSessionVideoRoom = await _ClassSessionVideoRoomService.GetById(id);
            var composition = _TwilioHelper.DownloadComposition(settings.TwilioAccountSid, settings.TwilioAuthToken, settings.TwilioApiKey, settings.TwilioApiSecret, compositionSid);

            if (composition == null)
            {
                return RedirectToAction("Details", new { id = classSessionVideoRoom.ClassSessionId });
            } else
            {
                return File(composition, "video/mp4", "download.mp4");
            }
        }
    }

}