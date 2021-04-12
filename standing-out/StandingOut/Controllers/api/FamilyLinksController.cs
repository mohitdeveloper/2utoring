//using System;
//using System.Collections.Generic;
//using StandingOut.Business.Services.Interfaces;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Models = StandingOut.Data.Models;
//using DTO = StandingOut.Data.DTO;
//using StandingOut.Shared.Mapping;
//using StandingOut.Extensions;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Http;
//using System.Linq;

//namespace StandingOut.Controllers.api
//{
//    [Authorize]
//    [Produces("application/json")]
//    [Route("api/FamilyLinks")]
//    public class FamilyLinksController : BaseController
//    {
//        private readonly IFamilyLinkService _FamilyLinkService;
//        private readonly UserManager<Models.User> _UserManager;

//        public FamilyLinksController(IFamilyLinkService familyLinkService, UserManager<Models.User> userManager)
//        {
//            _FamilyLinkService = familyLinkService;
//            _UserManager = userManager;
//        }
        
//        [HttpGet("")]
//        [ProducesResponseType(typeof(IEnumerable<DTO.FamilyLink>), 200)]
//        public async Task<IActionResult> Get()
//        {
//            var familyLinks = await _FamilyLinkService.Get(User.Identity.Name);
//            return Ok(familyLinks);
//        }

//        [HttpPost("")]
//        [ProducesResponseType(typeof(DTO.FamilyLink), 200)]
//        public async Task<IActionResult> Create([FromBody]DTO.FamilyLink model)
//        {
//            var familyLink = await _FamilyLinkService.Create(User.Identity.Name, model.ChildEmail);
//            return Ok(familyLink);
//        }

//        [HttpGet("{id}/resend")]
//        [ProducesResponseType(typeof(void), 200)]
//        public async Task<IActionResult> Resend(Guid id)
//        {
//            var familyLink = await _FamilyLinkService.ResendEmail(User.Identity.Name, id);
//            return Ok(familyLink);
//        }

//        [HttpDelete("{id}")]
//        [ProducesResponseType(typeof(void), 200)]
//        public async Task<IActionResult> Remove(Guid id)
//        {
//            await _FamilyLinkService.Delete(User.Identity.Name, id);
//            return Ok();
//        }
//    }
//}
