using System;
using StoreBusiness = StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Threading.Tasks;
using ssbsi = StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data.DTO;
using StandingOut.Data.Enums;
using StandingOut.Shared.Mapping;
using StandingOutStore.Extensions;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    //[Authorize(Roles = "Super Admin, Admin, Tutor")]
    // [CompanyBaseAuth] Cant apply at controller level as it includes tutor methods too
    [ValidatePlan]
    public class PricesController : NewBaseController
    {
        private readonly StoreBusiness.ITutorService _TutorService;
        private readonly ssbsi.ICompanyService _CompanyService;
        private readonly StoreBusiness.ISubjectService _SubjectService;
        private readonly StoreBusiness.IStudyLevelService _StudyLevelService;
        private readonly StoreBusiness.ISubjectStudyLevelSetupService _SubjectStudyLevelSetupService;

        public PricesController(
            StoreBusiness.ITutorService tutorService,
            ssbsi.ICompanyService companyService,
            StoreBusiness.ISubjectService subjectService,
            StoreBusiness.IStudyLevelService studyLevelService,
            StoreBusiness.ISubjectStudyLevelSetupService subjectStudyLevelSetupService,
            IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
            : base(userManager, appSettings, companyService)
        {
            _TutorService = tutorService;
            _CompanyService = companyService;
            _SubjectService = subjectService;
            _StudyLevelService = studyLevelService;
            _SubjectStudyLevelSetupService = subjectStudyLevelSetupService;
        }

        [Authorize(Roles = "Admin, Tutor")]
        public async Task<IActionResult> Index()
        {
            if (Caller.IsTutor && Caller.CurrentUser?.TutorId != null)
                return RedirectToAction("TutorIndex", new { entityId = Caller.CurrentUser.TutorId.Value });
            else
            {
                var company = Caller.CurrentUserCompany; //await _CompanyService.GetByAdminUser(Caller.CurrentUser);
                return RedirectToAction("CompanyIndex", new { entityId = company.CompanyId });
            }
        }

        /// <summary>
        /// SuperAdmin - Any Company Subject - Study Level prices (setup)
        /// Route = admin/prices/{companyId?}
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        [Authorize(Roles = "Super Admin, Admin")]
        [Route("admin/{entityId}/company/prices")]
        [CompanyBaseAuth]
        public async Task<IActionResult> CompanyIndex(Guid entityId)
        {
            Models.Company modelCompany1;
            if (Caller.IsSuperAdmin)
                modelCompany1 = await _CompanyService.GetById(entityId); // Admin wont have company 
            else
            {
                modelCompany1 = Caller.CurrentUserCompany;
                if (modelCompany1 == null || modelCompany1.CompanyId != entityId)
                    return new RedirectToActionResult("Forbidden", "Home", new { area = "" });
            }

            ViewData["SetupType"] = SubjectStudyLevelSetupType.Company;
            ViewData["TutorId"] = null;
            ViewData["CompanyId"] = modelCompany1.CompanyId;

            return View("Index");
        }

        [TutorBaseAuth(AllowSuperAdmin: true)]
        [Authorize]
        [Route("admin/{entityId}/tutor/prices")]
        public async Task<IActionResult> TutorIndex(Guid entityId)
        {
            Models.Tutor modelTutor1;
            if (RouteData.DataTokens.TryGetValue("modelTutor", out var modelTutor))
            {
                modelTutor1 = modelTutor as Models.Tutor;
                if (modelTutor1 == null || modelTutor1.TutorId != entityId)
                    return new RedirectToActionResult("Forbidden", "Home", new { area = "" });
            }
            else
            {
                modelTutor1 = await _TutorService.GetById(entityId);
            }

            ViewData["SetupType"] = SubjectStudyLevelSetupType.Tutor;
            ViewData["TutorId"] = modelTutor1.TutorId;
            ViewData["CompanyId"] = null;

            return View("Index");
        }

        [Route("admin/{entityId}/{setupTypeString}/prices/create")]
        [Authorize(Roles = "Super Admin, Admin, Tutor")]
        public async Task<IActionResult> Create(Guid entityId, string setupTypeString)
        {
            var model = (setupTypeString.ToLowerInvariant() == "tutor")
                ? CreateTutorDto(entityId)
                : CreateCompanyDto(entityId);

            ViewData["IndexUrl"] = GetIndexUrl(setupTypeString, entityId);
            await SetupViewBags();
            return View(model);
        }

        [Route("admin/prices/create")]
        [HttpPost]
        [Authorize(Roles = "Super Admin, Admin, Tutor")]
        public async Task<IActionResult> Create(SubjectStudyLevelSetup model)
        {

            if (ModelState.IsValid)
            {
                var dataModel = Mappings.Mapper.Map<Models.SubjectStudyLevelSetup>(model);
                dataModel = await _SubjectStudyLevelSetupService.Create(dataModel);
                if (dataModel.SubjectStudyLevelSetupId != Guid.Empty) // success
                {
                    return GotoPricingIndex(model.SubjectStudyLevelSetupType.ToString(), model.OwningEntityId);
                }
                else
                {
                    ModelState.AddModelError("", "Sorry, unable to create that price with the selected Subject and Study Level. Please try a different set");
                }
            }
            ViewData["IndexUrl"] = GetIndexUrl(model.SubjectStudyLevelSetupType.ToString(), model.OwningEntityId);
            await SetupViewBags(model.SubjectId, model.StudyLevelId);
            return View(model);
        }

        [Route("admin/{setupTypeString}/prices/edit/{id}")]
        public async Task<IActionResult> Edit(Guid id, string setupTypeString)
        {
            var dataModel = await _SubjectStudyLevelSetupService.GetById(id, "Subject, StudyLevel");
            var model = Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, SubjectStudyLevelSetup>(dataModel);
            //await SetupViewBags(model.SubjectId);
            ViewData["IndexUrl"] = GetIndexUrl(setupTypeString, model.OwningEntityId);
            return View(model);
        }

        [HttpPost]
        [Route("admin/prices/edit")]
        [Authorize(Roles = "Super Admin, Admin, Tutor")]
        public async Task<IActionResult> Edit(SubjectStudyLevelSetup model)
        {
            if (ModelState.IsValid)
            {
                var dataModel = Mappings.Mapper.Map<SubjectStudyLevelSetup, Models.SubjectStudyLevelSetup>(model);
                await _SubjectStudyLevelSetupService.Update(dataModel);
                return GotoPricingIndex(model.SubjectStudyLevelSetupType.ToString(), model.OwningEntityId);
            }
            else
            {
                ModelState.AddModelError("", "Sorry, unable to save that price. Please try again");
            }
            ViewData["IndexUrl"] = GetIndexUrl(model.SubjectStudyLevelSetupType.ToString(), model.OwningEntityId);
            //await SetupViewBags(model.SubjectId);
            return View(model);
        }


        [Route("admin/{setupTypeString}/prices/delete/{id}")]
        public async Task<IActionResult> Delete(Guid id, string setupTypeString)
        {
            SubjectStudyLevelSetup model = null;
            var dataModel = await _SubjectStudyLevelSetupService.GetById(id);
            if (dataModel != null)
                model = Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, SubjectStudyLevelSetup>(dataModel);

            ViewData["IndexUrl"] = GetIndexUrl(setupTypeString, model.OwningEntityId);
            return View(model);
        }

        [Route("admin/prices/delete")]
        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(SubjectStudyLevelSetup model)
        {
            if (ModelState.IsValid)
            {
                await _SubjectStudyLevelSetupService.Delete(model.SubjectStudyLevelSetupId);
            }
            else
            {
                ModelState.AddModelError("", "Sorry, unable to delete that price. Please try again");
            }

            ViewData["IndexUrl"] = GetIndexUrl(model.SubjectStudyLevelSetupType.ToString(), model.OwningEntityId);
            return GotoPricingIndex(model.SubjectStudyLevelSetupType.ToString(), model.OwningEntityId);
        }

        private RedirectToActionResult GotoPricingIndex(string setupTypeString, Guid entityId)
        {
            var actionName = (setupTypeString.ToLowerInvariant() == "tutor")
                ? "TutorIndex"
                : "CompanyIndex";
            return RedirectToAction(actionName, new { entityId });
        }

        private string GetIndexUrl(string setupTypeString, Guid entityId)
        {
            var actionName = (setupTypeString.ToLowerInvariant() == "tutor")
                ? "TutorIndex"
                : "CompanyIndex";

            var indexUrl = Url.Action(actionName, new { entityId });
            return indexUrl;
        }

        private SubjectStudyLevelSetup CreateTutorDto(Guid owningEntityId)
        {
            return new SubjectStudyLevelSetup
            {
                SubjectStudyLevelSetupType = SubjectStudyLevelSetupType.Tutor,
                OwningEntityId = owningEntityId
            };
        }
        private SubjectStudyLevelSetup CreateCompanyDto(Guid owningEntityId)
        {
            return new SubjectStudyLevelSetup
            {
                SubjectStudyLevelSetupType = SubjectStudyLevelSetupType.Company,
                OwningEntityId = owningEntityId
            };
        }

        private async Task SetupViewBags(Guid? SubjectId = null, Guid? StudyLevelId = null)
        {
            ViewBag.SubjectId = new SelectList(await _SubjectService.Get(), "SubjectId", "Name", SubjectId);
            ViewBag.StudyLevelId = new SelectList(await _StudyLevelService.Get(), "StudyLevelId", "Name", StudyLevelId);
        }
    }
}
