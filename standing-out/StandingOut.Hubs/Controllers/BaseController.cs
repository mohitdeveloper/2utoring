using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace StandingOut.Hubs.Controllers
{
    [EnableCors("AllowAll")]
    [ProducesResponseType(typeof(ModelStateDictionary), 400)]
    public class BaseController : Controller
    {
    }
}
