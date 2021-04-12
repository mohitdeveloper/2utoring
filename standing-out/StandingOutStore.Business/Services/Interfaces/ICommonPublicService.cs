using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using StandingOut.Data.Models;
using Microsoft.AspNetCore.Http;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ICommonPublicService
    {
        Task<bool> SendMessage(DTO.EmailModel model);
        Task<bool> UpdateCourse(DTO.UpdateModel model);
        Task<bool> UpdateClassSession(DTO.UpdateModel model);
        Task<List<Models.ErrorLog>> GetErrorLog();
        Task<bool> UpdateStripPlan(DTO.UpdateStripPlanModel model);

    }
}
