using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutIdentity.Business.Services.Interfaces
{
    public interface IUserService : IDisposable
    {
        Task<Models.User> GetById(string id);
        Task<Models.User> GetByEmail(string name);
        Task<Models.User> GetByForgottenKey(string key);
        Task<Models.User> GetByLinkAccountKey(string linkAccountKeyOne, string linkAccountKeyTwo);
        Task<List<UserLoginInfo>> GetUserLoginInfo(string id);
        Task<IdentityResult> RegisterLocal(StandingOut.Data.DTO.SystemObjects.RegisterUser model);
        Task SendResetPasswordEmail(string email);
        Task ResetForgotPassword(string key, string newpassword);
        Task<Models.User> Update(Models.User user);
        Task<Models.User> UpdateContactEmailAddress(string id, string newEmail);
        Task SendEmailConfirmation(string email, string code);
    }
}
