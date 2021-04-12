using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using Models = StandingOut.Data.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using StandingOut.Business.Helpers.AcuityScheduling;

namespace StandingOut.Controllers
{
    [Route("Tutors")]
    public class TutorsController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutorService _TutorService;
        private readonly ISettingService _SettingService;
        private readonly IAcuitySchedulingHelper _AcuitySchedulingHelper;

        public TutorsController(UserManager<Models.User> userManager, ITutorService tutorService, IAcuitySchedulingHelper acuitySchedulingHelper, ISettingService settingService)
        {
            _UserManager = userManager;
            _TutorService = tutorService;
            _AcuitySchedulingHelper = acuitySchedulingHelper;
            _SettingService = settingService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> View(Guid id)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var settings = await _SettingService.Get();
            ViewBag.AcuityId = settings.AcuitySchedulingUserId;
            var tutor = await _TutorService.GetProfileById(id);
            return View(tutor);
        }

        [HttpGet("DownloadImage/{id}")]
        public async Task<IActionResult> DownloadImage(Guid id, string imageName = null)
        {
            return RedirectPermanent("https://www.2utoring.com");
            if (string.IsNullOrWhiteSpace(imageName))
            {
                var tutor = await _TutorService.GetById(id);
                //var fileStream = System.IO.File.Open(tutor.ImageDirectory + tutor.ImageName, System.IO.FileMode.Open);
                //return File(fileStream, "application/octect-stream", tutor.ImageName);
                return null;
            }
            else
            {
                var fileStream = System.IO.File.Open("wwwroot/app_data/tutor/" + id + imageName, System.IO.FileMode.Open);
                return File(fileStream, "application/octect-stream", imageName);
            }
        }

        private async Task SetupViewBag(string userId = null, int? calendarId = null)
        {
            var calendars = await _AcuitySchedulingHelper.GetCalendars();
            var tutors = await _TutorService.Get();

            ViewBag.UserId = new SelectList(_UserManager.Users.Where(o => o.TutorId == null && o.IsDeleted == false).ToList(), "Id", "Email", userId);
            ViewBag.CalendarId = new SelectList(calendars, "Id", "Name", calendarId);
        }
    }
}
