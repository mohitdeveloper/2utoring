using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISessionWhiteBoardService : IDisposable
    {
        Task<Models.SessionGroup> Create(Models.SessionGroup sessionGroup);
        Task<List<DTO.SessionWhiteBoard>> GetMyWhiteBoards(Guid classSessionId, int sizeX, int sizeY);
        Task<Models.SessionWhiteBoard> GetFullWhiteBoard(Guid id);
        Task<Models.SessionWhiteBoard> GetWhiteBoard(Guid id);
        Task<Models.SessionWhiteBoardHistory> AddCommand(Guid classSessionId, DTO.SessionWhiteBoardHistory model);
        Task<List<Models.SessionWhiteBoardHistory>> AddLoadCommand(Guid classSessionId, Guid sessionWhiteBoardId, string userId, DTO.LoadCommand model);
        Task<Models.SessionWhiteBoard> Create(Models.SessionWhiteBoard model);
        Task<Models.SessionWhiteBoardHistory> UpdateSizes(Guid classSessionId, Guid sessionWhiteBoardId, string userId, string jsonData, int sizeX, int sizeY);
        Task ToggleLock(Guid classSessionId, Guid sessionWhiteBoardId, DTO.SessionWhiteBoardLock model);
        Task<DTO.SessionWhiteBoard> Open(Guid classSessionId, Guid sessionWhiteBoardSaveId);
        Task<DTO.SessionWhiteBoard> OpenInactiveBoard(Guid classSessionId, string userId, Guid sessionWhiteBoardId);
        Task<Models.SessionWhiteBoardHistory> Undo(Guid classSessionId, Guid sessionWhiteBoardId, Guid sessionWhiteBoardHistoryId);
        Task<Models.SessionWhiteBoardHistory> Redo(Guid classSessionId, Guid sessionWhiteBoardId, Guid sessionWhiteBoardHistoryId);
        Task<Models.SessionWhiteBoardHistory> Clear(Guid classSessionId, Guid sessionWhiteBoardId);
        Task<List<DTO.SessionWhiteBoardSaveResult>> GetSavedWhiteBoards(Guid classSessionId);
        Task DeleteSessionWhiteBoardSave(Guid sessionWhiteBoardSaveId);
        Task<Models.SessionWhiteBoardSave> Save(Guid classSessionId, Guid sessionWhiteBoardId, string userId, DTO.SessionWhiteBoardSaveImage imageInfo);
        Task<List<DTO.WhiteboardData>> GetLoadData(DTO.SessionWhiteBoardSaveResult model);
        Task SetInactive(Guid sessionWhiteBoardId);
        Task<List<DTO.SessionWhiteBoardShare>> GetUsersForShare(Guid classSessionId, Guid sessioNWhiteBoardId, string userId, bool individual, string whiteBoardUserId);
        Task<List<DTO.SessionWhiteBoardShare>> Share(Guid classSessionId, Guid sessionWhiteBoardId, bool individual, string whiteBoardUserId, List<DTO.SessionWhiteBoardShare> shares);
        Task<DTO.SessionWhiteBoard> GetSharedBoard(Guid classSessionId, Guid sessionWhiteBoardId, string userId);
        Task<List<DTO.SessionWhiteBoardShareLoad>> GetSharedWhiteBoards(Guid classSessionId, string userId);
        Task<List<DTO.SessionWhiteBoardShareLoad>> GetMyInactiveWhiteboards(Guid classSessionId, string userId);
        Task<DTO.SessionWhiteBoardCollaborateOverall> GetWhiteBoardsForCollaborate(Guid classSessionId, string userId);
        Task<DTO.SessionWhiteBoard> GetWhiteBoardForCollaboration(Guid classSessionId, Guid? sessionWhiteBoardId, Guid? groupId, string userId);
        // Returns directory of image and any history created
        Task<(string, List<Models.SessionWhiteBoardHistory>)> UploadImage(Guid classSessionId, Guid sessionWhiteBoardId, Models.User user, IFormFile file, int sizeX, int sizeY);
        // Returns directory of image and any history created
        Task<(string, List<Models.SessionWhiteBoardHistory>)> ImportFromDrive(Guid classSessionId, Guid sessionWhiteBoardId, Models.User user, string fileId, int sizeX, int sizeY);
        Task<DTO.SessionWhiteBoard> GetGroupWhiteBoard(Guid classSessionId, Guid sessionGroupId);
        Task<byte[]> GetImage(Guid sessionWhiteboardId, string fileName);
        Task InactiveByGroup(Guid classSessionId, Guid sessionGroupId);
        Task ChangeName(Guid classSessionId, Guid sessionWhiteBoardId, Models.User user, string name, bool isTutor);
    }
}

