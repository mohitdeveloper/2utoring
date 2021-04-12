using StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using StandingOut.Data.DTO;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using StandingOut.Data;
using System;

namespace StandingOutStore.ViewComponents
{
    public class PlanValidityViewComponent : ViewComponent
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutoringPlanService _TutoringPlanService;

        public PlanValidityViewComponent(UserManager<Models.User> userManager, ITutoringPlanService tutoringPlanService)
        {
            _TutoringPlanService = tutoringPlanService;
            _UserManager = userManager;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            PlanValidity model = new PlanValidity();
            if (User.Identity.IsAuthenticated)
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                model = await _TutoringPlanService.CheckPlanValidity(user);
            }
            return View(model);
        }
    }
}
