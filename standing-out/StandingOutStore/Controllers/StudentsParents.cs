using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;
using StandingOut.Data.Enums;

namespace StandingOutStore.Controllers
{
    public class StudentsParentsController : Controller
    {

        private readonly ITutorService _TutorService;
        private readonly UserManager<StandingOut.Data.Models.User> _UserManager;
        public StudentsParentsController(UserManager<StandingOut.Data.Models.User> userManager)
        {
            
            _UserManager = userManager;
        }
        public async Task<IActionResult> OverView()
        {
            return View();
        }
        public async Task<IActionResult> HowItWorks()
        {
            return View();
        }

    }
}
