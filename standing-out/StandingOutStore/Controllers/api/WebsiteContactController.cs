using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using StandingOutStore.Extensions;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using System.Linq;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
namespace StandingOutStore.Controllers.api
{
    [Produces("application/json")]
    [Route("api/WebsiteContact")]
    public class WebsiteContactController : Controller
    {
        private readonly IWebsiteContactService _WebsiteContactService;
        private IWebHostEnvironment _hostingEnvironment;
        public WebsiteContactController(IWebsiteContactService websiteContactService, IWebHostEnvironment environment)
        {
            _WebsiteContactService = websiteContactService;
            _hostingEnvironment = environment;


        }
        [HttpPost("createContact")]
        [ProducesResponseType(typeof(DTO.WebsiteContact), 200)]
        public async Task<IActionResult> CreateContact([FromBody] DTO.WebsiteContact model)
        {
            var newModel = await _WebsiteContactService.Create(Mappings.Mapper.Map<DTO.WebsiteContact, Models.WebsiteContact>(model));
            //var returnModel = Mappings.Mapper.Map<Models.WebsiteContact, DTO.WebsiteContact>(newModel);
            return Ok(newModel);
        }
    }
}
