using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using StandingOut.Shared.Helpers.GoogleHelper;
using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data.Enums;
using DTO = StandingOut.Data.DTO;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace StandingOutStore.Business.Services
{
    public class SessionDocumentService : ISessionDocumentService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private bool _Disposed;
        private readonly IGoogleHelper _GoogleHelper;
        private readonly UserManager<Models.User> _UserManager;

        public SessionDocumentService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IGoogleHelper googleHelper, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _GoogleHelper = googleHelper;
            _UserManager = userManager;
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

        public async Task<IList<Google.Apis.Drive.v3.Data.File>> GetMasterFiles(Guid classSessionId)
        {
            return await GetFiles(classSessionId, MaterialFileType.Master);
        }

        public async Task<IList<Google.Apis.Drive.v3.Data.File>> GetFiles(Guid classSessionId, MaterialFileType type)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId);
            var owner = await _UserManager.FindByIdAsync(classSession.OwnerId);

            string fileTypeId = await GetFolderType(type, classSession);
            var fileList = await _GoogleHelper.GetSessionDirectoryFilesByFolderIdDown(owner, classSession, fileTypeId);
            return fileList.Files;
        }

        public async Task<Google.Apis.Drive.v3.Data.File> UploadToMaster(Guid classSessionId, IFormFile file)
        {
            return await UploadTo(classSessionId, file, MaterialFileType.Master);
        }

        public async Task<Google.Apis.Drive.v3.Data.File> UploadTo(Guid classSessionId, IFormFile file, MaterialFileType type)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId);
            var owner = await _UserManager.FindByIdAsync(classSession.OwnerId);
            string fileTypeId = await GetFolderType(type, classSession);
            return await Upload(fileTypeId, owner, file);
        }

        public async Task<Google.Apis.Drive.v3.Data.File> Upload(string folderId, Models.User user, IFormFile file)
        {
            var files = await _GoogleHelper.Upload(user, folderId, file);
            return files;
        }

        public async Task Delete(Guid classSessionId, string fileId)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId);
            var owner = await _UserManager.FindByIdAsync(classSession.OwnerId);
            await _GoogleHelper.DeleteSessionFile(owner, fileId);
        }

        private async Task<string> GetFolderType(MaterialFileType type, Models.ClassSession classSession)
        {
            string fileTypeId = classSession.MasterStudentDirectoryId;

            switch (type)
            {
                case MaterialFileType.Master:
                    fileTypeId = classSession.MasterStudentDirectoryId;
                    break;
                case MaterialFileType.Shared:
                    fileTypeId = classSession.SharedStudentDirectoryId;
                    break;
                case MaterialFileType.Tutor:
                    fileTypeId = classSession.BaseTutorDirectoryId;
                    break;
            }

            return fileTypeId;
        }

        public async Task UpdatePermissions(Guid classSessionId, Models.User user, List<string> fileIds, List<DTO.SessionAttendeeFileUploaderShare> models)
        {
            //await _GoogleHelper.AlterPermissions(user, fileIds, models);
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
                obj.IsReadable = item.IsWriteable;
                //obj.IsReadable = (item.IsReadable == true || item.IsWriteable == true) ? true : false;
                obj.IsWriteable = item.IsWriteable;
                obj.FolderName = item.FolderName;
                list.Add(obj);
            }
            await DeleteGoogleFilePermissions(classSessionId, fileIds[0]);
            await AddGoogleFilePermissions(list);
            #endregion;
        }
        public async Task<bool> SendRequestToLinkGoogleAccount(Guid sessionAttendeeId)
        {
            try
            {
                var user = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.SessionAttendeeId == sessionAttendeeId, includeProperties: "User");
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();
                #region User Name
                string fName = user.FirstName;
                string lName = user.LastName;
                fName = char.ToUpper(fName[0]) + fName.Substring(1);
                lName = char.ToUpper(lName[0]) + lName.Substring(1);
                #endregion
                await Utilities.EmailUtilities.SendTemplateEmail
                   (
                       settings.SendGridApi,
                       System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\SendRequestToLinkGoogleAccount.html"),
                       new Dictionary<string, string>()
                        {
                         { "{{userFullName}}", fName + " " + lName },

                        },
                       user.Email,
                       settings.SendGridFromEmail,
                       $"{fName + " " + lName} please link your google account"
                   );
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public async Task<List<Models.GoogleFilePermission>> GetGoogleFilePermissions(Guid classSessionId, string FileId)
        {
            var ObjPermission = await _UnitOfWork.Repository<Models.GoogleFilePermission>().Get(o => o.ClassSessionId == classSessionId && o.FileId == FileId);
            return ObjPermission;
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
    }
}
