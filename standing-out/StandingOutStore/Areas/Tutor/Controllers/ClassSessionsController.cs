using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;
using System;
using System.Threading.Tasks;

namespace StandingOutStore.Areas.Tutor.Controllers
{
    [TutorBaseAuth]
    [Area("Tutor")]
    [Authorize]
    [ValidatePlan]

    public class ClassSessionsController : Controller
    {
        private readonly ITutorService _TutorService;
        private readonly IClassSessionService _ClassSessionService;

        public ClassSessionsController(ITutorService tutorService, IClassSessionService classSessionService)
        {
            _TutorService = tutorService;
            _ClassSessionService = classSessionService;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Tutor Dash";
            return View();
        }

        public async Task<IActionResult> Create()
        {
            return View();
        }

        public async Task<IActionResult> Edit(Guid id)
        {
            ViewBag.ClassSessionId = id;
            return View();
        }

        public async Task<IActionResult> SetupMaterial(Guid id)
        {
            ViewBag.ClassSessionId = id;
            return View();
        }

        public async Task<IActionResult> SetupStudents(Guid id)
        {
            ViewBag.ClassSessionId = id;
            return View();
        }

        public async Task<IActionResult> ClassRegister(Guid id)
        {
            ViewBag.ClassSessionId = id;
            return View();
        }

        public async Task<IActionResult> Delete(Guid id)
        {
            var classSession = await _ClassSessionService.GetById(id);
            return View(classSession);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            await _ClassSessionService.Delete(id);
            return RedirectToAction("Index");
        }
    }
}