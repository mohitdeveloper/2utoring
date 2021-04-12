using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using StandingOut.Shared.Helpers.GoogleHelper;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace StandingOut.Business.Services
{
    public class SessionDocumentService : ISessionDocumentService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private bool _Disposed;
        private readonly IGoogleHelper _GoogleHelper;

        public SessionDocumentService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IGoogleHelper googleHelper)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _GoogleHelper = googleHelper;
        }

        public SessionDocumentService(IUnitOfWork unitOfWork)
        {
            _UnitOfWork = unitOfWork;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        // If the user is the owner then they are the tutor
        public async Task<DTO.FileNavigation> Get(Guid classSessionId, Models.User user, string studentId = null, bool sharedFolder = false)
        {
            DTO.FileNavigation navigation = new DTO.FileNavigation();
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId, includeProperties: "Owner, SessionAttendees");

            if (user.Id != classSession.Owner.Id)
            {
                var attendee = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.ClassSessionId == classSessionId && o.UserId == user.Id);
                var attendeeFolder = await _GoogleHelper.GetFile(user, classSession.SharedStudentDirectoryId);
                var fileList = await _GoogleHelper.GetAttendeeDirectoryFiles(user, classSession, attendee);
                if (attendeeFolder != null && attendeeFolder.Id != null)
                    fileList.Files.Insert(0, attendeeFolder);

                navigation.Files = fileList.Files;
                navigation.RootFolderId = attendee.SessionAttendeeDirectoryId;
                navigation.NextPageToken = fileList.NextPageToken;
                navigation.CurrentFolderId = attendee.SessionAttendeeDirectoryId;
            }
            else
            {
                Google.Apis.Drive.v3.Data.FileList fileList = null;
                if (string.IsNullOrEmpty(studentId) && sharedFolder == false)
                {
                    fileList = await _GoogleHelper.GetSessionDirectoryFiles(user, classSession);
                }
                else if (sharedFolder)
                {
                    fileList = await _GoogleHelper.GetSessionDirectoryFilesByFolderIdDown(user, classSession, classSession.SharedStudentDirectoryId);
                    navigation.CurrentFolderId = classSession.SharedStudentDirectoryId;
                    navigation.RootFolderId = classSession.SessionDirectoryId;
                }
                else
                {
                    var folderId = classSession.SessionAttendees.FirstOrDefault(x => x.UserId == studentId)?.SessionAttendeeDirectoryId;
                    if (folderId != null)
                        fileList = await _GoogleHelper.GetSessionDirectoryFilesByFolderIdDown(user, classSession, folderId);
                    navigation.CurrentFolderId = folderId;
                    navigation.RootFolderId = classSession.SessionDirectoryId;
                }

                if (fileList != null)
                {
                    navigation.Files = fileList.Files;
                    navigation.NextPageToken = fileList.NextPageToken;
                }

                navigation.MasterFolderId = classSession.MasterStudentDirectoryId;
                navigation.StudentFolderId = classSession.BaseStudentDirectoryId;
                navigation.SharedFolderId = classSession.SharedStudentDirectoryId;

                navigation.ShowAsImportant = new List<string>()
                {
                    classSession.MasterStudentDirectoryId,
                    classSession.SharedStudentDirectoryId
                };

                navigation.DisallowUploadIn = new List<string>()
                {
                    classSession.SessionDirectoryId,
                    classSession.BaseStudentDirectoryId
                };

                navigation.DisallowDeleteOn = new List<string>()
                {
                    classSession.SessionDirectoryId,
                    classSession.BaseStudentDirectoryId,
                    classSession.BaseTutorDirectoryId,
                    classSession.MasterStudentDirectoryId,
                    classSession.SharedStudentDirectoryId
                };

                navigation.StudentFolders = classSession.SessionAttendees.Select(x => x.SessionAttendeeDirectoryId).ToList();
                navigation.DisallowDeleteOn.AddRange(navigation.StudentFolders.ToList());
            }

            return navigation;
        }

        public async Task<DTO.FileNavigation> GetByFolderIdSame(Guid classSessionId, Models.User user, string folderId, string pageToken = "")
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId, includeProperties: "Owner");
            if (user.Id != classSession.Owner.Id)
            {
                var attendee = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.ClassSessionId == classSessionId && o.UserId == user.Id);
                return await _GoogleHelper.GetAttendeeDirectoryFilesByFolderIdSame(user, classSession, attendee, folderId, pageToken);
            }
            else
                return await _GoogleHelper.GetSessionDirectoryFilesByFolderIdSame(user, classSession, folderId, pageToken);
        }

        public async Task<Google.Apis.Drive.v3.Data.FileList> GetByFolderIdDown(Guid classSessionId, Models.User user, string folderId)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId, includeProperties: "Owner");
            if (user.Id != classSession.Owner.Id)
                return await _GoogleHelper.GetAttendeeDirectoryFilesByFolderIdDown(user, classSession, folderId);
            else
                return await _GoogleHelper.GetSessionDirectoryFilesByFolderIdDown(user, classSession, folderId);
        }

        public async Task<DTO.FileNavigation> GetByFolderIdUp(Guid classSessionId, Models.User user, string folderId)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId, includeProperties: "Owner");
            if (user.Id != classSession.Owner.Id)
            {
                var attendee = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.ClassSessionId == classSessionId && o.UserId == user.Id);
                return await _GoogleHelper.GetAttendeeDirectoryFilesByFolderIdUp(user, classSession, attendee, folderId);
            }
            else
                return await _GoogleHelper.GetSessionDirectoryFilesByFolderIdUp(user, classSession, folderId);
        }

        public async Task ShareFileUpload(Guid classSessionId, Models.User user, List<string> fileIds, List<DTO.SessionAttendeeFileUploaderShare> models)
        {
            // Remove any without permissions
            models = models.Where(x => x.IsWriteable || x.IsReadable).ToList();

            if (models.Count > 0)
            {
                // Pull extra info needed for google calls
                var classSessionDirectories = await _UnitOfWork.Repository<Models.SessionAttendee>()
                    .GetQueryable(x => x.ClassSessionId == classSessionId && models.Select(y => y.SessionAttendeeId).Contains(x.SessionAttendeeId))
                    .Select(x => new DTO.SessionAttendeeFileUploaderUser() { SessionAttendeeId = x.SessionAttendeeId, SessionAttendeeFolder = x.SessionAttendeeDirectoryId, Email = x.User.GoogleEmail })
                    .ToListAsync();

                // Map the extra info to the input info
                for (int i = 0; i < models.Count; i++)
                {
                    for (int j = 0; j < classSessionDirectories.Count; j++)
                    {
                        if (classSessionDirectories[j].SessionAttendeeId == models[i].SessionAttendeeId)
                        {
                            models[i].SessionAttendeeFolder = classSessionDirectories[j].SessionAttendeeFolder;
                            models[i].Email = classSessionDirectories[j].Email;
                            break;
                        }
                    }
                }

                // GOOGLE CALL HERE FOR COPY/PERMISSIONS
                await _GoogleHelper.ShareFiles(user, models, fileIds);

                #region Store Permission in DB
                List<Models.GoogleFilePermission> list = new List<Models.GoogleFilePermission>();
                foreach (var item in models)
                {
                    var sessionAttendeeObj = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.SessionAttendeeId == item.SessionAttendeeId);
                    Models.GoogleFilePermission obj = new Models.GoogleFilePermission();
                    obj.ClassSessionId = classSessionId;
                    obj.UserId = sessionAttendeeObj.UserId;
                    obj.SessionAttendeeId = item.SessionAttendeeId;
                    obj.FileId = fileIds[0];
                    if(item.IsWriteable)
                    {
                        obj.IsReadable = true;
                        obj.IsWriteable = true;
                    }
                    else
                    {
                        obj.IsReadable = item.IsReadable;
                        obj.IsWriteable = item.IsWriteable;
                    }

                    //obj.IsReadable = (item.IsReadable==true || item.IsWriteable==true)?true:false;
                    //obj.IsWriteable = (item.IsReadable == true || item.IsWriteable == true) ? true : false; 
                    obj.FolderName = string.IsNullOrEmpty(item.FolderName)?"Master":"";
                    list.Add(obj);
                }
                await DeleteGoogleFilePermissions(classSessionId, fileIds[0]);
                await AddGoogleFilePermissions(list);
                #endregion;
            }
        }
        public async Task<bool> AddGoogleFilePermissions(List<Models.GoogleFilePermission> list)
        {
            if (list.Count > 0)
            {
                await _UnitOfWork.Repository<Models.GoogleFilePermission>().Insert(list);
                return true;
            }
            return false;
        }
        public async Task<bool> UpdateGoogleFilePermissions(List<Models.GoogleFilePermission> list)
        {
            if (list.Count > 0)
            {
                foreach (var item in list)
                {
                    if (item.GoogleFilePermissionId == Guid.Empty)
                    {
                        await _UnitOfWork.Repository<Models.GoogleFilePermission>().Insert(item);
                    }
                    else
                    {
                        await _UnitOfWork.Repository<Models.GoogleFilePermission>().Update(item);
                    }
                }
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteGoogleFilePermissions(Guid classSessionId, string FileId)
        {
            var GooglePermissionList = await _UnitOfWork.Repository<Models.GoogleFilePermission>().Get(x => x.FileId == FileId && x.ClassSessionId == classSessionId);
            if (GooglePermissionList.Count > 0)
            {
                await _UnitOfWork.Repository<Models.GoogleFilePermission>().Delete(GooglePermissionList);
                return true;
            }
            return false;
        }
        public async Task<List<DTO.SessionAttendeeFileUploader>> GetPermissions(Guid classSessionId, Models.User user, string fileId, List<DTO.SessionAttendeeFileUploader> models)
        {
            var permissions = await _GoogleHelper.GetPermissions(user, fileId);
            foreach (var model in models)
            {
                var permission = permissions.Permissions.FirstOrDefault(x => x.EmailAddress == model.Email);
                if (permission != null)
                {
                    if (permission.Role == PermissionsRole.writer.ToString())
                    {
                        model.IsWriteable = true;
                        model.IsReadable = true;
                    }
                    else if (permission.Role == PermissionsRole.reader.ToString())
                    {
                        model.IsWriteable = false;
                        model.IsReadable = true;
                    }
                    else
                    {
                        model.IsWriteable = false;
                        model.IsReadable = false;
                    }
                }
            }
            return models;
        }

        public async Task UpdatePermissions(Guid classSessionId, Models.User user, List<string> fileIds, List<DTO.SessionAttendeeFileUploaderShare> models)
        {
            await _GoogleHelper.AlterPermissions(user, fileIds, models);
        }

        public async Task CreateGoogleFile(Guid classSessionId, Models.User user, DTO.CreateGoogleFile model)
        {
            await _GoogleHelper.CreateGoogleFile(user, model);
        }

        public async Task ShareFileUploadSetup(Guid classSessionId, Models.User user, List<string> fileIds, List<DTO.SessionAttendeeFileUploaderShare> models)
        {
            await _GoogleHelper.ShareFilesSetup(user, models, fileIds);
        }

        public async Task<Google.Apis.Drive.v3.Data.File> UploadToMaster(Guid classSessionId, Models.User user, IFormFile file)
        {
            var masterFolderId = await _UnitOfWork.Repository<Models.ClassSession>().GetQueryable(x => x.ClassSessionId == classSessionId).Select(x => x.MasterStudentDirectoryId).FirstOrDefaultAsync();
            return await Upload(masterFolderId, user, file);
        }

        public async Task<Google.Apis.Drive.v3.Data.File> ExportWhiteBoard(Guid classSessionId, string userId, DTO.SessionWhiteBoardSaveImage imageInfo)
        {
            imageInfo.Name = imageInfo.Name + ".png";

            string folderId = null;
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(x => x.ClassSessionId == classSessionId, includeProperties: "Owner");
            if (userId == classSession.OwnerId)
                folderId = classSession.BaseTutorDirectoryId;
            else
                folderId = await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && x.UserId == userId).Select(x => x.SessionAttendeeDirectoryId).FirstOrDefaultAsync();

            return await _GoogleHelper.Upload(classSession.Owner, folderId, imageInfo.Name, Convert.FromBase64String(imageInfo.ImageData));
        }

        public async Task<Google.Apis.Drive.v3.Data.File> Upload(string folderId, Models.User user, IFormFile file)
        {
            var files = await _GoogleHelper.Upload(user, folderId, file);
            return files;
        }

        public async Task<Google.Apis.Drive.v3.Data.File> Upload(Guid classSessionId, Models.User user, DTO.ScreenshotData model)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId, includeProperties: "Owner");

            byte[] data = Convert.FromBase64String(model.ImageData.Replace("data:image/png;base64,", ""));
            var stream = new MemoryStream(data, 0, data.Length);
            stream.Position = 0;

            Google.Apis.Drive.v3.Data.File file;
            if (user.Id != classSession.OwnerId)
            {
                var sessionAttendee = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.ClassSessionId == classSessionId && o.UserId == user.Id);
                file = await _GoogleHelper.UploadToAttendeeFolder(user, classSession, sessionAttendee, stream, $"{model.Name}.png");
            }
            else
                file = await _GoogleHelper.UploadToTutorFolder(user, classSession, stream, $"{model.Name}.png");

            return file;
        }

        public async Task<bool> Delete(Guid classSessionId, Models.User user, string fileId)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId, includeProperties: "Owner, SessionAttendees");

            if (!CheckFileCanbeDeleted(classSession, classSession?.SessionAttendees, fileId))
                return false;

            if (user.Id != classSession.OwnerId)
                return await _GoogleHelper.DeleteAttendeeFile(user, fileId);
            else
                return await _GoogleHelper.DeleteSessionFile(user, fileId);
        }

        private bool CheckFileCanbeDeleted(Models.ClassSession classSession, IList<Models.SessionAttendee> sessionAttendees, string fileId)
        {
            if (classSession == null || classSession.SessionDirectoryId == fileId || classSession.BaseTutorDirectoryId == fileId
                || classSession.BaseStudentDirectoryId == fileId || classSession.MasterStudentDirectoryId == fileId)
                return false;
            else if (sessionAttendees != null && sessionAttendees.Any(x => x.SessionAttendeeDirectoryId == fileId))
                return false;
            else
                return true;
        }

        
    }
}
