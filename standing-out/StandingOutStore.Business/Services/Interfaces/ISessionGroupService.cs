using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISessionGroupService : IDisposable
    {
        Task<List<Models.SessionGroup>> Get(Guid classSessionId);
        Task<Models.SessionGroup> GetById(Guid classSessionId, Guid id);
        Task<Models.SessionGroup> Create(Guid classSessionId, Models.SessionGroup model);
        Task<Models.SessionGroup> Update(Guid classSessionId, Models.SessionGroup model);
        Task Delete(Guid classSessionId, Guid id);
        Task RemoveAttendees(Guid classSessionId, List<string> userIds);
        Task MoveAttendees(Guid classSessionId, Guid groupId, List<string> userIds);
    }
}
