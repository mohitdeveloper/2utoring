using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOut.Business.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public UserService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public UserService(IUnitOfWork unitOfWork, AppSettings appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<IdentityUserLogin<string>> GetUserLogin(Models.User user, string provider = "google")
        {
            return await _UnitOfWork.GetContext().UserLogins.FirstOrDefaultAsync(o => o.UserId == user.Id && o.LoginProvider.ToLower().Trim() == provider);
        }

        public async Task<Models.User> GetByEmail(string name)
        {
            return await _UnitOfWork.GetContext().Users.Include("Tutor").FirstOrDefaultAsync(o => o.Email.ToLower().Trim() == name.ToLower().Trim() && o.IsDeleted == false);
        }

        public async Task<Models.User> GetById(string id)
        {
            return await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Id == id && o.IsDeleted == false);
        }

        public async Task<IList<Models.User>> GetStudents()
        {
            return await _UnitOfWork.GetContext().Users.Where(x => x.SessionAttendees.Any()).ToListAsync();
        }

        public async Task<List<UserLoginInfo>> GetUserLoginInfo(string id)
        {
            var data = await _UserManager.GetLoginsAsync(await _UnitOfWork.GetContext().Users.Include("Tutor").FirstOrDefaultAsync(o => o.Id == id));
            return data.ToList();
        }
    }
}
