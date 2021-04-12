using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using StandingOut.Shared.Helpers.GoogleHelper;
using StandingOut.Data.Enums;
using Mapping = StandingOut.Shared.Mapping;

namespace StandingOut.Business.Services
{
    public class SessionAttendeeService : ISessionAttendeeService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IGoogleHelper _GoogleHelper;
        private bool _Disposed;

        public SessionAttendeeService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext
            , UserManager<Models.User> userManager, IGoogleHelper googleHelper)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _UserManager = userManager;
            _GoogleHelper = googleHelper;
        }

		public SessionAttendeeService(IUnitOfWork unitOfWork)
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

        public async Task<List<Models.SessionAttendee>> Get()
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>().Get();
        }

        public async Task<List<Models.SessionAttendee>> GetUnassigned(Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>()
                .Get(o => o.ClassSessionId == classSessionId && !o.SessionGroupId.HasValue);
        }

        public async Task<List<Models.SessionAttendee>> GetByClassSession(Guid classSessionId)
        {
            var excludeDeletedItems = false;
            return await _UnitOfWork.Repository<Models.SessionAttendee>().Get(o => o.ClassSessionId == classSessionId, includeGlobalFilter: excludeDeletedItems);
        }

        public async Task<List<DTO.StudentSession>> GetStudentSessions(string id)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.UserId == id, includeProperties: "ClassSession, ClassSession.SessionAttendees, ClassSession.Owner").OrderByDescending(x => x.ClassSession.StartDate).Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.StudentSession>(x)).ToListAsync();
        }

        public async Task<Models.SessionAttendee> GetByClassSessionAtendeeId(Guid classsessionId, string userId)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.ClassSessionId == classsessionId && o.UserId == userId);
        }

        public async Task<Models.SessionAttendee> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.SessionAttendeeId == id);
        }

        public async Task<Models.SessionAttendee> GetMyByClassSessionId(string userId, Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(x => x.ClassSessionId == classSessionId && x.UserId == userId);
        }

        public async Task<List<DTO.SessionAttendeeFileUploader>> GetForFileUpload(Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && x.Removed == false, includeProperties: "User")
                .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.SessionAttendeeFileUploader>(x))
                .ToListAsync();
        }
        public async Task<List<DTO.SessionAttendeeFileUploader>> GetFilePermission(Guid classSessionId,string fileId)
        {
            var model = await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && x.Removed == false, includeProperties: "User")
                .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.SessionAttendeeFileUploader>(x))
                .ToListAsync();
            var googleFilePermission = await _UnitOfWork.Repository<Models.GoogleFilePermission>().Get(x => x.ClassSessionId == classSessionId && x.FolderName == "Master");
            foreach (var item in model)
            {
                var permission = googleFilePermission.Where(x => x.SessionAttendeeId == item.SessionAttendeeId && x.FileId== fileId).FirstOrDefault();
                if (permission != null)
                {
                    item.IsReadable = permission.IsReadable;
                    item.IsWriteable = permission.IsWriteable;
                }
            }
            return model;
        }

        public async Task<List<DTO.SessionAttendeeFileUploader>> GetForFileUpload(Guid classSessionId, string studentFolderId)
        {
            if (string.IsNullOrEmpty(studentFolderId))
                return await GetForFileUpload(classSessionId);
            else
                return await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && x.SessionAttendeeDirectoryId == studentFolderId && x.Removed == false, includeProperties: "User")
                    .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.SessionAttendeeFileUploader>(x))
                    .ToListAsync();
        }

        public async Task<List<DTO.SessionAttendeeFileUploader>> GetForFileSetup(Guid classSessionId, Models.User user, string fileId)
        {
            var attendees = await GetForFileUpload(classSessionId);

            var file = await _GoogleHelper.GetFileWithAppProperties(user, fileId);

            if (file.AppProperties != null)
            {
                foreach (var entry in file.AppProperties)
                {
                    if (entry.Value == GooglePermissionsMetadataType.read.ToString())
                    {
                        for (int i = 0; i < attendees.Count; i++)
                        {
                            if (attendees[i].SessionAttendeeId.ToString() == entry.Key)
                            {
                                attendees[i].IsWriteable = false;
                                break;
                            }
                        }
                    }
                    else if (entry.Value == GooglePermissionsMetadataType.none.ToString())
                    {
                        for (int i = 0; i < attendees.Count; i++)
                        {
                            if (attendees[i].SessionAttendeeId.ToString() == entry.Key)
                            {
                                attendees[i].IsWriteable = false;
                                attendees[i].IsReadable = false;
                                break;
                            }
                        }
                    }
                }
            }

            return attendees;
        }

        public async Task<Models.SessionAttendee> Create(Models.SessionAttendee model)
        {
            await _UnitOfWork.Repository<Models.SessionAttendee>().Insert(model);
            return model;
        }

        public async Task<Models.SessionAttendee> Update(Models.SessionAttendee model)
        {
            await _UnitOfWork.Repository<Models.SessionAttendee>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var model = await GetById(id);
            model.IsDeleted = true;
            await Update(model);
        }

        public async Task AssociateUser(string userId)
        {
            //var user = await _UserManager.FindByIdAsync(userId);
            //var sessions = await _UnitOfWork.Repository<Models.SessionAttendee>().Get(o => (o.UserId == null || o.UserId == "") && o.EmailPurchasedBy.ToUpper().Trim() == user.NormalizedEmail, includeProperties: "ClassSession, ClassSession.Owner");

            //if (sessions != null && sessions.Count() > 0)
            //{
            //    foreach (var item in sessions)
            //        item.PurchasedById = user.Id;

            //    await _UnitOfWork.Repository<Models.SessionAttendee>().Update(sessions);
            //}

            //sessions = await _UnitOfWork.Repository<Models.SessionAttendee>().Get(o => (o.UserId == null || o.UserId == "") && o.Email.ToUpper().Trim() == user.NormalizedEmail, includeProperties: "ClassSession, ClassSession.Owner");

            //if (sessions != null && sessions.Count() > 0)
            //{
            //    foreach (var item in sessions)
            //    {
            //        item.UserId = user.Id;
            //        item.SessionAttendeeDirectoryName = _GoogleHelper.StudentFolderName(user.FirstName, user.LastName, item.ClassSession);
            //    }

            //    var folderDetails = await _GoogleHelper.CreateSessionAttendeeDirectories(user, sessions);
            //    for (int i = 0; i < sessions.Count && i < folderDetails.StudentFolders.Count; i++)
            //        sessions[i].SessionAttendeeDirectoryId = folderDetails.StudentFolders[i].Id;

            //    await _UnitOfWork.Repository<Models.SessionAttendee>().Update(sessions);
            //}
        }

        public async Task<Models.SessionAttendee> UpdateVideoPermission(DTO.SessionAttendee data)
        {
            var model = await GetById(data.SessionAttendeeId);
            model.VideoEnabled = data.VideoEnabled;
            model.AudioEnabled = data.AudioEnabled;
            model.RoomJoinEnabled = data.RoomJoinEnabled;
            model.ScreenShareEnabled = data.ScreenShareEnabled;
            model.GroupVideoEnabled = data.GroupVideoEnabled;
            model.GroupAudioEnabled = data.GroupAudioEnabled;
            model.GroupRoomJoinEnabled = data.GroupRoomJoinEnabled;
            model.GroupScreenShareEnabled = data.GroupScreenShareEnabled;

            model.CallIndividualsEnabled = data.CallIndividualsEnabled;

            await Update(model);
            return model;
        }

        public async Task<Models.ClassSession> AskForHelpRequest(Guid classSessionId, Models.User user)
        {
            var sessionAttendee = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(x => x.ClassSessionId == classSessionId && x.UserId == user.Id, includeProperties: "ClassSession");
            sessionAttendee.HelpRequested = true;
            await _UnitOfWork.Repository<Models.SessionAttendee>().Update(sessionAttendee);
            return sessionAttendee.ClassSession;
        }

        public async Task<Models.SessionAttendee> DeliverHelpRequest(Guid classSessionId, string userId)
        {
            var sessionAttendee = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(x => x.ClassSessionId == classSessionId && x.UserId == userId);
            sessionAttendee.HelpRequested = false;
            await _UnitOfWork.Repository<Models.SessionAttendee>().Update(sessionAttendee);
            return sessionAttendee;
        }

        public async Task UpdateChatPermission(Guid classSessionId, Guid sessionAttendeeId, bool chatActive)
        {
            string sql = "UPDATE SessionAttendees " +
                "SET ChatActive = " + (chatActive ? "1" : "0") + " " +
                "WHERE SessionAttendeeId = '" + sessionAttendeeId.ToString() + "' AND ClassSessionId = '" + classSessionId.ToString() + "'";

            await _UnitOfWork.ExecuteRawSql(sql);
        }

        public async Task<DTO.ChatPermissions> GetChatPermissions(Guid classSessionId, string userId)
        {
            var chatPermissions = await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && x.UserId == userId)
                .Select(x => new DTO.ChatPermissions() { ChatIndividuals = x.ChatActive, ChatGroup = x.SessionGroup != null ? x.SessionGroup.ChatActive : false, ChatAll = x.ClassSession.ChatActive })
                .FirstOrDefaultAsync();

            return chatPermissions;
        }

        public async Task<DTO.UserBasicCallInfo> GetBasicUserCallInfo(Guid classSessionId, string toUserId)
        {
            return _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && x.UserId == toUserId && !x.IsDeleted, includeProperties: "User")
                .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.UserBasicCallInfo>(x))
                .FirstOrDefault();
        }
    }
}

