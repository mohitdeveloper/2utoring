using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace StandingOutStore.Extensions
{
    [ProducesResponseType(typeof(ModelStateDictionary), 400)]
    public class BaseController : Controller
    {
    }
}
