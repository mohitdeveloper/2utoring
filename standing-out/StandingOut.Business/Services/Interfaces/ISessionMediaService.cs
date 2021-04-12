using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISessionMediaService : IDisposable
    {
        Task<List<Models.SessionMedia>> Get(Guid classSessionId);
        Task<Models.SessionMedia> GetById(Guid classSessionId, Guid id);
        Task<Models.SessionMedia> Create(Guid classSessionId, Models.SessionMedia model);
        Task<Models.SessionMedia> Update(Guid classSessionId, Models.SessionMedia model);
        Task Delete(Guid classSessionId, Guid id);
    }
}

