using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using ssbsi = StandingOutStore.Business.Services.Interfaces;
using Models = StandingOut.Data.Models;

namespace StandingOut.Controllers
{
    [Route("Organisations")]
    public class OrganisationsController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ssbsi.ICompanyService _CompanyService;

        public OrganisationsController(UserManager<Models.User> userManager, ssbsi.ICompanyService companyService)
        {
            _UserManager = userManager;
            _CompanyService = companyService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> View(Guid id)
        {
            return RedirectPermanent("https://www.2utoring.com");
            var company = await _CompanyService.GetProfileById(id);
            return View(company);
        }


        [HttpGet("DownloadImage/{id}")]
        public async Task<IActionResult> DownloadImage(Guid id, string imageName = null)
        {
            return RedirectPermanent("https://www.2utoring.com");
            if (string.IsNullOrWhiteSpace(imageName))
            {
                var company = await _CompanyService.GetById(id);
                var fileStream = System.IO.File.Open(company.ImageDirectory + company.ImageName, System.IO.FileMode.Open);
                return File(fileStream, "application/octect-stream", company.ImageName);
            }
            else
            {
                var fileStream = System.IO.File.Open("wwwroot/app_data/company/" + id + imageName, System.IO.FileMode.Open);
                return File(fileStream, "application/octect-stream", imageName);
            }
        }
    }
}
