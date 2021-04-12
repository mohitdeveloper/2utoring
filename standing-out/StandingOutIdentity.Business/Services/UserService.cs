using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutIdentity.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutIdentity.Business.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly IHostingEnvironment _Enviroment;
        private bool _Disposed;

        public UserService(IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager, IHttpContextAccessor httpContext, IHostingEnvironment hosting)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _HttpContext = httpContext;
            _Enviroment = hosting;
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

        public async Task<Models.User> GetById(string id)
        {
            var user = await _UserManager.FindByIdAsync(id);

            if (user.IsDeleted == true)
                return null;

            return user;
        }

        public async Task<Models.User> GetByEmail(string name)
        {
            return await _UnitOfWork.GetContext().Users.Include("Tutor").FirstOrDefaultAsync(o => o.Email.ToLower().Trim() == name.ToLower().Trim() && o.IsDeleted == false);
        }

        public async Task<Models.User> GetByForgottenKey(string key)
        {
            var expiryDate = DateTimeOffset.UtcNow.Date.AddDays(-10);
            return await _UserManager.Users.FirstOrDefaultAsync(u => u.IsDeleted == false && u.ForgottenKey == key && u.ForgottenRequestDate > expiryDate);
        }

        public async Task<Models.User> GetByLinkAccountKey(string linkAccountKeyOne, string linkAccountKeyTwo)
        {
            var expiryDate = DateTimeOffset.UtcNow.Date.AddMinutes(-10);
            return await _UserManager.Users.FirstOrDefaultAsync(u => u.IsDeleted == false && u.LinkAccountKeyOne == linkAccountKeyOne && u.LinkAccountKeyTwo == linkAccountKeyTwo && u.LinkAccountRequestDate > expiryDate);
        }


        public async Task<List<UserLoginInfo>> GetUserLoginInfo(string id)
        {            
            var data =  await _UserManager.GetLoginsAsync(await _UnitOfWork.GetContext().Users.Include("Tutor").FirstOrDefaultAsync(o => o.Id == id));
            return data.ToList();
        }

        public async Task<IdentityResult> RegisterLocal(StandingOut.Data.DTO.SystemObjects.RegisterUser model)
        {
            var user = new StandingOut.Data.Models.User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                UserName = model.Email,
                ContactEmail = model.Email,
                IPAddress=model.IPAddress,
                VerificationCode=model.VerificationCode,
                CreatedDate = DateTime.Now
            };

            return await _UserManager.CreateAsync(user, model.Password);
        }

        public async Task SendResetPasswordEmail(string email)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            var user = await GetByEmail(email);
            var token = await _UserManager.GeneratePasswordResetTokenAsync(user);
            token = Regex.Replace(token, @"[^0-9a-zA-Z]+", "");

            user.ForgottenKey = token;
            user.ForgottenRequestDate = DateTimeOffset.UtcNow;

            user = await Update(user);

            var template = _Enviroment.WebRootPath;
            template = System.IO.Path.Combine(template, "Templates\\forgottenpassword.html");

            var reseturl = Utilities.MiscUtilities.GetRootLink(_HttpContext.HttpContext, "Account/ResetPassword/" + token);
            var fields = new Dictionary<string, string>
            {
                { "{{reseturl}}",  reseturl },
                { "{{urlpart}}",  _AppSettings.MainSiteUrl }
            };


                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi, template, fields, user.ContactEmail, "admin@2utoring.com", $"Reset your 2utoring password", null, null, null);
        }

        public async Task ResetForgotPassword(string key, string newpassword)
        {
            var user = await GetByForgottenKey(key);

            user.ForgottenKey = null;
            user.ForgottenRequestDate = null;
            user.LastPasswordChange = DateTimeOffset.Now;

            string resetToken = await _UserManager.GeneratePasswordResetTokenAsync(user);
            IdentityResult passwordChangeResult = await _UserManager.ResetPasswordAsync(user, resetToken, newpassword);

            await Update(user);
        }

        public async Task<Models.User> Update(Models.User user)
        {
            await _UserManager.UpdateAsync(user);
            return await GetById(user.Id);
        }

        public async Task<Models.User> UpdateContactEmailAddress(string id, string newEmail)
        {
            var user = await GetById(id);
            user.ContactEmail = newEmail;
            user.GoogleEmail = newEmail;
            await _UserManager.UpdateAsync(user);
            return await GetById(id);
        }



        public async Task SendEmailConfirmation(string email, string code)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            var template = _Enviroment.WebRootPath;
            template = System.IO.Path.Combine(template, "Templates\\EmailConfirmation.html");
            var fields = new Dictionary<string, string>
            {
                {"{{userName}}",email },
                { "{{code}}",  code },
                { "{{urlpart}}",  _AppSettings.MainSiteUrl }
            };


            await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi, template, fields, email, "admin@2utoring.com", $"Verification Code", null, null, null);
        }
     
    }
}
