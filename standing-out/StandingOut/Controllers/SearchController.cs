using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;
using Models = StandingOut.Data.Models;

namespace StandingOut.Controllers
{
    [Route("Search")]
    public class SearchController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IClassSessionService _ClassSessionService;

        public SearchController(UserManager<Models.User> userManager, IClassSessionService classSessionService)
        {
            _UserManager = userManager;
            _ClassSessionService = classSessionService;
        }
        
        [HttpGet("{type?}")]
        public async Task<IActionResult> Index(string type, string term)
        {
            return RedirectPermanent("https://www.2utoring.com");
            ViewBag.SearchTerm = term != null ? HttpUtility.UrlDecode(term).ToLower() : term;
            ViewBag.Filter = type != null ? type.ToLower() : "";
            return View("Index");
        }
    }
}
