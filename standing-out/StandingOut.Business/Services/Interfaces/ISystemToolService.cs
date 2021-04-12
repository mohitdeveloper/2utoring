using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISystemToolService : IDisposable
    {
        Task<List<Models.SystemTool>> Get();
        Task<List<Models.SystemTool>> Get(Guid classSessionId);
        Task<Models.SystemTool> GetById(Guid id);
        Task<Models.SystemTool> Create(Models.SystemTool model);
        Task<Models.SystemTool> Update(Models.SystemTool model);
        Task Delete(Guid id);
    }
}

