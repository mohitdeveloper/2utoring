using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISessionDocumentService : IDisposable
    {
        Task<DTO.FileNavigation> Get(Guid classSessionId, Models.User user, string studentId = null, bool sharedFolder = false);
        Task<DTO.FileNavigation> GetByFolderIdSame(Guid classSessionId, Models.User user, string folderId, string pageToken = "");
        Task<Google.Apis.Drive.v3.Data.FileList> GetByFolderIdDown(Guid classSessionId, Models.User user, string folderId);
        Task<DTO.FileNavigation> GetByFolderIdUp(Guid classSessionId, Models.User user, string folderId);
        Task<Google.Apis.Drive.v3.Data.File> UploadToMaster(Guid classSessionId, Models.User user, IFormFile file);
        Task<Google.Apis.Drive.v3.Data.File> ExportWhiteBoard(Guid classSessionId, string userId, DTO.SessionWhiteBoardSaveImage imageInfo);
        Task ShareFileUpload(Guid classSessionId, Models.User user, List<string> fileIds, List<DTO.SessionAttendeeFileUploaderShare> models);
        Task<List<DTO.SessionAttendeeFileUploader>> GetPermissions(Guid classSessionId, Models.User user, string fileId, List<DTO.SessionAttendeeFileUploader> models);
        Task UpdatePermissions(Guid classSessionId, Models.User user, List<string> fileIds, List<DTO.SessionAttendeeFileUploaderShare> models);
        Task CreateGoogleFile(Guid classSessionId, Models.User user, DTO.CreateGoogleFile model);
        Task ShareFileUploadSetup(Guid classSessionId, Models.User user, List<string> fileIds, List<DTO.SessionAttendeeFileUploaderShare> models);
        Task<Google.Apis.Drive.v3.Data.File> Upload(string folderId, Models.User user, IFormFile file);
        Task<Google.Apis.Drive.v3.Data.File> Upload(Guid classSessionId, Models.User user, DTO.ScreenshotData model);
        Task<bool> Delete(Guid classSessionId, Models.User user, string fileId);

    }
}
