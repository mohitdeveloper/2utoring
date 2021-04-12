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
using Mapping = StandingOut.Shared.Mapping;

namespace StandingOut.Business.Services
{
    public class SessionGroupService : ISessionGroupService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IClassSessionService _ClassSessionService;
        private bool _Disposed;

        public SessionGroupService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, 
            IHttpContextAccessor httpContext, UserManager<Models.User> userManager, IClassSessionService classSessionService)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _UserManager = userManager;
            _ClassSessionService = classSessionService;
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

        public async Task<List<Models.SessionGroup>> GetByClassSessionIdNoTracking(Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.SessionGroup>().GetQueryable(x => x.ClassSessionId == classSessionId).AsNoTracking().ToListAsync();
        }

        public async Task<List<Models.SessionGroup>> GetMyGroups(Guid classSessionId)
        {
            var user = await _UserManager.FindByEmailAsync(_HttpContext.HttpContext.User.Identity.Name);
            return await _UnitOfWork.Repository<Models.SessionGroup>().Get(o => o.ClassSessionId == classSessionId && o.SessionAttendees.Any(s => s.IsDeleted == false && s.UserId == user.Id), includeProperties: "SessionAttendees, SessionAttendees.User");
        }

        public async Task<List<DTO.ChatroomInstance>> GetMyChatrooms(Guid classSessionId)
        {
            var user = await _UserManager.FindByEmailAsync(_HttpContext.HttpContext.User.Identity.Name);
            var session = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId, includeProperties: "Owner");
            var instances = new List<DTO.ChatroomInstance>();
            var isTutor = _HttpContext.HttpContext.User.IsInRole("Tutor");

            var chatPositions = await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && x.Removed == false).Select(x => new DTO.ChatPosition() { UserId = x.User.Id, GoogleProfilePicture = x.User.GoogleProfilePicture, NumberRead = x.ReadMessagesAll }).ToListAsync();
            chatPositions.Add(new DTO.ChatPosition()
            {
                GoogleProfilePicture = session.Owner.GoogleProfilePicture,
                NumberRead = session.ReadMessagesTutor,
                UserId = session.OwnerId
            });

            instances.Add(new DTO.ChatroomInstance()
            {
                Name = "All",
                Messages = Mapping.Mappings.Mapper.Map<List<Models.SessionMessage>, List<DTO.SessionMessage>>(await _UnitOfWork.Repository<Models.SessionMessage>().Get(o => o.ClassSessionId == classSessionId && o.ToGroupId == null && o.SessionOneToOneChatInstanceId == null && o.ToUserId == null, includeProperties: "FromUser")).OrderByDescending(o => o.LogDate).ToList(),
                ChatPositions = chatPositions.Where(x => x.UserId != user.Id).ToList(),
                CurrentChatPosition = chatPositions.Where(x => x.UserId == user.Id).FirstOrDefault().NumberRead
            });

            List<Models.SessionGroup> groups = new List<Models.SessionGroup>();
            var oneToOnes = await _UnitOfWork.Repository<Models.SessionOneToOneChatInstance>().Get(o => o.Active == true && o.ClassSessionId == classSessionId && o.SessionOneToOneChatInstanceUsers.Any(u => u.UserId == user.Id), includeProperties: "SessionOneToOneChatInstanceUsers, SessionOneToOneChatInstanceUsers.User");


            var sessionAttendees = await _UnitOfWork.Repository<Models.SessionAttendee>().Get(o => o.ClassSessionId == classSessionId && o.UserId != null && o.Removed == false);
            //if tutor setup a 1 to 1 session with every attendee which has a user, otherwise just get my (the users) groups
            if (isTutor)
            {
                groups = await Get(classSessionId);
                var attendees = sessionAttendees.Where(o => !oneToOnes.Any(x => x.SessionOneToOneChatInstanceUsers.Any(u => u.UserId == o.UserId)));

                var oneToOneToAdd = attendees.Select(o => new Models.SessionOneToOneChatInstance()
                {
                    Active = true,
                    ClassSessionId = classSessionId,
                    SessionOneToOneChatInstanceUsers = new List<Models.SessionOneToOneChatInstanceUser>()
                    {
                        new Models.SessionOneToOneChatInstanceUser{ UserId = user.Id },
                        new Models.SessionOneToOneChatInstanceUser{ UserId = o.UserId },
                    }
                }).ToList();


                await _UnitOfWork.Repository<Models.SessionOneToOneChatInstance>().Insert(oneToOneToAdd);
                oneToOnes.AddRange(oneToOneToAdd);

            }
            else
            {
                groups = await GetMyGroups(classSessionId);

                //create my link to the tutor if required
                if (oneToOnes.FirstOrDefault(o => o.ClassSessionId == classSessionId && o.SessionOneToOneChatInstanceUsers.Count(u => u.UserId == user.Id || u.UserId == session.OwnerId) == 2) == null)
                {
                    var oneToOneToAdd = new Models.SessionOneToOneChatInstance()
                    {
                        Active = true,
                        ClassSessionId = classSessionId,
                        SessionOneToOneChatInstanceUsers = new List<Models.SessionOneToOneChatInstanceUser>()
                        {
                            new Models.SessionOneToOneChatInstanceUser{ UserId = user.Id },
                            new Models.SessionOneToOneChatInstanceUser{ UserId = session.OwnerId },
                        }
                    };

                    await _UnitOfWork.Repository<Models.SessionOneToOneChatInstance>().Insert(oneToOneToAdd);
                }

            }

            oneToOnes = await _UnitOfWork.Repository<Models.SessionOneToOneChatInstance>().Get(o => o.Active == true && o.ClassSessionId == classSessionId && o.SessionOneToOneChatInstanceUsers.Any(u => u.UserId == user.Id), includeProperties: "SessionOneToOneChatInstanceUsers, SessionOneToOneChatInstanceUsers.User");



            //put them into instances
            foreach (var item in groups)
            {
                var groupChatPositions = item.SessionAttendees.Select(x => new DTO.ChatPosition() { UserId = x.UserId, GoogleProfilePicture = x.User.GoogleProfilePicture, NumberRead = x.ReadMessagesGroup }).ToList();
                groupChatPositions.Add(new DTO.ChatPosition
                {
                    GoogleProfilePicture = session.Owner.GoogleProfilePicture,
                    NumberRead = item.ReadMessagesTutor,
                    UserId = session.OwnerId
                });
                instances.Add(new DTO.ChatroomInstance()
                {
                    GroupId = item.SessionGroupId,
                    Name = item.Name,
                    Messages = Mapping.Mappings.Mapper.Map<List<Models.SessionMessage>, List<DTO.SessionMessage>>(await _UnitOfWork.Repository<Models.SessionMessage>().Get(o => o.ClassSessionId == classSessionId && o.ToGroupId == item.SessionGroupId, includeProperties: "FromUser")).OrderByDescending(o => o.LogDate).ToList(),
                    ChatPositions = groupChatPositions.Where(x => x.UserId != user.Id).ToList(),
                    CurrentChatPosition = groupChatPositions.FirstOrDefault(x => x.UserId == user.Id).NumberRead
                });
            }
            
            foreach (var item in oneToOnes)
            {
                //get the other user in this relationship, used for the instance name
                var otherUser = item.SessionOneToOneChatInstanceUsers.FirstOrDefault(o => o.UserId != user.Id);

                instances.Add(new DTO.ChatroomInstance()
                {
                    ToUserId = otherUser.User.Id,
                    SessionOneToOneChatInstanceId = item.SessionOneToOneChatInstanceId,
                    Name = $"{otherUser.User.FirstName} {otherUser.User.LastName.Substring(0, 1)}",
                    Messages = Mapping.Mappings.Mapper.Map<List<Models.SessionMessage>, List<DTO.SessionMessage>>(await _UnitOfWork.Repository<Models.SessionMessage>().Get(o => o.ClassSessionId == classSessionId && o.SessionOneToOneChatInstanceId == item.SessionOneToOneChatInstanceId, includeProperties: "FromUser")).OrderByDescending(o => o.LogDate).ToList(),
                    ChatPositions = new List<DTO.ChatPosition>() { new DTO.ChatPosition() { UserId = otherUser.User.Id, GoogleProfilePicture = otherUser.User.GoogleProfilePicture, NumberRead = otherUser.ReadMessages } },
                    CurrentChatPosition = item.SessionOneToOneChatInstanceUsers.FirstOrDefault(o => o.UserId == user.Id).ReadMessages,
                    HelpRequested = isTutor ? sessionAttendees.Where(x => x.UserId == otherUser.UserId && x.HelpRequested && x.Removed == false).Any() : false
                });
            }

            return instances;
        }

        public async Task<Models.SessionGroup> GetById(Guid classSessionId, Guid id)
        {
            return await _UnitOfWork.Repository<Models.SessionGroup>().GetSingle(o => o.SessionGroupId == id && o.ClassSessionId == classSessionId);
        }

        public async Task<Models.SessionGroup> GetByIdNoTracking(Guid classSessionId, Guid id, string includeProperties = "")
        {
            return await _UnitOfWork.Repository<Models.SessionGroup>()
                .GetQueryable(o => o.SessionGroupId == id && o.ClassSessionId == classSessionId, includeProperties: includeProperties)
                .AsNoTracking()
                .FirstOrDefaultAsync();
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

        public async Task MoveAttendee(Guid classSessionId, Guid sessionAttendeeId, Guid? sessionGroupId = null)
        {
            await _UnitOfWork.ExecuteRawSql("UPDATE SessionAttendees SET SessionGroupId = @p0 WHERE ClassSessionId = @p1 AND SessionAttendeeId = @p2", sessionGroupId, classSessionId, sessionAttendeeId);
        }

        public async Task UpdateChatPermission(Guid classSessionId, Guid sessionGroupId, bool chatActive)
        {
            string sql = "UPDATE SessionGroups " +
                "SET chatActive = @p0 " +
                "WHERE SessionGroupId = @p1 AND ClassSessionId = @p2 ";

            await _UnitOfWork.ExecuteRawSql(sql, chatActive ? "1" : "0", sessionGroupId, classSessionId);
        }

        public async Task<(List<DTO.WebcamRoom>, DTO.WebcamRoom, DTO.WebcamRoom)> MoveAttendees(Guid classSessionId, Guid groupId, string[] userIds)
        {
            // Find attendees to be removed
            var attendees = await _UnitOfWork.Repository<Models.SessionAttendee>()
                .Get(x => x.ClassSessionId == classSessionId && (x.SessionGroupId == null || x.SessionGroupId != groupId) && userIds.Any(y => y == x.UserId));
            var group = await _UnitOfWork.Repository<Models.SessionGroup>().GetQueryable(x => x.SessionGroupId == groupId).AsNoTracking().FirstOrDefaultAsync();

            // Collect data to inform users of these groups that the users have left
            var previousGroups = attendees.Where(x => x.SessionGroupId.HasValue)
                .GroupBy(x => x.SessionGroupId)
                .Select(x => new DTO.WebcamRoom()
                {
                    Value = _ClassSessionService.GetGroupWebcamRoomValue(classSessionId, (Guid)x.Key),
                    Identifier = ((Guid)x.Key).ToString(),
                    Users = x.Select(y => new DTO.WebcamGroupUser()
                    {
                        UserId = y.UserId
                    }).ToList()
                }).ToList();

            // Update the attendees to be moved
            attendees.ForEach(x =>
            {
                x.ReadMessagesGroup = 0;
                x.SessionGroupId = groupId;
            });
            await _UnitOfWork.Repository<Models.SessionAttendee>().Update(attendees);

            // Set up new room return for these users
            var nextRoomChanges = new DTO.WebcamRoom()
            {
                Value = _ClassSessionService.GetGroupWebcamRoomValue(classSessionId, groupId),
                Identifier = groupId.ToString(),
                Users = attendees.Select(x => new DTO.WebcamGroupUser()
                {
                    UserId = x.UserId,
                    FirstName = x.FirstName,
                    LastName = x.LastName
                }
                ).ToList()
            };

            // Send back -> Groups that must be informed of changes due to removal, and adding, also full room info for users moved
            var users = await _UnitOfWork.Repository<Models.SessionAttendee>()
                .GetQueryable(x => x.SessionGroupId == groupId && x.ClassSessionId == classSessionId)
                .AsNoTracking()
                .Select(x => new DTO.WebcamGroupUser()
                {
                    UserId = x.UserId,
                    FirstName = x.FirstName,
                    LastName = x.LastName
                }).ToListAsync();
            users.Add(await _UnitOfWork.Repository<Models.ClassSession>()
                .GetQueryable(x => x.ClassSessionId == classSessionId, includeProperties: "Owner")
                .AsNoTracking()
                .Select(x => new DTO.WebcamGroupUser()
                {
                    UserId = x.Owner.Id,
                    FirstName = x.Owner.FirstName,
                    LastName = x.Owner.LastName
                }).FirstAsync());



            int counter = 0;

            foreach(var item in previousGroups)
            {
                counter = 0;

                item.Users.ForEach(o =>
                {
                    o.OriginalPosition = counter;
                    o.Position = counter;
                    counter++;
                });
            }

            counter = 0;
            nextRoomChanges.Users.ForEach(o =>
            {
                o.OriginalPosition = counter;
                o.Position = counter;
                counter++;
            });





            return (previousGroups, nextRoomChanges, new DTO.WebcamRoom()
            {
                Value = nextRoomChanges.Value,
                Identifier = nextRoomChanges.Identifier,
                Text = group.Name,
                Users = users,
                Type = Data.Enums.WebcamGroupType.Group
            });
        }

        public async Task RemoveAttendees(Guid classSessionId, string[] userIds)
        {
            string sql = "UPDATE SessionAttendees " +
                "SET SessionGroupId = NULL, ReadMessagesGroup = 0, GroupRoomJoinEnabled = 0, GroupVideoEnabled = 0, GroupAudioEnabled = 0, GroupScreenShareEnabled = 0 " +
                "WHERE ClassSessionId = @p0 " +
                "AND UserId IN ( ";

            IList<object> parameters = new List<object>()
            {
                classSessionId
            };

            string inClause = string.Empty;
            for (int i = 0; i < userIds.Length; i++)
            {
                inClause += $"@p{i + 1}, ";
                parameters.Add(userIds[i]);
            }

            inClause = inClause.Remove(inClause.Length - 2);

            await _UnitOfWork.ExecuteRawSql($"{sql}{inClause} ) ", parameters.ToArray());
        }

        public async Task<DTO.ChatroomInstance> GetGroupChatroom(Guid classSessionId, Guid groupId)
        {
            var user = await _UserManager.FindByEmailAsync(_HttpContext.HttpContext.User.Identity.Name);
            var group = await _UnitOfWork.Repository<Models.SessionGroup>().GetSingle(o => o.ClassSessionId == classSessionId && o.SessionGroupId == groupId, includeProperties: "SessionAttendees, SessionAttendees.User, ClassSession, ClassSession.Owner");

            var groupChatPositions = group.SessionAttendees.Select(x => new DTO.ChatPosition() { UserId = x.UserId, GoogleProfilePicture = x.User.GoogleProfilePicture, NumberRead = x.ReadMessagesGroup }).ToList();
            groupChatPositions.Add(new DTO.ChatPosition
            {
                GoogleProfilePicture = group.ClassSession.Owner.GoogleProfilePicture,
                NumberRead = group.ReadMessagesTutor,
                UserId = group.ClassSession.OwnerId
            });

            return new DTO.ChatroomInstance()
            {
                GroupId = group.SessionGroupId,
                Name = group.Name,
                Messages = Mapping.Mappings.Mapper.Map<List<Models.SessionMessage>, List<DTO.SessionMessage>>(await _UnitOfWork.Repository<Models.SessionMessage>().Get(o => o.ClassSessionId == classSessionId && o.ToGroupId == group.SessionGroupId, includeProperties: "FromUser")).OrderByDescending(o => o.LogDate).ToList(),
                ChatPositions = groupChatPositions.Where(x => x.UserId != user.Id).ToList(),
                CurrentChatPosition = groupChatPositions.FirstOrDefault(x => x.UserId == user.Id).NumberRead,
                ChatActive = group.ChatActive
            };
        }

        public async Task<List<DTO.UserBasicCallInfo>> GetBasicUserCallInfo(Guid classSessionId, Guid groupId, string fromUserId)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.SessionGroupId == groupId && x.ClassSessionId == classSessionId && !x.IsDeleted && x.UserId != fromUserId, includeProperties: "User")
                .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.UserBasicCallInfo>(x))
                .ToListAsync();
        }
    }
}

