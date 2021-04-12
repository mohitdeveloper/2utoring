using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;
using StandingOut.Business.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using StandingOut.Shared.Mapping;

namespace StandingOut.Hubs.Hubs
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class WhiteboardHub : BaseHub
    {
        private readonly ISessionWhiteBoardService _SessionWhiteBoardService;

        public WhiteboardHub(UserManager<Models.User> userManager, ISessionWhiteBoardService sessionWhiteBoardService)
            : base(userManager)
        {
            _SessionWhiteBoardService = sessionWhiteBoardService;
        }

        public Task Ping()
        {
            return Clients.Caller.SendAsync("pingWhiteboard");
        }

        // Params here allows this method to handle array and single input through spread
        public Task Connect(Guid[] sessionWhiteBoardIds)
        {
            if (sessionWhiteBoardIds.Length == 1)
                return Groups.AddToGroupAsync(Context.ConnectionId, sessionWhiteBoardIds[0].ToString());
            else
                return Task.WhenAll(sessionWhiteBoardIds.Select(x => Groups.AddToGroupAsync(Context.ConnectionId, x.ToString())));
        }

        public Task Disconnect(Guid[] sessionWhiteBoardIds)
        {
            if (sessionWhiteBoardIds.Length == 1)
                return Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionWhiteBoardIds[0].ToString());
            else
                return Task.WhenAll(sessionWhiteBoardIds.Select(x => Groups.RemoveFromGroupAsync(Context.ConnectionId, x.ToString())));
        }

        public Task Draw(Guid sessionWhiteBoardId)
        {
            return Clients.OthersInGroup(sessionWhiteBoardId.ToString()).SendAsync("draw", sessionWhiteBoardId);
        }

        #region Moved from classroom project

        public async Task<Task> AddCommand(Guid classSessionId, DTO.SessionWhiteBoardHistory model)
        {
            var command = await _SessionWhiteBoardService.AddCommand(classSessionId, model);
            var result = Mappings.Mapper.Map<Models.SessionWhiteBoardHistory, DTO.SessionWhiteBoardHistory>(command);
            result.IntermediateId = model.IntermediateId;
            return Clients.Group(model.SessionWhiteBoardId.ToString()).SendAsync("draw", model.SessionWhiteBoardId, result);
        }

        public async Task<Task> AddLoadCommand(Guid classSessionId, Guid sessionWhiteBoardId, DTO.LoadCommand model)
        {
            var user = await _UserManager.FindByEmailAsync(Context.User.Identity.Name);
            var histories = await _SessionWhiteBoardService.AddLoadCommand(classSessionId, sessionWhiteBoardId, user.Id, model);
            // Must ensure these are ran first
            for (var i = 0; i < histories.Count - 1; i++)
            {
                await Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("draw", sessionWhiteBoardId,
                   Mappings.Mapper.Map<Models.SessionWhiteBoardHistory, DTO.SessionWhiteBoardHistory>(histories[i])
               );
            }
            return Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("draw", sessionWhiteBoardId,
                   Mappings.Mapper.Map<Models.SessionWhiteBoardHistory, DTO.SessionWhiteBoardHistory>(histories[histories.Count - 1])
               );
        }

        public async Task<Task> AlterSize(Guid classSessionId, int sizeX, int sizeY, DTO.SessionWhiteBoardHistory model)
        {
            var command = await _SessionWhiteBoardService.UpdateSizes(classSessionId, model.SessionWhiteBoardId, model.UserId, model.JsonData, sizeX, sizeY);
            var result = Mappings.Mapper.Map<Models.SessionWhiteBoardHistory, DTO.SessionWhiteBoardHistory>(command);
            return Clients.Group(model.SessionWhiteBoardId.ToString()).SendAsync("draw", model.SessionWhiteBoardId, result);
        }

        public async Task<Task> ToggleLock(Guid classSessionId, Guid sessionWhiteBoardId, DTO.SessionWhiteBoardLock model)
        {
            await _SessionWhiteBoardService.ToggleLock(classSessionId, sessionWhiteBoardId, model);
            return Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("boardLockToggled", sessionWhiteBoardId, model.Locked);
        }

        public async Task<Task> Undo(Guid classSessionId, Guid sessionWhiteBoardId, Guid sessionWhiteBoardHistoryId)
        {
            var model = await _SessionWhiteBoardService.Undo(classSessionId, sessionWhiteBoardId, sessionWhiteBoardHistoryId);
            return Clients.Group(model.SessionWhiteBoardId.ToString()).SendAsync("undo", model.SessionWhiteBoardId, model.SessionWhiteBoardHistoryId);
        }

        public async Task<Task> Redo(Guid classSessionId, Guid sessionWhiteBoardId, Guid sessionWhiteBoardHistoryId)
        {
            var command = await _SessionWhiteBoardService.Redo(classSessionId, sessionWhiteBoardId, sessionWhiteBoardHistoryId);
            var result = Mappings.Mapper.Map<Models.SessionWhiteBoardHistory, DTO.SessionWhiteBoardHistory>(command);
            return Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("redo", sessionWhiteBoardId, sessionWhiteBoardHistoryId, result);
        }

        public async Task<Task> Clear(Guid classSessionId, Guid sessionWhiteBoardId)
        {
            var command = await _SessionWhiteBoardService.Clear(classSessionId, sessionWhiteBoardId);
            var result = Mappings.Mapper.Map<Models.SessionWhiteBoardHistory, DTO.SessionWhiteBoardHistory>(command);
            return Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("clear", sessionWhiteBoardId, result);
        }

        public async Task<Task> SetInactive(Guid classSessionId, Guid sessionWhiteBoardId)
        {
            await _SessionWhiteBoardService.SetInactive(sessionWhiteBoardId);
            return Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("closed", sessionWhiteBoardId);
        }

        public async Task<Task> Share(Guid classSessionId, Guid sessionWhiteBoardId, bool individual, string whiteBoardUserId, List<DTO.SessionWhiteBoardShare> shares)
        {
            var result = await _SessionWhiteBoardService.Share(classSessionId, sessionWhiteBoardId, individual, whiteBoardUserId, shares);
            return Clients.Group(classSessionId.ToString()).SendAsync("share", sessionWhiteBoardId, result);
        }

        public async Task<Task> TutorStoppedCollaborating(Guid sessionWhiteBoardId, DTO.SessionWhiteBoardStopCollaborate stopCollaborate)
        {
            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(Context.User.Identity.Name), "Tutor"))
                return Clients.Group(sessionWhiteBoardId.ToString()).SendAsync("stopCollaborate", sessionWhiteBoardId, stopCollaborate.Name);
            else
                return null;
        }



        #endregion Moved from classroom project
    }
}
