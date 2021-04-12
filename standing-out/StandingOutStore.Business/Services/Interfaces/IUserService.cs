using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Identity;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IUserService : IDisposable
    {
        Task<Models.User> GetByEmail(string name);
        Task<Models.User> GetById(string id);
        Task<List<UserLoginInfo>> GetUserLoginInfo(string id);
        Task<IList<Models.User>> GetStudents();
        Task<DTO.PagedList<DTO.UserProfile>> GetStudentsPaged(DTO.SearchModel model, string tutorUserId, Guid? companyId=null);
        Task<DTO.PagedList<DTO.UserProfile>> GetAdminsPaged(DTO.SearchModel model);
        Task<Models.User> CompleteSetup(Models.User user, DTO.UserDetail model);
        Task<Models.User> CompleteSetup(Models.User user, DTO.UserGuardianDetail model);
        Task<bool> ChangePassword(string userId, string oldpassword, string newpassword);
        Task<Models.User> Update(Models.User user);
        Task<Models.User> GenerateLinkAccountTokens(string email);
        Task<DTO.UserAlertViewModel> UserAlert(Models.User user, string userType);
        Task<bool> MessageStatusUpdate(DTO.UserMessageUpdateModel model);
        Task<bool> ReadMessage(Guid msgId, Guid refId);
    }
}
