using System;
using System.Collections.Generic;
using StandingOut.Business.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using StandingOut.Extensions;
using System.Threading.Tasks;

namespace StandingOut.Controllers.api
{
    [Authorize(Roles = "Super Admin, Admin")]
    [Produces("application/json")]
    [Route("api/CompanyTutors")]
    public class CompanyTutorsController : BaseController
    {
        private readonly ICompanyTutorService _CompanyTutorService;
        private readonly ITutorService _TutorService;

        public CompanyTutorsController(ICompanyTutorService CompanyTutorService, ITutorService tutorService)
        {
            _CompanyTutorService = CompanyTutorService;
            _TutorService = tutorService;
        }
        
        [HttpGet("")]
        [ProducesResponseType(typeof(IEnumerable<DTO.CompanyTutor>), 200)]
        public async Task<IActionResult> Get()
        {
            var companyTutors = await _CompanyTutorService.Get();
            return Ok(Mappings.Mapper.Map<List<Models.CompanyTutor>, List<DTO.CompanyTutor>>(companyTutors));
        }

        [HttpGet("Company/{id}")]
        [ProducesResponseType(typeof(IEnumerable<DTO.CompanyTutor>), 200)]
        public async Task<IActionResult> GetByCompany(Guid id)
        {
            var companyTutors = await _CompanyTutorService.GetByCompany(id);
            return Ok(Mappings.Mapper.Map<List<Models.CompanyTutor>, List<DTO.CompanyTutor>>(companyTutors));
        }

        [HttpGet("Tutors")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Tutor>), 200)]
        public async Task<IActionResult> GetTutors()
        {
            var tutors = await _TutorService.Get();
            return Ok(Mappings.Mapper.Map<List<Models.Tutor>, List<DTO.Tutor>>(tutors));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.CompanyTutor), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var model = await _CompanyTutorService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.CompanyTutor, DTO.CompanyTutor>(model));
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.CompanyTutor), 200)]
        public async Task<IActionResult> Post([FromBody]DTO.CompanyTutor CompanyTutor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _CompanyTutorService.Create(Mappings.Mapper.Map<DTO.CompanyTutor, Models.CompanyTutor>(CompanyTutor));
            return Ok(Mappings.Mapper.Map<Models.CompanyTutor, DTO.CompanyTutor>(model));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DTO.CompanyTutor), 200)]
        public async Task<IActionResult> Put(Guid id, [FromBody]DTO.CompanyTutor CompanyTutor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if(id != CompanyTutor.CompanyTutorId)
            {
                return BadRequest();
            }

            var model = await _CompanyTutorService.Update(Mappings.Mapper.Map<DTO.CompanyTutor, Models.CompanyTutor>(CompanyTutor));
            return Ok(Mappings.Mapper.Map<Models.CompanyTutor, DTO.CompanyTutor>(model));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _CompanyTutorService.Delete(id);
            return Ok();
        }
    }
}
