using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;
using System.Threading.Tasks;

namespace StandingOutStore.Areas.Tutor.Controllers
{
    [TutorBaseAuth]
    [Area("Tutor")]
    [Authorize]
    [ValidatePlan]

    public class EarningsController : Controller
    {
        private readonly ITutorService _TutorService;

        public EarningsController(ITutorService tutorService)
        {
            _TutorService = tutorService;
        }
        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Tutor Earnings";
            return View();
        }
    }
}