using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/StripeCountrys")]
    public class StripeCountrysController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IStripeCountryService _StripeCountryService;
        public StripeCountrysController(UserManager<Models.User> userManager, IStripeCountryService stripeCountryService)
        {
            _UserManager = userManager;
            _StripeCountryService = stripeCountryService;
        }

        [HttpGet("")]
        public async Task<IActionResult> Get()
        {
            var stripeCountrys = await _StripeCountryService.Get();
            var result = Mappings.Mapper.Map<List<Models.StripeCountry>, List<DTO.StripeCountry>>(stripeCountrys.OrderBy(x => x.CurrencyOrder).ToList());
            return Ok(result);
        }

        [HttpGet("getMyStripeCountry")]
        public async Task<IActionResult> GetStripeCountry()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var stripeCountry = await _StripeCountryService.GetById(Guid.Parse(user.StripeCountryID.ToString()));
            var result = Mappings.Mapper.Map<Models.StripeCountry, DTO.StripeCountry>(stripeCountry);
            return Ok(result);
        }
    }
}