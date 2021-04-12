using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace StandingOutStore.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Playground")]
    public class PlaygroundController : Controller
    {
        [HttpPost("Upload")]
        public IActionResult Upload(ICollection<IFormFile> file)
        {
            var request = Request;


            return Ok();
        }
    }
}