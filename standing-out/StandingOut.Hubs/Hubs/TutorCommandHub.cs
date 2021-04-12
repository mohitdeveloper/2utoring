using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using StandingOut.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Linq;
using System.Collections.Generic;
using StandingOut.Shared.Mapping;

namespace StandingOut.Hubs.Hubs
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class TutorCommandHub : BaseHub
    {
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly IClassSessionService _ClassSessionService;
        private readonly ISessionGroupService _SessionGroupService;
        private readonly ISessionMediaService _SessionMediaService;
        private readonly ISessionDocumentService _SessionDocumentService;

        public TutorCommandHub(UserManager<Models.User> userManager, ISessionAttendeeService sessionAttendeeService, IClassSessionService classSessionService,
            ISessionGroupService sessionGroupService, ISessionMediaService sessionMediaService, ISessionDocumentService sessionDocumentService)
            :base(userManager)
        {
            _SessionAttendeeService = sessionAttendeeService;
            _ClassSessionService = classSessionService;
            _SessionGroupService = sessionGroupService;
            _SessionMediaService = sessionMediaService;
            _SessionDocumentService = sessionDocumentService;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            // Try this out
            //return _UserManager.FindByEmailAsync(Context.User.Identity.Name)
            //    .ContinueWith((user) => Clients.All.SendAsync("userDisconnected", user.Id))
            //    .ContinueWith(t => base.OnDisconnectedAsync(exception));

            var user = _UserManager.FindByEmailAsync(Context.User.Identity.Name).Result;
            Clients.All.SendAsync("userDisconnected", user.Id);

            return base.OnDisconnectedAsync(exception);
        }

        public Task Ping()
        {
            return Clients.Caller.SendAsync("pingTutorCommand");
        }

        public async Task<Task> Connect(Guid classSessionId, Guid? groupId = null)
        {
            var task = Groups.AddToGroupAsync(Context.ConnectionId, classSessionId.ToString());
            var user = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            Task groupTask = null;

            if (await _UserManager.IsInRoleAsync(user, "Tutor"))
            {
                var groups = await _SessionGroupService.GetByClassSessionIdNoTracking(classSessionId);
                foreach (var group in groups)
                    await Groups.AddToGroupAsync(Context.ConnectionId, group.SessionGroupId.ToString());
                groupTask = Clients.OthersInGroup(classSessionId.ToString()).SendAsync("checkOnline");
            }
            else
            {
                if (groupId != null)
                    groupTask = Groups.AddToGroupAsync(Context.ConnectionId, groupId.ToString());
            }

            var userTask = Clients.OthersInGroup(classSessionId.ToString()).SendAsync("userConnected", user.Id);

            // Can use WhenAll here as only 1 db call here (EF won't freak out)
            if (groupTask == null)
                return Task.WhenAll(task, userTask);
            else
                return Task.WhenAll(task, groupTask, userTask);
        }

        public Task DisconnectFromGroup(Guid groupId)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId.ToString());
        }

        public Task ConnectToGroup(Guid groupId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, groupId.ToString());
        }

        public async Task<Task> StudentOnlineRequest(Guid classSessionId)
        {
            var student = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("userConnected", student.Id);
        }

        public async Task<Task> SessionStarted(Guid classSessionId)
        {
            var classSession = await _ClassSessionService.GetById(classSessionId);
            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("sessionStarted", classSession.DueEndDate);
        }

        public Task SessionEnded(Guid classSessionId)
        {
            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("sessionEnded");
        }

        public override Task OnConnectedAsync()
        {
            return _UserManager.FindByEmailAsync(Context.User.Identity.Name)
                .ContinueWith((user) => Groups.AddToGroupAsync(Context.ConnectionId, user.Result.Id))
                .ContinueWith(t => base.OnConnectedAsync());
        }

        public Task ConnectToStudent(string studentId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, studentId);
        }

        public async Task<Task> AddMedia(Guid classSessionId, Guid sessionMediaId)
        {
            var media = await _SessionMediaService.GetById(classSessionId, sessionMediaId);
            if (media == null)
                return null;
            else
                return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("mediaAdded", Mappings.Mapper.Map<Models.SessionMedia, DTO.SessionMedia>(media));
        }

        public async Task<Task> EditMedia(Guid classSessionId, Guid sessionMediaId)
        {
            var media = await _SessionMediaService.GetById(classSessionId, sessionMediaId);
            if (media != null)
                return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("mediaEdited", Mappings.Mapper.Map<Models.SessionMedia, DTO.SessionMedia>(media));
            else
                return null;
        }

        public Task DeleteMedia(Guid classSessionId, Guid sessionMediaId)
        {
            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("mediaDeleted", sessionMediaId);
        }

        public async Task<Task> StudentPermissionChange(Guid classSessionId, Guid sessionAttendeeId, string toStudentId, string permissionChanged, DTO.SessionAttendee data)
        {
            await _SessionAttendeeService.UpdateVideoPermission(data);
            if (data.Online)
            {
                data.ChangedPermission = permissionChanged;
                return Clients.OthersInGroup(toStudentId).SendAsync("studentPermissionChange", data);
            }
            else
                return Clients.Caller.SendAsync("userWasOffline");
        }

        public async Task<Task> AllPermissionChangeChat(Guid classSessionId, bool chatActive)
        {
            await _ClassSessionService.UpdateChatPermission(classSessionId, chatActive);
            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("allPermissionChangeChat", chatActive);
        }

        public async Task<Task> GroupPermissionChangeChat(Guid classSessionId, Guid sessionGroupId, bool chatActive)
        {
            await _SessionGroupService.UpdateChatPermission(classSessionId, sessionGroupId, chatActive);
            return Clients.Group(sessionGroupId.ToString()).SendAsync("groupPermissionChangeChat", chatActive);
        }

        public async Task<Task> IndividualPermissionChangeChat(Guid classSessionId, Guid sessionAttendeeId, string toStudentId, bool chatActive)
        {
            await _SessionAttendeeService.UpdateChatPermission(classSessionId, sessionAttendeeId, chatActive);
            return Clients.OthersInGroup(toStudentId).SendAsync("individualPermissionChangeChat", chatActive);
        }

        public async Task<Task> CallUser(Guid classSessionId, string toId)
        {
            // CANNOT RUN EF PARALLEL UNLESS RUNNING MULTIPLE CONTEXTS -> HAVE ELECTED TO USE ASYNC/AWAIT FOR SOME HERE INSTEAD
            var user = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            var usersTo = new List<DTO.UserBasicCallInfo>() { await _SessionAttendeeService.GetBasicUserCallInfo(classSessionId, toId) };
            //var roomToJoin = classSessionId.ToString() + "_" + CombineAlpha(user.Id, toId);
            var roomToJoin = _ClassSessionService.GetIndividualWebcamRoomValue(classSessionId, user.Id, toId);

            return Task.WhenAll(
                Clients.Caller.SendAsync("startCall", roomToJoin, usersTo),
                Clients.User(await GetUserConnectionIdSingular(toId)).SendAsync("receiveCall", roomToJoin, user.Id)
            );
        }

        public async Task<Task> CallGroup(Guid classSessionId, Guid groupId, List<string> onlineUserIds)
        {
            // CANNOT RUN EF PARALLEL UNLESS RUNNING MULTIPLE CONTEXTS -> HAVE ELECTED TO USE ASYNC/AWAIT FOR SOME HERE INSTEAD
            var user = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            var groupUsers = await _SessionGroupService.GetBasicUserCallInfo(classSessionId, groupId, user.Id);
            groupUsers = groupUsers.Where(x => onlineUserIds.Contains(x.UserId)).ToList();
            var roomToJoin = classSessionId.ToString() + "_" + groupId.ToString();

            return Task.WhenAll(
                Clients.Caller.SendAsync("startCall", roomToJoin, groupUsers),
                Clients.Group(groupId.ToString()).SendAsync("receiveCall", roomToJoin, user.Id)
            );
        }

        public async Task<Task> CallAll(Guid classSessionId, List<string> onlineUserIds)
        {
            var user = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            var allUsers = await _ClassSessionService.GetBasicUserCallInfo(classSessionId, user.Id);
            allUsers = allUsers.Where(x => onlineUserIds.Contains(x.UserId)).ToList();
            var roomToJoin = classSessionId.ToString() + "_main";

            return Task.WhenAll(
                Clients.Caller.SendAsync("startCall", roomToJoin, allUsers),
                Clients.OthersInGroup(classSessionId.ToString()).SendAsync("receiveCall", roomToJoin, user.Id)
            );
        }

        public async Task<Task> CallDeclined(Guid classSessionId, string roomId, string userThatMadeCallId)
        {
            var user = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("callDeclined", roomId, user.Id, user.FullName, userThatMadeCallId);
        }

        public Task CancelledByCall(Guid classSessionId, string roomId)
        {
            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("cancelledCall", roomId);
        }

        public Task ToggleForceMode(Guid classSessionId, bool forceMode, string roomId)
        {
            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("toggleForceMode", forceMode, roomId);
        }

        public async Task<Task> AskForHelp(Guid classSessionId)
        {
            var user = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            var classSession = await _SessionAttendeeService.AskForHelpRequest(classSessionId, user);

            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("helpRequested", user.Id);
        }

        public async Task<Task> HelpDelivered(Guid classSessionId, string userId)
        {
            await _SessionAttendeeService.DeliverHelpRequest(classSessionId, userId);
            return Clients.User(await GetUserConnectionIdSingular(userId)).SendAsync("helpComing");
        }

        public async Task<Task> GroupMove(Guid classSessionId, Guid groupId, string[] userIds, string name)
        {
            // Make changes
            List<DTO.WebcamRoom> previousRooms;
            DTO.WebcamRoom nextRoomChanges;
            DTO.WebcamRoom nextRoom;
            (previousRooms, nextRoomChanges, nextRoom) = await _SessionGroupService.MoveAttendees(classSessionId, groupId, userIds);
            // Then send out the changes to current occupiers of the room's
            foreach (var previousRoom in previousRooms)
                await Clients.Group(previousRoom.Identifier).SendAsync("groupAlteredRemove", previousRoom);
            await Clients.Group(nextRoomChanges.Identifier).SendAsync("groupAlteredAdd", nextRoomChanges);

            // Then tell the users they've moved
            return Clients.Users(await GetUserConnectionIds(userIds)).SendAsync("groupMoved", groupId, name, nextRoom);
        }

        public async Task<Task> GroupRemove(Guid classSessionId, Guid groupId, string[] userIds, string name)
        {
            await _SessionGroupService.RemoveAttendees(classSessionId, userIds);
            await Clients.Users(await GetUserConnectionIds(userIds)).SendAsync("groupRemoved", name);
            return Clients.Group(groupId.ToString()).SendAsync("groupUsersRemoved", groupId, userIds);
        }

        public string CombineAlpha(string val1, string val2)
        {
            var result = val1 + val2;
            return String.Concat(result.OrderBy(c => c));
        }


        public async Task<Task> UpdateDocumentPermissions(Guid classSessionId, DTO.SessionAttendeeFileUploaderComplete model)
        {
            if (model.FileIds.Count == 0 || model.SessionAttendees.Count == 0 || !(await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(Context.User.Identity.Name), "Tutor")))
                return null;

            var user = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            await _SessionDocumentService.UpdatePermissions(classSessionId, user, model.FileIds, model.SessionAttendees);
            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("filePermissionsChange", model.FileIds);
        }

        public async Task<Task> ScreenShare(Guid classSessionId, bool screenMuted, string roomId)
        {
            var user = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            return Clients.OthersInGroup(classSessionId.ToString()).SendAsync("screenShared", screenMuted, roomId, user.Id);
        }
    }
}
