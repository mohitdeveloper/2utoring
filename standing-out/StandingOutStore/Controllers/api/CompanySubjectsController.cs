using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers.api
{
    
    [Produces("application/json")]
    [Route("api/CompanySubjects")]
    public class CompanySubjectsController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ICompanySubjectService _CompanySubjectService;

        public CompanySubjectsController(UserManager<Models.User> userManager, 
            ICompanySubjectService companySubjectService)
        {
            _UserManager = userManager;
            _CompanySubjectService = companySubjectService;
        }

        [AllowAnonymous]
        [HttpGet("getByCompany/{id}")]
        public async Task<IActionResult> GetByCompany(Guid id)
        {
            var companySubjects = await _CompanySubjectService.GetByCompany(id);
            return Ok(Mappings.Mapper.Map<List<Models.CompanySubject>, List<DTO.CompanySubject>>(companySubjects));
        }

        [HttpGet("getByCompanyForProfile/{id}")]  // Used by public profile view
        public async Task<IActionResult> GetByCompanyForProfile(Guid id)
        {
            var companySubjects = await _CompanySubjectService.GetByCompanyForProfile(id);
            return Ok(companySubjects);
        }

        [Authorize]
        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.CompanySubject), 200)]
        public async Task<IActionResult> Create([FromBody]DTO.CompanySubject model)
        {
            var companySubject = await _CompanySubjectService.Create(Mappings.Mapper.Map<DTO.CompanySubject, Models.CompanySubject>(model));
            return Ok(Mappings.Mapper.Map<Models.CompanySubject, DTO.CompanySubject>(companySubject));
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _CompanySubjectService.Delete(id);
            return Ok();
        }
    }
}