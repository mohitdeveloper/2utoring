using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/PromoCode")]
    public class PromoCodeController : Controller
    {
        private readonly IPromoCodeService _PromoCodeService;

        public PromoCodeController(IPromoCodeService promoCodeService)
        {
            _PromoCodeService = promoCodeService;
        }

        [HttpPost("find")]
        [ProducesResponseType(typeof(DTO.PromoCode), 200)]
        public async Task<IActionResult> Get([FromBody]DTO.PromoCode model)
        {
            var promoCode = await _PromoCodeService.GetByName(model.Name);
            if (promoCode == null || (promoCode.MaxUses.HasValue && promoCode.MaxUses.Value <= await _PromoCodeService.GetUses(promoCode.PromoCodeId)))
                return Ok(null);
            return Ok(Mappings.Mapper.Map<Models.PromoCode, DTO.PromoCode>(promoCode));
        }
    }
}