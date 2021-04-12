using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using Microsoft.AspNetCore.Http;
using StandingOut.Data.Enums;
using DTO = StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISessionDocumentService : IDisposable
    {
        Task<IList<Google.Apis.Drive.v3.Data.File>> GetMasterFiles(Guid classSessionId);
        Task<IList<Google.Apis.Drive.v3.Data.File>> GetFiles(Guid classSessionId, MaterialFileType type);
        Task<Google.Apis.Drive.v3.Data.File> UploadToMaster(Guid classSessionId, IFormFile file);
        Task<Google.Apis.Drive.v3.Data.File> UploadTo(Guid classSessionId, IFormFile file, MaterialFileType type);
        Task<Google.Apis.Drive.v3.Data.File> Upload(string folderId, Models.User user, IFormFile file);
        Task Delete(Guid classSessionId, string fileId);
        Task UpdatePermissions(Guid classSessionId, Models.User user, List<string> fileIds, List<DTO.SessionAttendeeFileUploaderShare> models);
        Task<bool> SendRequestToLinkGoogleAccount(Guid sessionAttendeeId);
        Task<List<Models.GoogleFilePermission>> GetGoogleFilePermissions(Guid classSessionId, string FileId);
        Task<bool> AddGoogleFilePermissions(List<Models.GoogleFilePermission> list);
        Task<bool> UpdateGoogleFilePermissions(List<Models.GoogleFilePermission> list);
        Task<bool> DeleteGoogleFilePermissions(Guid classSessionId,string FileId);
    }
}
