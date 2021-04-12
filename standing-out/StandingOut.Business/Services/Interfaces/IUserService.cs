using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOut.Business.Services.Interfaces
{
    public interface IUserService : IDisposable
    {
        Task<IdentityUserLogin<string>> GetUserLogin(Models.User user, string provider = "google");
        Task<Models.User> GetByEmail(string name);
        Task<Models.User> GetById(string id);
        Task<IList<Models.User>> GetStudents();
        Task<List<UserLoginInfo>> GetUserLoginInfo(string id);
    }
}
