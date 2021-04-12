
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOut.Data.Enums;
using StandingOut.Shared.Integrations.Stripe;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;
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
    [Route("api/subjectStudyLevelSetup")]
    public class SubjectsStudyLevelSetupController : NewBaseController
    {
        private readonly ISubjectStudyLevelSetupService _SubjectStudyLevelSetupService;
        private readonly ITutorService _tutorService;
        private readonly UserManager<Models.User> _UserManager;
        public SubjectsStudyLevelSetupController(ISubjectStudyLevelSetupService subjectStudyLevelSetupService, ITutorService tutorService, UserManager<Models.User> userManager, IUserService userService, IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings, companyService)
        {
            _UserManager = userManager;
            _SubjectStudyLevelSetupService = subjectStudyLevelSetupService;
            _tutorService = tutorService;
        }

        [HttpPost("Paged")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.SubjectStudyLevelSetup>), 200)]
        public async Task<IActionResult> Paged([FromBody]DTO.SubjectStudyLevelSearchModel model)
        {
            var subjects = await _SubjectStudyLevelSetupService.GetPaged(model);
            if(subjects.Data.Count>0)
            {

                foreach (var item in subjects.Data)
                {
                    var cBy= await _UserManager.FindByEmailAsync(item.CreatedBy);
                    var user = await _UserManager.FindByEmailAsync(item.ModifiedBy);
                    if(cBy.TutorId!=null)
                    {
                        item.AllowEdit = true;
                    }
                    else
                    {
                        item.AllowEdit = false;
                    }
                    item.UpdateByName = user.FullName;
                }
            }
            return Ok(subjects);
        }

       
        [HttpGet("getById/{id}")]
        [ProducesResponseType(typeof(DTO.SubjectStudyLevelSetupPrice), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var model = await _SubjectStudyLevelSetupService.GetById(id, "Subject, StudyLevel");
            return Ok(Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetupPrice>(model));
        }


        [HttpPost("getPricePerPerson")]
        [ProducesResponseType(typeof(DTO.SubjectStudyLevelSetupPrice), 200)]
        public async Task<IActionResult> getPricePerPerson([FromBody] DTO.SubjectStudyLevelSetupPrice model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please select subject and study level to get the price per person!");
            }
            DTO.SubjectStudyLevelSetupPrice returnModel = new DTO.SubjectStudyLevelSetupPrice();
            if (Caller.IsAdmin)
            {
                model.CompanyId = Caller.CurrentUserCompany.CompanyId;
            }
            if(Caller.IsTutor)
            {

                var companyTutor = await _tutorService.GetCurrentCompanyTutor(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));
                if (companyTutor != null)
                {
                    model.CompanyId = companyTutor.CompanyId;
                }
                else
                {
                    model.TutorId = Guid.Parse(Caller.CurrentUser.TutorId.ToString());
                }
                // model.TutorId = Guid.Parse(Caller.CurrentUser.TutorId.ToString());

            }
            var setupPrice = Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetupPrice>(await _SubjectStudyLevelSetupService.getPricePerPerson(model));
            if(setupPrice==null)
            {
                Dictionary<string, Decimal> dist = new Dictionary<string, Decimal>();
                dist.Add("pricePerPerson", Decimal.Parse("0.0"));
                dist.Add("status", Decimal.Parse("-1"));
                return Ok(dist);
            }
            return Ok(setupPrice);
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.SubjectStudyLevelSetupPrice), 200)]
        public async Task<IActionResult> Post([FromBody] DTO.SubjectStudyLevelSetupPrice model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (Caller.IsAdmin)
            {
                model.CompanyId = Caller.CurrentUserCompany.CompanyId;
            }
            else if (Caller.IsTutor)
            {
                var tutor = await _tutorService.GetById(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));
                var companyTutor = await _tutorService.GetCurrentCompanyTutor(tutor?.TutorId);
                if (companyTutor != null)
                {
                    model.CompanyId = companyTutor.CompanyId;
                    await _SubjectStudyLevelSetupService.Create(Mappings.Mapper.Map<DTO.SubjectStudyLevelSetupPrice, Models.SubjectStudyLevelSetup>(model));
                }
                model.CompanyId = null;
                model.TutorId = Caller.CurrentUser.TutorId;

            }

            var returnModel = await _SubjectStudyLevelSetupService.Create(Mappings.Mapper.Map<DTO.SubjectStudyLevelSetupPrice, Models.SubjectStudyLevelSetup>(model));
            return Ok(Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetupPrice>(returnModel));
        }


        [HttpPost("update")]
        [ProducesResponseType(typeof(DTO.SubjectStudyLevelSetupPrice), 200)]
        public async Task<IActionResult> Put([FromBody] DTO.SubjectStudyLevelSetupPrice model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.SubjectStudyLevelSetupId== null)
            {
                return BadRequest();
            }

            if (Caller.IsAdmin)
            {
                model.CompanyId = Caller.CurrentUserCompany.CompanyId;
            }
            else if (Caller.IsTutor)
            {
                model.TutorId = Caller.CurrentUser.TutorId;
            }

            var returnModel = await _SubjectStudyLevelSetupService.Update(Mappings.Mapper.Map<DTO.SubjectStudyLevelSetupPrice, Models.SubjectStudyLevelSetup>(model));

            return Ok(Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetupPrice>(returnModel));
        }


        
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _SubjectStudyLevelSetupService.Delete(id);
            return Ok();
        }


        ///// <summary>
        ///// Get by TutorID or CompanyId
        ///// </summary>
        ///// <param name=""></param>
        ///// <returns></returns>
        //[HttpGet("")]
        //[ProducesResponseType(typeof(IEnumerable<DTO.SubjectStudyLevelSetup>), 200)]
        //public async Task<IActionResult> Get(Guid id)
        //{
        //    var priceRows = await _SubjectStudyLevelSetupService.Get(id);
        //    return Ok(Mappings.Mapper.Map<List<Models.SubjectStudyLevelSetup>, List<DTO.SubjectStudyLevelSetup>>(priceRows));
        //}

        //// GET a price row.
        //[HttpGet("{id}")]
        //[ProducesResponseType(typeof(DTO.SubjectStudyLevelSetup), 200)]
        //public async Task<IActionResult> GetById(Guid id)
        //{
        //    var model = await _SubjectStudyLevelSetupService.GetById(id);
        //    return Ok(Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetup>(model));
        //}

        //// CREATE New
        //[Authorize(Roles = "Super Admin, Admin")]
        //[HttpPost("")]
        //[ProducesResponseType(typeof(DTO.SubjectStudyLevelSetup), 200)]
        //public async Task<IActionResult> Post([FromBody]DTO.SubjectStudyLevelSetup subjectPriceLevelSetup)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var model = await _SubjectStudyLevelSetupService
        //        .Create(Mappings.Mapper.Map<DTO.SubjectStudyLevelSetup, Models.SubjectStudyLevelSetup>(subjectPriceLevelSetup));

        //    return Ok(Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetup>(model));
        //}

        //// UPDATE 
        //[Authorize(Roles = "Super Admin, Admin")]
        //[HttpPut("{id}")]
        //[ProducesResponseType(typeof(DTO.SubjectStudyLevelSetup), 200)]
        //public async Task<IActionResult> Put(Guid id, [FromBody]DTO.SubjectStudyLevelSetup subject)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != subject.SubjectId)
        //    {
        //        return BadRequest();
        //    }

        //    var model = await _SubjectStudyLevelSetupService
        //        .Update(Mappings.Mapper.Map<DTO.SubjectStudyLevelSetup, Models.SubjectStudyLevelSetup>(subject));

        //    return Ok(Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetup>(model));
        //}

        //[Authorize(Roles = "Super Admin, Admin")]
        //[HttpDelete("{id}")]
        //[ProducesResponseType(typeof(void), 200)]
        //public async Task<IActionResult> Delete(Guid id)
        //{
        //    await _SubjectStudyLevelSetupService.Delete(id);
        //    return Ok();
        //}
    }
}