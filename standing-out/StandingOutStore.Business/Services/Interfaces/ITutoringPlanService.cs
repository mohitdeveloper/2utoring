using StandingOut.Data.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
   public interface ITutoringPlanService
    {
        Task<PlanValidity> CheckPlanValidity(User user);
    }
}
