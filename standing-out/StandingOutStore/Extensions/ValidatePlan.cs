using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using StandingOut.Data;
using StandingOut.Data.DTO;
using StandingOutStore.Business.Services;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Extensions
{
    public class ValidatePlanAttribute : Attribute, IAsyncActionFilter
    {
        private ITutoringPlanService _TutoringPlanService;
        internal UserManager<Models.User> _UserManager;
        public ValidatePlanAttribute(bool AllowSuperAdmin = false)
        {
             
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            Controller controller = context.Controller as Controller;
            _TutoringPlanService = controller.HttpContext.RequestServices.GetService(typeof(ITutoringPlanService)) as ITutoringPlanService;
            _UserManager = controller.HttpContext.RequestServices.GetService(typeof(UserManager<Models.User>)) as UserManager<Models.User>;
            if (context.HttpContext.User.Identity.IsAuthenticated)
            {
                var user = await _UserManager.FindByEmailAsync(context.HttpContext.User.Identity.Name);
                PlanValidity planValidity = await _TutoringPlanService.CheckPlanValidity(user);
                if (planValidity.UserType == "Admin")
                {
                    if (!planValidity.IsValidPlan)
                    {
                        context.Result = new RedirectToActionResult("subscription", "settings", new { area = "Admin" });
                    }
                    else
                    {
                        await next();
                    }
                }
                else if (planValidity.UserType == "Tutor")
                {
                    if (!planValidity.IsValidPlan)
                    {
                        context.Result = new RedirectToActionResult("subscription", "settings", new { area = "Tutor" });
                    }
                    else
                    {
                        await next();
                    }
                }
                else
                {
                    await next();
                }

            }
            else
            {
                await next();
            }




        }
    }
}
