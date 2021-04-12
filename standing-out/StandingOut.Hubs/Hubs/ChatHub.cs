using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using StandingOut.Shared.Mapping;
using StandingOut.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;

namespace StandingOut.Hubs.Hubs
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ChatHub : BaseHub
    {
        private readonly ISessionMessageService _SessionMessageService;

        public ChatHub(ISessionMessageService sessionMessageService, UserManager<Models.User> userManager)
            : base(userManager)
        {
            _SessionMessageService = sessionMessageService;
        }

        public Task Ping()
        {
            return Clients.Caller.SendAsync("pingChat");
        }

        public async Task<Task> SendMessage(string message, Guid classSessionId, string tutorId, Guid? groupId = null, string toUserId = null, Guid? sessionOneToOneChatInstanceId = null)
        {
            var msg = await _SessionMessageService.Create(message, classSessionId, tutorId, groupId, toUserId, sessionOneToOneChatInstanceId);
            var mappedMsg = Mappings.Mapper.Map<Models.SessionMessage, DTO.SessionMessage>(msg);

            var grpIdToAdd = DetermineGroup(classSessionId, groupId, toUserId, sessionOneToOneChatInstanceId);
            return Clients.Group(grpIdToAdd).SendAsync("newMessage", mappedMsg, groupId, toUserId, sessionOneToOneChatInstanceId);
        }

        public async Task<Task> ReadMessages(Guid classSessionId, string tutorId, Guid? groupId = null, string toUserId = null, Guid? sessionOneToOneChatInstanceId = null)
        {
            var user = _UserManager.FindByEmailAsync(Context.User.Identity.Name).Result;
            await _SessionMessageService.UpdateReadStatus(classSessionId, tutorId, user.Id, groupId, sessionOneToOneChatInstanceId);

            string grpIdToAdd = DetermineGroup(classSessionId, groupId, toUserId, sessionOneToOneChatInstanceId);
            return Clients.OthersInGroup(grpIdToAdd).SendAsync("readMessages", groupId, toUserId, sessionOneToOneChatInstanceId, user.Id, user.GoogleProfilePicture);
        }

        public async Task<Task> Typing(Guid classSessionId, Guid? groupId = null, string toUserId = null, Guid? sessionOneToOneChatInstanceId = null)
        {
            var user = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            string grpIdToAdd = DetermineGroup(classSessionId, groupId, toUserId, sessionOneToOneChatInstanceId);
            return Clients.OthersInGroup(grpIdToAdd).SendAsync("userTyping", groupId, toUserId, sessionOneToOneChatInstanceId, $"{user.FirstName} {user.LastName.Substring(0, 1)}");
        }

        public Task Connect(Guid classSessionId, Guid? groupId = null, string toUserId = null, Guid? sessionOneToOneChatInstanceId = null)
        {
            string grpIdToAdd = DetermineGroup(classSessionId, groupId, toUserId, sessionOneToOneChatInstanceId);
            return Groups.AddToGroupAsync(Context.ConnectionId, grpIdToAdd);
        }

        public Task Disconnect(Guid classSessionId, Guid? groupId = null, string toUserId = null, Guid? sessionOneToOneChatInstanceId = null)
        {
            string grpIdToAdd = DetermineGroup(classSessionId, groupId, toUserId, sessionOneToOneChatInstanceId);
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, grpIdToAdd);
        }

        private string DetermineGroup(Guid classSessionId, Guid? groupId = null, string toUserId = null, Guid? sessionOneToOneChatInstanceId = null)
        {
            string grpIdToAdd = "";

            if (groupId.HasValue)
            {
                grpIdToAdd = groupId.ToString();
            }
            else if (sessionOneToOneChatInstanceId.HasValue)
            {
                grpIdToAdd = sessionOneToOneChatInstanceId.ToString();
            }
            else
            {
                grpIdToAdd = classSessionId.ToString();
            }

            return grpIdToAdd;
        }
    }
}
