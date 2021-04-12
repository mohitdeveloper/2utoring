using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISessionMessageService : IDisposable
    {
        Task<List<Models.SessionMessage>> Get();
        Task<Models.SessionMessage> GetById(Guid id);
        Task<Models.SessionMessage> Create(Models.SessionMessage model);
        Task<Models.SessionMessage> Create(string message, Guid classSessionId, string tutorId, Guid? groupId = null, string toUserId = null, Guid? sessionOneToOneChatInstanceId = null);
        Task UpdateReadStatus(Guid classSessionId, string tutorId, string userId, Guid? groupId = null, Guid? sessionToOneChatInstanceId = null);
        Task<Models.SessionMessage> Update(Models.SessionMessage model);
        Task Delete(Guid id);
    }
}

