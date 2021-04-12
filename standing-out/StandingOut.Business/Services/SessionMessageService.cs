using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace StandingOut.Business.Services
{
    public class SessionMessageService : ISessionMessageService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public SessionMessageService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext,
            UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _UserManager = userManager;
        }

		public SessionMessageService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.SessionMessage>> Get()
        {
            return await _UnitOfWork.Repository<Models.SessionMessage>().Get();
        }

        public async Task<Models.SessionMessage> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SessionMessage>().GetSingle(o => o.SessionMessageId == id, includeProperties: "FromUser");
        }

        public async Task<Models.SessionMessage> Create(Models.SessionMessage model)
        {
            await _UnitOfWork.Repository<Models.SessionMessage>().Insert(model);
            return model;
        }

        public async Task<Models.SessionMessage> Create(string message, Guid classSessionId, string tutorId, Guid? groupId = null, string toUserId = null, Guid? sessionOneToOneChatInstanceId = null)
        {
            var user = await _UserManager.FindByEmailAsync(_HttpContext.HttpContext.User.Identity.Name);

            var model = new Models.SessionMessage()
            {
                ClassSessionId = classSessionId,
                FromUserId = user.Id,
                ToGroupId = groupId,
                ToUserId = toUserId,
                SessionOneToOneChatInstanceId = sessionOneToOneChatInstanceId,
                LogDate = DateTime.Now,
                Message = message,
                FromUser = user
            };

            Models.SessionMessage sessionMessage = await Create(model);

            await IncrementReadMessages(user.Id, classSessionId, tutorId, groupId, sessionOneToOneChatInstanceId);

            return sessionMessage;
        }

        private async Task UpdateOneToOneReadCount(string userId, Guid sessionToOneChatInstanceId
            , string setClause = "(SELECT COUNT(*) FROM SessionMessages WHERE SessionOneToOneChatInstanceId = @p0)")
        {
            string sql = "UPDATE SessionOneToOneChatInstanceUsers " +
                    $"SET ReadMessages = {setClause} " +
                    "WHERE SessionOneToOneChatInstanceId = @p0 AND UserId = @p1 ";

            await _UnitOfWork.ExecuteRawSql(sql, sessionToOneChatInstanceId, userId);
        }

        private async Task UpdateGroupReadCount(string userId, Guid classSessionId, Guid groupId
            , string setClause = "(SELECT COUNT(*) FROM SessionMessages WHERE ToGroupId = @p0)")
        {
            string sql = "UPDATE SessionAttendees " +
                    $"SET ReadMessagesGroup = {setClause} " +
                    "WHERE ClassSessionId = @p1 AND UserId = @p2 ";

            await _UnitOfWork.ExecuteRawSql(sql, groupId, classSessionId, userId);
        }

        private async Task UpdateGroupReadCountForTutor(Guid groupId
            , string setClause = "(SELECT COUNT(*) FROM SessionMessages WHERE ToGroupId = @p0)")
        {
            string sql = "UPDATE SessionGroups " +
                    $"SET ReadMessagesTutor = {setClause} " +
                    "WHERE SessionGroupId = @p0 ";

            await _UnitOfWork.ExecuteRawSql(sql, groupId);
        }

        private async Task UpdateAllReadCount(string userId, Guid classSessionId
            , string setClause = "(SELECT COUNT(*) FROM SessionMessages WHERE ClassSessionId = @p0 AND ToGroupId IS NULL AND SessionOneToOneChatInstanceId IS NULL)")
        {
            string sql = "UPDATE SessionAttendees " +
                    $"SET ReadMessagesAll = {setClause} " +
                    "WHERE ClassSessionId = @p0 AND UserId = @p1 ";

            await _UnitOfWork.ExecuteRawSql(sql, classSessionId, userId);
        }

        private async Task UpdateAllReadCountForTutor(Guid classSessionId
            , string setClause = "(SELECT COUNT(*) FROM SessionMessages WHERE ClassSessionId = @p0 AND ToGroupId IS NULL AND SessionOneToOneChatInstanceId IS NULL)")
        {
            string sql = "UPDATE ClassSessions " +
                    $"SET ReadMessagesTutor = {setClause} " +
                    "WHERE ClassSessionId = @p0 ";

            await _UnitOfWork.ExecuteRawSql(sql, classSessionId);
        }

        private async Task IncrementReadMessages(string userId, Guid classSessionId, string tutorId, Guid? groupId = null, Guid? sessionToOneChatInstanceId = null)
        {
            if (sessionToOneChatInstanceId != null)
                await UpdateOneToOneReadCount(userId, sessionToOneChatInstanceId.Value, "ReadMessages + 1");
            else if (groupId != null)
            {
                if (userId == tutorId)
                    await UpdateGroupReadCountForTutor(groupId.Value, "ReadMessagesTutor + 1");
                else
                    await UpdateGroupReadCount(userId, classSessionId, groupId.Value, "ReadMessagesGroup + 1");
            }
            else
            {
                if (userId == tutorId)
                    await UpdateAllReadCountForTutor(classSessionId, "ReadMessagesTutor + 1");
                else
                    await UpdateAllReadCount(userId, classSessionId, "ReadMessagesAll + 1");
            }
        }

        public async Task UpdateReadStatus(Guid classSessionId, string tutorId, string userId, Guid? groupId = null, Guid? sessionToOneChatInstanceId = null)
        {
            if (sessionToOneChatInstanceId != null)
                await UpdateOneToOneReadCount(userId, sessionToOneChatInstanceId.Value);
            else if (groupId != null)
            {
                if (userId == tutorId)
                    await UpdateGroupReadCountForTutor(groupId.Value);
                else
                    await UpdateGroupReadCount(userId, classSessionId, groupId.Value);
            }
            else
            {
                if (userId == tutorId)
                    await UpdateAllReadCountForTutor(classSessionId);
                else
                    await UpdateAllReadCount(userId, classSessionId);
            }
        }

        public async Task<Models.SessionMessage> Update(Models.SessionMessage model)
        {
            await _UnitOfWork.Repository<Models.SessionMessage>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var model = await GetById(id);
            model.IsDeleted = true;
            await Update(model);
        }
    }
}

