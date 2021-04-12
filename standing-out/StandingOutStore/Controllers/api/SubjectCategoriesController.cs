
using Microsoft.AspNetCore.Authorization;
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
    [Route("api/SubjectCategories")]
    public class SubjectCategoriesController : Controller
    {
        private readonly ISubjectCategoryService _SubjectCategoryService;

        public SubjectCategoriesController(ISubjectCategoryService subjectCategoryService)
        {
            _SubjectCategoryService = subjectCategoryService;
        }

        [HttpGet("options")]
        [ProducesResponseType(typeof(List<DTO.GuidOptionExpanded>), 200)]
        public async Task<IActionResult> GetOptions()
        {
            return Ok(await _SubjectCategoryService.GetOptions(null));
        }

        [HttpGet("optionsFiltered/{subjectId}")]
        [ProducesResponseType(typeof(List<DTO.GuidOptionExpanded>), 200)]
        public async Task<IActionResult> GetFiltered(Guid subjectId)
        {
            return Ok(await _SubjectCategoryService.GetOptions(subjectId));
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(IEnumerable<DTO.SubjectCategory>), 200)]
        public async Task<IActionResult> Get()
        {
            var subjectCategories = await _SubjectCategoryService.Get();
            return Ok(Mappings.Mapper.Map<List<Models.SubjectCategory>, List<DTO.SubjectCategory>>(subjectCategories));
        }

        [HttpPost("Paged")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.SubjectCategory>), 200)]
        public async Task<IActionResult> Paged([FromBody]DTO.SearchModel model)
        {
            var subjectCategories = await _SubjectCategoryService.GetPaged(model);
            return Ok(subjectCategories);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.SubjectCategory), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var model = await _SubjectCategoryService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.SubjectCategory, DTO.SubjectCategory>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.SubjectCategory), 200)]
        public async Task<IActionResult> Post([FromBody]DTO.SubjectCategory subjectCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var model = await _SubjectCategoryService.Create(Mappings.Mapper.Map<DTO.SubjectCategory, Models.SubjectCategory>(subjectCategory));
            return Ok(Mappings.Mapper.Map<Models.SubjectCategory, DTO.SubjectCategory>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DTO.SubjectCategory), 200)]
        public async Task<IActionResult> Put(Guid id, [FromBody]DTO.SubjectCategory subjectCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != subjectCategory.SubjectCategoryId)
            {
                return BadRequest();
            }

            var model = await _SubjectCategoryService.Update(Mappings.Mapper.Map<DTO.SubjectCategory, Models.SubjectCategory>(subjectCategory));
            return Ok(Mappings.Mapper.Map<Models.SubjectCategory, DTO.SubjectCategory>(model));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _SubjectCategoryService.Delete(id);
            return Ok();
        }
    }
}