using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using System.Collections.Generic;
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
        private readonly IStripeCountryService _StripeCountryService;

        public StripeCountrysController(IStripeCountryService stripeCountryService)
        {
            _StripeCountryService = stripeCountryService;
        }

        [HttpGet("")]
        public async Task<IActionResult> Get()
        {
            var stripeCountrys = await _StripeCountryService.Get();    
            return Ok(Mappings.Mapper.Map<List<Models.StripeCountry>, List<DTO.StripeCountry>>(stripeCountrys));
        }
    }
}