using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IStripePlanService : IDisposable
    {
        Task<List<Models.StripePlan>> Get();
        Task<Models.StripePlan> GetById(Guid id);
    }
}
