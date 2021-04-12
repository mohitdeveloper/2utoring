using System;
using StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using StandingOutStore.Extensions;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Super Admin, Admin")]
    [CompanyBaseAuth]
    [ValidatePlan]

    public class TutorsController : Controller
    {
        private readonly ITutorService _TutorService;
        private readonly ITutorCertificateService _TutorCertificateService;
        private readonly IStripePlanService _StripePlanService;

        public TutorsController(ITutorService tutorService, IStripePlanService stripePlanService, ITutorCertificateService tutorCertificateService)
        {
            _TutorService = tutorService;
            _TutorCertificateService = tutorCertificateService;
            _StripePlanService = stripePlanService;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> Details(Guid id)
        {
            var model = await _TutorService.GetById(id);

            if (model == null)
                return RedirectToAction("Index");

            ViewBag.TutorId = id;
            return View();
        }

        public async Task<IActionResult> DownloadDBS(Guid id)
        {
            var tutor = await _TutorService.GetById(id);
            var model = await _TutorService.GetDbsFile(id);
            return File(model, "application/octect-stream", tutor.DbsCertificateFileName);
        }

        public async Task<IActionResult> DownloadCertificate(Guid id)
        {
            var tutor = await _TutorCertificateService.GetById(id);
            var model = await _TutorCertificateService.GetFile(id);
            return File(model, "application/octect-stream", tutor.CertificateFileName);
        }
    }
}
