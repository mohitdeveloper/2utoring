using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;
using System.Threading.Tasks;

namespace StandingOutStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize]
    [CompanyBaseAuth(true)]
    [ValidatePlan]
    public class EarningsController : Controller
    {
        private readonly ICompanyService _companyService;

        public EarningsController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Company Earnings";
            return View();
        }
    }
}