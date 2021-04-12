using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISessionAttendeeService : IDisposable
    {
        Task<List<Models.SessionAttendee>> Get();
        Task<List<Models.SessionAttendee>> GetUnassigned(Guid classSessionId);
        Task<List<Models.SessionAttendee>> GetByClassSession(Guid classSessionId);
        Task<List<DTO.StudentSession>> GetStudentSessions(string id);
        Task<Models.SessionAttendee> GetById(Guid id);
        Task<Models.SessionAttendee> GetMyByClassSessionId(string userId, Guid classSessionId);
        Task<List<DTO.SessionAttendeeFileUploader>> GetForFileUpload(Guid classSessionId);
        Task<List<DTO.SessionAttendeeFileUploader>> GetForFileUpload(Guid classSessionId, string studentFolderId);
        Task<List<DTO.SessionAttendeeFileUploader>> GetForFileSetup(Guid classSessionId, Models.User user, string fileId);
        Task<List<DTO.SessionAttendeeFileUploader>> GetFilePermission(Guid classSessionId, string fileId);
        Task<Models.SessionAttendee> GetByClassSessionAtendeeId(Guid classsessionId, string userId);
        Task<Models.SessionAttendee> Create(Models.SessionAttendee model);
        Task<Models.SessionAttendee> Update(Models.SessionAttendee model);
        Task Delete(Guid id);
        Task AssociateUser(string userId);
        Task<Models.SessionAttendee> UpdateVideoPermission(DTO.SessionAttendee data);
        Task<Models.ClassSession> AskForHelpRequest(Guid classSessionId, Models.User user);
        Task<Models.SessionAttendee> DeliverHelpRequest(Guid classSessionId, string userId);
        Task UpdateChatPermission(Guid classSessionId, Guid sessionAttendeeId, bool chatActive);
        Task<DTO.ChatPermissions> GetChatPermissions(Guid classSessionId, string userId);

        Task<DTO.UserBasicCallInfo> GetBasicUserCallInfo(Guid classSessionId, string toUserId);
    }
}

