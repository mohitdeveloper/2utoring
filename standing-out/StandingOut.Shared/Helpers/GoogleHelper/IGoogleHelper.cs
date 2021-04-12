using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;

namespace StandingOut.Shared.Helpers.GoogleHelper
{
    public interface IGoogleHelper : IDisposable
    {
        Task ShareFiles(Models.User user, List<DTO.SessionAttendeeFileUploaderShare> userForPermissions, List<string> fileIds);
        Task ShareFilesSetup(Models.User user, List<DTO.SessionAttendeeFileUploaderShare> userForPermissions, List<string> fileIds);

        Task<Google.Apis.Drive.v3.Data.File> GetSessionAttendeeDirectory(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee);
        Task<DTO.SessionFolderDetails> CreateSessionAttendeeDirectories(Models.User user, IList<Models.SessionAttendee> sessions);
        Task<DTO.SessionFolderDetails> CreateSessionAttendeeDirectory(Models.User user, Models.SessionAttendee session, Models.ClassSession classSession);

        Task<DTO.SessionFolderDetails> CreateSessionDirectory(Models.ClassSession classSession);
        Task<Google.Apis.Drive.v3.Data.File> GetSessionDirectory(Models.User user, Models.ClassSession classSession);

        string SessionFolderName(Models.ClassSession classSession);
        string StudentFolderName(Models.User user, Models.ClassSession classSession);
        string StudentFolderName(string firstName, string lastName, Models.ClassSession classSession);
        string MasterStudentFolderName(Models.ClassSession classSession);

        Task<Google.Apis.Drive.v3.Data.FileList> GetSessionDirectoryFiles(Models.User user, Models.ClassSession classSession);
        Task<DTO.FileNavigation> GetSessionDirectoryFilesByFolderIdSame(Models.User user, Models.ClassSession classSession, string folderId, string pageToken);
        Task<Google.Apis.Drive.v3.Data.FileList> GetSessionDirectoryFilesByFolderIdDown(Models.User user, Models.ClassSession classSession, string folderId);
        Task<DTO.FileNavigation> GetSessionDirectoryFilesByFolderIdUp(Models.User user, Models.ClassSession classSession, string folderId);

        Task<Google.Apis.Drive.v3.Data.FileList> GetAttendeeDirectoryFiles(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee);
        Task<DTO.FileNavigation> GetAttendeeDirectoryFilesByFolderIdSame(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee, string folderId, string pageToken);
        Task<Google.Apis.Drive.v3.Data.FileList> GetAttendeeDirectoryFilesByFolderIdDown(Models.User user, Models.ClassSession classSession, string folderId);
        Task<DTO.FileNavigation> GetAttendeeDirectoryFilesByFolderIdUp(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee, string folderId);

        Task<Tuple<IList<Models.SessionAttendee>, DTO.SessionFolderDetails>> CopyFilesFromMasterToStudentFolders(Models.User user, Models.ClassSession classSession, IList<Models.SessionAttendee> activeAttendees);

        Task CreateGoogleFile(Models.User user, DTO.CreateGoogleFile model);
        Task<Google.Apis.Drive.v3.Data.PermissionList> GetPermissions(Models.User user, string fileId);
        Task AlterPermissions(Models.User user, List<string> fileIds, List<DTO.SessionAttendeeFileUploaderShare> models);

        Task<Google.Apis.Drive.v3.Data.File> GetFile(Models.User user, string fileId);
        Task<Google.Apis.Drive.v3.Data.File> GetFileWithAppProperties(Models.User user, string fileId);
        Task<MemoryStream> Download(Models.User user, string fileId);
        Task<Google.Apis.Drive.v3.Data.File> Upload(Models.User user, string folderId, string name, byte[] file);
        Task<Google.Apis.Drive.v3.Data.File> Upload(Models.User user, string folderId, IFormFile file);
        Task<Google.Apis.Drive.v3.Data.File> UploadToTutorFolder(Models.User user, Models.ClassSession classSession, Stream stream, string fileName);
        Task<Google.Apis.Drive.v3.Data.File> UploadToSessionFolder(Models.User user, Models.ClassSession classSession, Stream stream, string fileName);
        Task<Google.Apis.Drive.v3.Data.File> UploadToAttendeeFolder(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee, Stream stream, string fileName);
        Task<bool> DeleteSessionFile(Models.User user, string fileId);
        Task<bool> DeleteAttendeeFile(Models.User user, string fileId);
    }
}
