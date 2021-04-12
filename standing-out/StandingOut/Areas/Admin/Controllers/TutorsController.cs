using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using StandingOut.Business.Services.Interfaces;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Business.Helpers.AcuityScheduling;
using StandingOut.Shared.Mapping;
using System.Collections.Generic;

namespace StandingOut.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    public class TutorsController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly RoleManager<IdentityRole> _RoleManager;
        private readonly ITutorService _TutorService;
        private readonly IAcuitySchedulingHelper _AcuitySchedulingHelper;
        private readonly IClassSessionService _ClassSessionService;

        public TutorsController(UserManager<Models.User> userManager, RoleManager<IdentityRole> roleManager, ITutorService tutorService, IAcuitySchedulingHelper acuitySchedulingHelper, IClassSessionService classSessionService)
        {
            _UserManager = userManager;
            _RoleManager = roleManager;
            _TutorService = tutorService;
            _AcuitySchedulingHelper = acuitySchedulingHelper;
            _ClassSessionService = classSessionService;
        }


        public async Task<IActionResult> Index()
        {
            return RedirectPermanent("https://www.2utoring.com");
            var tutors = _UserManager.Users.Where(o => o.TutorId != null && o.IsDeleted == false).ToList();
            return View(tutors);
        }


        public async Task<IActionResult> Create()
        {
            return RedirectPermanent("https://www.2utoring.com");
            await SetupViewBag();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(DTO.CreateTutor model)
        {
            return RedirectPermanent("https://www.2utoring.com");
            if (ModelState.IsValid)
            {
                await _TutorService.Create(model);
                return RedirectToAction("Index");
            }
            await SetupViewBag(model.UserId, model.CalendarId);
            return View(model);
        }

        public async Task<IActionResult> Edit(string id)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var user = await _UserManager.FindByIdAsync(id);
            var tutor = await _TutorService.GetById(user.TutorId.Value);
            var tutorSessions = await _ClassSessionService.GetByTutor(id);
            var data = new DTO.EditTutor() { UserId = id, TutorId = tutor.TutorId, CalendarId = tutor.CalendarId, Email = user.Email, Header = tutor.Header, SubHeader = tutor.SubHeader, Biography = tutor.Biography, TutorSessions = Mappings.Mapper.Map<List<Models.ClassSession>, List<DTO.ClassSession>>(tutorSessions) };

            await SetupViewBag(id, tutor.CalendarId);

            return View(data);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(DTO.EditTutor model)
        {
            return RedirectPermanent("https://www.2utoring.com");
            if (ModelState.IsValid)
            {
                await _TutorService.Update(model);
                return RedirectToAction("Index");
            }

            var tutorSessions = await _ClassSessionService.GetByTutor(model.UserId);
            model.TutorSessions = Mappings.Mapper.Map<List<Models.ClassSession>, List<DTO.ClassSession>>(tutorSessions);
            await SetupViewBag(model.UserId, model.CalendarId);
            return View(model);
        }

        public async Task<IActionResult> Delete(string id)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var user = await _UserManager.FindByIdAsync(id);
            return View(user);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> ConfirmDelete(string id)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var user = await _UserManager.FindByIdAsync(id);
            await _TutorService.Delete(user);
            return RedirectToAction("Index");
        }

        private async Task SetupViewBag(string userId = null, int? calendarId = null)
        {
            var calendars = await _AcuitySchedulingHelper.GetCalendars();
            var tutors = await _TutorService.Get();

            ViewBag.UserId = new SelectList(userId == null ? 
                _UserManager.Users.Where(o => o.TutorId == null && o.IsDeleted == false && !o.IsParent)
                    .OrderBy(x => x.Email)
                    .ToList() : 
                _UserManager.Users.Where(o => (o.TutorId == null || o.Id == userId) && o.IsDeleted == false && !o.IsParent)
                    .OrderBy(x => x.Email)
                    .ToList(), 
                "Id", "Email", userId);
            ViewBag.CalendarId = new SelectList(calendarId == null ? 
                calendars.Where(x => !tutors.Any(y => y.CalendarId == x.Id)).OrderBy(x => x.Name).ToList() : 
                calendars.Where(x => calendarId == x.Id || !tutors.Any(y => y.CalendarId == x.Id)).ToList(), 
                "Id", "Name", calendarId);
        }
    }

}