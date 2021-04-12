using System;
using StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Threading.Tasks;
using StandingOutStore.Extensions;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    [ValidatePlan]

    public class SubjectCategoriesController : Controller
    {
        private readonly ISubjectCategoryService _SubjectCategoryService;
        private readonly ISubjectService _SubjectService;


        public SubjectCategoriesController(ISubjectCategoryService subjectCategoryService, ISubjectService subjectService)
        {
            _SubjectCategoryService = subjectCategoryService;
            _SubjectService = subjectService;

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
        public async Task<IActionResult> Create(Models.SubjectCategory model)
        {
            if (ModelState.IsValid)
            {
                model = await _SubjectCategoryService.Create(model);
                return RedirectToAction("Index");
            }
            await SetupViewBags(model.SubjectId);
            return View(model);
        }

        public async Task<IActionResult> Edit(Guid id)
        {
            var model = await _SubjectCategoryService.GetById(id);
            await SetupViewBags(model.SubjectId);
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Models.SubjectCategory model)
        {
            if (ModelState.IsValid)
            {
                await _SubjectCategoryService.Update(model);
                return RedirectToAction("Index");
            }

            await SetupViewBags(model.SubjectId);
            return View(model);
        }

        public async Task<IActionResult> Delete(Guid id)
        {
            var subjectCategories = await _SubjectCategoryService.GetById(id);
            return View(subjectCategories);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            await _SubjectCategoryService.Delete(id);
            return RedirectToAction("Index");
        }

        private async Task SetupViewBags(Guid? SubjectId = null)
        {
            ViewBag.SubjectId = new SelectList(await _SubjectService.Get(), "SubjectId", "Name", SubjectId);

        }
    }
}
