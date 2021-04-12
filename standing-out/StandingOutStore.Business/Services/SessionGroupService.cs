using System;
using System.Collections.Generic;
using System.Text;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using StandingOutStore.Business.Services.Interfaces;
using System.Data;
using Dapper;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace StandingOutStore.Business.Services
{
    public class SessionGroupService : ISessionGroupService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IDbConnection _Connection;
        private bool _Disposed;

        public SessionGroupService(IUnitOfWork unitOfWork, IHostingEnvironment hosting,
            IHttpContextAccessor httpContext, UserManager<Models.User> userManager, IDbConnection connection)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _UserManager = userManager;
            _Connection = connection;
        }

        public SessionGroupService(IUnitOfWork unitOfWork)
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

        public async Task<List<Models.SessionGroup>> Get(Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.SessionGroup>().Get(o => o.ClassSessionId == classSessionId, includeProperties: "SessionAttendees, SessionAttendees.User");
        }

        public async Task<Models.SessionGroup> GetById(Guid classSessionId, Guid id)
        {
            return await _UnitOfWork.Repository<Models.SessionGroup>().GetSingle(o => o.SessionGroupId == id && o.ClassSessionId == classSessionId);
        }

        public async Task<Models.SessionGroup> Create(Guid classSessionId, Models.SessionGroup model)
        {
            model.ClassSessionId = classSessionId;
            await _UnitOfWork.Repository<Models.SessionGroup>().Insert(model);
            return model;
        }

        public async Task<Models.SessionGroup> Update(Guid classSessionId, Models.SessionGroup model)
        {
            await _UnitOfWork.Repository<Models.SessionGroup>().Update(model);
            return model;
        }

        public async Task Delete(Guid classSessionId, Guid id)
        {
            var model = await GetById(classSessionId, id);
            model.IsDeleted = true;

            //clear out users from a dead group
            await _UnitOfWork.ExecuteRawSql("UPDATE SessionAttendees SET SessionGroupId = null WHERE SessionGroupId = @p0 AND ClassSessionId = @p1", model.SessionGroupId, model.ClassSessionId);
            await Update(classSessionId, model);
        }

        public async Task RemoveAttendees(Guid classSessionId, List<string> userIds)
        {
            string sql = "UPDATE SessionAttendees " +
                "SET SessionGroupId = NULL, ReadMessagesGroup = 0, GroupRoomJoinEnabled = 0, GroupVideoEnabled = 0, GroupAudioEnabled = 0, GroupScreenShareEnabled = 0 " +
                "WHERE ClassSessionId = @classSessionId " +
                "AND UserId IN @userIds ";


            await _Connection.ExecuteAsync(sql, new { classSessionId = classSessionId, userIds = userIds });
        }

        public async Task MoveAttendees(Guid classSessionId, Guid groupId, List<string> userIds)
        {
            // Find attendees to be removed
            var attendees = await _UnitOfWork.Repository<Models.SessionAttendee>()
                .Get(x => x.ClassSessionId == classSessionId && (x.SessionGroupId == null || x.SessionGroupId != groupId) && userIds.Any(y => y == x.UserId));
            var group = await _UnitOfWork.Repository<Models.SessionGroup>().GetSingle(x => x.SessionGroupId == groupId && x.ClassSessionId == classSessionId);

            if (group == null)
                throw new Exception("Group Not Found");

            // Collect data to inform users of these groups that the users have left
            var previousGroups = attendees.Where(x => x.SessionGroupId.HasValue).Select(x => x.SessionGroupId).Distinct().ToList();

            // Update the attendees to be moved
            attendees.ForEach(x =>
            {
                x.ReadMessagesGroup = 0;
                x.SessionGroupId = groupId;
            });
            await _UnitOfWork.Repository<Models.SessionAttendee>().Update(attendees);
        }






    }
}
