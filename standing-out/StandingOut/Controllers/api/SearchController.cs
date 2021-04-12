using StandingOut.Business.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using DTO = StandingOut.Data.DTO;
using StandingOut.Extensions;
using System.Threading.Tasks;

namespace StandingOut.Controllers.api
{
    [Produces("application/json")]
    [Route("api/Search")]
    public class SearchController : BaseController
    {
        private readonly ISearchService _SearchService;

        public SearchController(ISearchService searchService)
        {
            _SearchService = searchService;
        }
        
        [HttpPost("Global")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.GlobalSearchResult>), 200)]
        public async Task<IActionResult> Global([FromBody]DTO.GlobalSearch model)
        {
            var searchResult = await _SearchService.Global(model);
            return Ok(searchResult);
        }
    }
}
