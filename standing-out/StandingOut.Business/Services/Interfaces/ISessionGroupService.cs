using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISessionGroupService : IDisposable
    {
        Task<List<Models.SessionGroup>> Get(Guid classSessionId);
        Task<List<Models.SessionGroup>> GetByClassSessionIdNoTracking(Guid classSessionId);
        Task<List<Models.SessionGroup>> GetMyGroups(Guid classSessionId);
        Task<List<DTO.ChatroomInstance>> GetMyChatrooms(Guid classSessionId);
        Task<Models.SessionGroup> GetById(Guid classSessionId, Guid id);
        Task<Models.SessionGroup> GetByIdNoTracking(Guid classSessionId, Guid id, string includeProperties = "");
        Task<Models.SessionGroup> Create(Guid classSessionId, Models.SessionGroup model);
        Task<Models.SessionGroup> Update(Guid classSessionId, Models.SessionGroup model);
        Task Delete(Guid classSessionId, Guid id);
        Task MoveAttendee(Guid classSessionId, Guid sessionAttendeeId, Guid? sessionGroupId = null);
        Task UpdateChatPermission(Guid classSessionId, Guid sessionGroupId, bool chatActive);
        Task<(List<DTO.WebcamRoom>, DTO.WebcamRoom, DTO.WebcamRoom)> MoveAttendees(Guid classSessionId, Guid groupId, string[] userIds);
        Task RemoveAttendees(Guid classSessionId, string[] userIds);
        Task<DTO.ChatroomInstance> GetGroupChatroom(Guid classSessionId, Guid groupId);

        Task<List<DTO.UserBasicCallInfo>> GetBasicUserCallInfo(Guid classSessionId, Guid groupId, string fromUserId);
    }
}

