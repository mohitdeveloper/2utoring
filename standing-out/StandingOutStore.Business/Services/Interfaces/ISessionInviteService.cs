using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISessionInviteService : IDisposable
    {
        Task<List<Models.SessionInvite>> GetByClassSession(Guid classSessionId);
        Task<Models.SessionInvite> GetById(Guid id);
        Task<Models.SessionInvite> Create(Models.SessionInvite model);
        Task<List<Models.SessionInvite>> Create(List<Models.SessionInvite> models);
        Task CreateBulk(DTO.SessionInvite model);
        Task<Models.SessionInvite> Update(Models.SessionInvite model);
        Task Delete(Guid id);
    }
}
