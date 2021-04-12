using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
    [Route("api/TutorAvailability")]
    public class TutorAvailabilityController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutorAvailabilityService _TutorAvailabilityService;
        public TutorAvailabilityController(ITutorAvailabilityService tutorAvailabilityService, UserManager<Models.User> userManager, IUserService userService, IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings, companyService)
        {
            _TutorAvailabilityService = tutorAvailabilityService;
            _UserManager = userManager;
        }

        [HttpGet("getById/{id}")]
        [ProducesResponseType(typeof(DTO.TutorAvailability), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var model = await _TutorAvailabilityService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.TutorAvailability, DTO.TutorAvailability>(model));
        }
        [AllowAnonymous]
        [HttpGet("getByTutor/{id}")]
        [ProducesResponseType(typeof(DTO.TutorAvailability), 200)]
        public async Task<IActionResult> GetByTutorId(Guid id)
        {
            var tutor = await _TutorAvailabilityService.GetByTutorId(id);
            return Ok(Mappings.Mapper.Map<List<Models.TutorAvailability>, List<DTO.TutorAvailability>>(tutor));
        }

        [HttpPost("getCompanyTutorByAvailability")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Tutor>), 200)]
        public async Task<IActionResult> GetAvailableTutors([FromBody] DTO.SearchAvailableTutors model)
        {
            if(!ModelState.IsValid)
            {
                return Ok(0);
            }
            model.CompanyId = Caller.CurrentUserCompany.CompanyId;
            var tutor = await _TutorAvailabilityService.GetAvailableTutors(model);
            if (tutor.Count == 0)
            {
                return Ok(tutor.Count);
            }
            return Ok(Mappings.Mapper.Map<List<Models.Tutor>, List<DTO.Tutor>>(tutor));
            //return Ok();
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.TutorAvailability), 200)]
        public async Task<IActionResult> Post([FromBody] DTO.TutorAvailability model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (model.TutorId != null && model.TutorId.GetType()==typeof(Guid))
            {
                await DeleteByTutor(model.TutorId);
            }
            var newModel = await _TutorAvailabilityService.Create(Mappings.Mapper.Map<DTO.TutorAvailability, Models.TutorAvailability>(model));
            return Ok(Mappings.Mapper.Map<Models.TutorAvailability, DTO.TutorAvailability>(newModel));

        }


        [HttpPost("multiEvent")]
        [ProducesResponseType(typeof(IEnumerable<DTO.TutorAvailability>), 200)]
        public async Task<IActionResult> CreateMultiple([FromBody] List<DTO.TutorAvailability> model)
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (user.TutorId.HasValue)
            {
                await DeleteByTutor(Guid.Parse(user.TutorId.ToString()));
            }
            var newModel = await _TutorAvailabilityService.CreateMultiple(Mappings.Mapper.Map<List<DTO.TutorAvailability>, List<Models.TutorAvailability>>(model));
            return Ok(Mappings.Mapper.Map<List<Models.TutorAvailability>, List<DTO.TutorAvailability>>(newModel));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DTO.TutorAvailability), 200)]
        public async Task<IActionResult> Put(Guid id, [FromBody] DTO.TutorAvailability model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.TutorAvailabilityId)
            {
                return BadRequest();
            }

            var returnModel = await _TutorAvailabilityService.Update(Mappings.Mapper.Map<DTO.TutorAvailability, Models.TutorAvailability>(model));
            return Ok(Mappings.Mapper.Map<Models.TutorAvailability, DTO.TutorAvailability>(returnModel));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _TutorAvailabilityService.Delete(id);
            return Ok();
        }

        [HttpDelete("deleteByTutor/{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> DeleteByTutor(Guid id)
        {
            await _TutorAvailabilityService.DeleteByTutor(id);
            return Ok();
        }

        //[Authorize]
        [AllowAnonymous]
        [HttpPost("checkSlotAvailability")]
        [ProducesResponseType(typeof(bool), 200)]
        public async Task<IActionResult> CheckSlotAvailability([FromBody] DTO.CheckAvailableSlot model)
        {
            return Ok(await _TutorAvailabilityService.CheckSlotAvailability(model));
        }

    }

}
