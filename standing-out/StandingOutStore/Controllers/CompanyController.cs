using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Data.Enums;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace StandingOutStore.Controllers
{
    public class CompanyController : Controller
    {
        private readonly ICompanyService _CompanyService;
        private readonly UserManager<StandingOut.Data.Models.User> _UserManager;
        public CompanyController(ICompanyService companyService, UserManager<StandingOut.Data.Models.User> userManager)
        {
            _CompanyService = companyService;
            _UserManager = userManager;
        }

        // Route is company/{urlslug} (see startup.cs)
        //public async Task<IActionResult> View(string urlSlug)
        //{
        //    var company = await _CompanyService.GetByUrlSlug(urlSlug);
        //    if (company != null)
        //    {
        //        ViewBag.CompanyId = company.CompanyId;
        //        return View();
        //    } else
        //    {
        //        return NotFound();
        //    }
        //}
        public async Task<IActionResult> View(Guid id)
        {
            var company = await _CompanyService.GetById(id);
            if (!User.Identity.IsAuthenticated)
            {

                if (company.ProfileApprovalStatus == TutorApprovalStatus.Approved)
                {
                    ViewBag.CompanyId = id;
                    return View();
                }
                else
                {
                    ViewBag.CompanyId = null;
                    return RedirectToRoute("Default", new { controller = "Home", action = "Index" });
                }
            }
            else
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                if (user.Id == company.AdminUserId)
                {
                    ViewBag.CompanyId = id;
                    return View();
                }
                else if (company.ProfileApprovalStatus == TutorApprovalStatus.Approved && user.Id != company.AdminUserId)
                {
                    ViewBag.CompanyId = id;
                    return View();
                }
                else
                {
                    ViewBag.CompanyId = null;
                    return RedirectToRoute("Default", new { controller = "Home", action = "Index" });
                }


            }

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
