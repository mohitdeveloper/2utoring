using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISafeguardReportService : IDisposable
    {
        Task<List<Models.SafeguardReport>> Get();
        Task<Models.SafeguardReport> GetById(Guid id);
        Task<Models.SafeguardReport> Create(Models.SafeguardReport model);
        Task<Models.SafeguardReport> Update(Models.SafeguardReport model);
        Task Delete(Guid id);
    }
}

