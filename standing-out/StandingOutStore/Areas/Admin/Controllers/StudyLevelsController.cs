using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]

    [ValidatePlan]
    public class StudyLevelsController : Controller
    {
        private readonly IStudyLevelService _StudyLevelService;


        public StudyLevelsController(IStudyLevelService studyLevelService)
        {
            _StudyLevelService = studyLevelService;

        }

        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> Create()
        {
			await SetupViewBags();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Models.StudyLevel model)
        {
            if (ModelState.IsValid)
            {
                model = await _StudyLevelService.Create(model);
                return RedirectToAction("Index");
            }
			await SetupViewBags();
            return View(model);
        }

        public async Task<IActionResult> Edit(Guid id)
        {
            var model = await _StudyLevelService.GetById(id);
			await SetupViewBags();
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Models.StudyLevel model)
        {
            if (ModelState.IsValid)
            {
                await _StudyLevelService.Update(model);
                return RedirectToAction("Index");
            }

			await SetupViewBags();
            return View(model);
        }

        public async Task<IActionResult> Delete(Guid id)
        {
            var studyLevels = await _StudyLevelService.GetById(id);
            return View(studyLevels);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            await _StudyLevelService.Delete(id);
            return RedirectToAction("Index");
        }

		private async Task SetupViewBags()
		{
			
		}
    }
}
