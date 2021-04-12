using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface IClassSessionService : IDisposable
    {
        Task<List<Models.ClassSession>> Get();
        Task<List<Models.ClassSession>> GetByTutor(string id);
        Task<List<Models.ClassSession>> GetLastMonth(string userId);
        Task<Models.ClassSession> GetById(Guid id);
        Task<Models.ClassSession> GetByIdWithTutor(Guid id);
        Task<DTO.PagedList<DTO.ClassSessionIndex>> GetPaged(DTO.SearchModel model, Models.User user, bool tutor, bool past);
        Task<DTO.PagedList<DTO.ClassSessionIndex>> Search(DTO.SearchModel model);
        Task<Models.ClassSession> Create(Models.ClassSession model);
        Task<Models.ClassSession> Update(Models.ClassSession model);
        Task Delete(Guid id);
        Task HandleWebhook(string action, int id, int calendarId, int appointmentTypeId);
        Task SendCompletionEmail(Guid id, string userId, DTO.ClassSessionComplete model);
        Task CopyFilesFromMasterToStudentFolders(Models.User user, Models.ClassSession session, IList<Models.SessionAttendee> activeAttendees);
        Task<Models.ClassSession> StartSession(Guid classSessionId, Models.User user);
        Task<string> CancelLesson(Guid id);
        Task<bool> EndSession(Guid classSessionId, Models.User user);
        Task UpdateChatPermission(Guid classSessionId, bool chatActive);
        Task<bool> GetAllChatPermission(Guid classSessionId);
        Task<DTO.VideoRoomGroup> GetWebcamGroup(Guid groupId);

        Task<List<DTO.UserBasicCallInfo>> GetBasicUserCallInfo(Guid classSessionId, string fromUserId);


        Task<List<DTO.WebcamGroup>> GetWebcamGroups(Guid classSessionId, Models.User user, bool isTutor);
        Task<int> GetNumGroups(Guid classSessionId);
        DTO.WebcamRoom GetWebcamRoom(Models.SessionGroup sessionGroup, IEnumerable<Models.SessionAttendee> sessionAttendees, Models.User tutorUser, bool hide);
        string GetGroupWebcamRoomValue(Guid classSessionId, Guid sessionGroupId);
        string GetIndividualWebcamRoomValue(Guid classSessionId, string userId1, string userId2);

        //Task<List<Models.SubscriptionFeature>> GetSubscriptionFeaturesForClassSession(Guid classSessionId);
        //Task<SubscriptionFeatureSet> GetSubscriptionFeatureSetForClassSession(Guid classSessionId);
    }
}

