using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOut.Data.Enums;
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
    [Route("api/StripePlans")]
    public class StripePlansController : NewBaseController
    {
        private readonly IStripePlanService _StripePlanService;

        public StripePlansController(IStripePlanService stripePlanService, UserManager<Models.User> userManager, IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings, companyService)
        {
            _StripePlanService = stripePlanService;
        }

        [HttpGet("")]
        public async Task<IActionResult> Get()
        {
            var stripePlans = await _StripePlanService.Get();    
            return Ok(Mappings.Mapper.Map<List<Models.StripePlan>, List<DTO.StripePlan>>(stripePlans));
        }
        [HttpGet("getSubscriptionPlan")]
        public async Task<IActionResult> GetSubscriptionPlan()
        {
            List<Models.StripePlan> stripePlansList = null;
            var stripePlans = await _StripePlanService.Get();
            if (stripePlans != null)
            {
                if (Caller.IsAdmin)
                {
                    stripePlansList= stripePlans.Where(x => x.StripePlanType == StripePlanType.Company).OrderBy(x => x.Subscription.SubscriptionPrice).ToList();
                }
                if (Caller.IsTutor && Caller.CurrentUserCompany == null)
                {
                    stripePlansList = stripePlans.Where(x => x.StripePlanType == StripePlanType.Tutor).OrderBy(x => x.Subscription.SubscriptionPrice).ToList();
                }
            }
            return Ok(Mappings.Mapper.Map<List<Models.StripePlan>, List<DTO.StripePlan>>(stripePlansList));
            
        }
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stripePlan = await _StripePlanService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.StripePlan, DTO.StripePlan>(stripePlan));
        }
    }
}