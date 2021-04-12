using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace StandingOut.Extensions
{
    [ProducesResponseType(typeof(ModelStateDictionary), 400)]
    public class BaseController : Controller
    {
    }
}
