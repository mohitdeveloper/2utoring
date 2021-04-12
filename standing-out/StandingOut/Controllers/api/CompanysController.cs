using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using StandingOut.Extensions;
using System.Threading.Tasks;
using StandingOutStore.Business.Services.Interfaces;

namespace StandingOut.Controllers.api
{
    [Authorize(Roles = "Super Admin, Admin")]
    [Produces("application/json")]
    [Route("api/Companys")]
    public class CompanysController : BaseController
    {
        private readonly ICompanyService _CompanyService;

        public CompanysController(ICompanyService CompanyService)
        {
            _CompanyService = CompanyService;
        }
        
        [HttpGet("")]
        [ProducesResponseType(typeof(IEnumerable<DTO.CompanyProfile>), 200)]
        public async Task<IActionResult> Get()
        {
            var companys = await _CompanyService.Get();
            return Ok(Mappings.Mapper.Map<List<Models.Company>, List<DTO.CompanyProfile>>(companys));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.CompanyProfile), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var model = await _CompanyService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.Company, DTO.CompanyProfile>(model));
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.CompanyProfile), 200)]
        public async Task<IActionResult> Post(DTO.CreateCompany Company)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var model = await _CompanyService.Create(Company);
            return Ok(Mappings.Mapper.Map<Models.Company, DTO.CompanyProfile>(model));
        }

        [HttpPost("{id}")]
        [ProducesResponseType(typeof(DTO.CompanyProfile), 200)]
        public async Task<IActionResult> Put(Guid id, DTO.EditCompany Company)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if(id != Company.CompanyId)
                return BadRequest();

            var model = await _CompanyService.Update(Company);
            return Ok(Mappings.Mapper.Map<Models.Company, DTO.CompanyProfile>(model));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _CompanyService.Delete(id);
            return Ok();
        }
    }
}
