using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;
using StandingOut.Data.Enums;

namespace StandingOutStore.Controllers
{
    public class TutorsController : Controller
    {
        private readonly ITutorService _TutorService;
        private readonly UserManager<StandingOut.Data.Models.User> _UserManager;
        public TutorsController(ITutorService tutorService, UserManager<StandingOut.Data.Models.User> userManager)
        {
            _TutorService = tutorService;
            _UserManager = userManager;
        }

        // Route is tutor/{urlSlug} (see startup.cs)
        //public async Task<IActionResult> View(string urlSlug)
        //{
        //    var tutor = await _TutorService.GetByUrlSlug(urlSlug);
        //    if (tutor != null)
        //    {
        //        ViewBag.TutorId = tutor.TutorId;
        //        return View();
        //    } else
        //    {
        //        return NotFound();
        //    }
        //}
        public async Task<IActionResult> View(Guid id)
        {
            var tutor = await _TutorService.GetById(id);
            if (!User.Identity.IsAuthenticated)
            {

                if (tutor.ProfileApprovalStatus == TutorApprovalStatus.Approved)
                {
                    ViewBag.TutorId = id;
                    return View();
                }
                else
                {
                    ViewBag.TutorId = null;
                    return RedirectToRoute("Default", new { controller = "Home", action = "Index" });
                }
            }
            else
            {
                
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                var isAdmin = await _UserManager.IsInRoleAsync(user, "Admin");
                var isSuperAdmin = await _UserManager.IsInRoleAsync(user, "Super Admin");
                var company = _TutorService.GetTutorCompany(tutor.TutorId);
                if (user.TutorId == tutor.TutorId ||(company!=null && isAdmin)||isSuperAdmin)
                {
                    ViewBag.TutorId = id;
                    return View();
                }
                else if (tutor.ProfileApprovalStatus == TutorApprovalStatus.Approved && user.TutorId != tutor.TutorId)
                {
                    ViewBag.TutorId = id;
                    return View();
                }
                else
                {
                    ViewBag.TutorId = null;
                    return RedirectToRoute("Default", new { controller = "Home", action = "Index" });
                }


            }





            //var tutor = await _TutorService.GetById(id);
            //if (tutor != null)
            //{
            //    ViewBag.TutorId = tutor.TutorId;
            //    return View();
            //}
            //else
            //{
            //    return NotFound();
            //}
        }

        public async Task<IActionResult> OverView()
        {
            return View();
        }
        public async Task<IActionResult> HowItWorks()
        {
            return View();
        }
        public async Task<IActionResult> JoinAsTutor()
        {
            return View();
        }


    }
}
