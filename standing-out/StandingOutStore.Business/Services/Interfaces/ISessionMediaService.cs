using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISessionMediaService : IDisposable
    {
        Task<List<Models.SessionMedia>> GetByClassSession(Guid classSessionId);
        Task<Models.SessionMedia> GetById(Guid id);
        Task<Models.SessionMedia> Create(Models.SessionMedia model);
        Task<Models.SessionMedia> Update(Models.SessionMedia model);
        Task Delete(Guid id);
    }
}
