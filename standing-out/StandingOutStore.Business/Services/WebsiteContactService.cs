using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using StandingOut.Data.DTO.CompanyRegister;
using StandingOut.Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.Linq;


namespace StandingOutStore.Business.Services
{
    public class WebsiteContactService : IWebsiteContactService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed;
        private readonly IHostingEnvironment _Enviroment;
        private readonly AppSettings _AppSettings;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;


        public WebsiteContactService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;

        }
        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }
        public async Task<bool> Create(Models.WebsiteContact model)
        {
            #region Send Email to Admin
            string firstName = char.ToUpper(model.FirstName[0]) + model.FirstName.Substring(1);
            string lastName = char.ToUpper(model.LastName[0]) + model.LastName.Substring(1);
            string senderFullName = firstName + " " + lastName;
            try
            {
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\VisitorMessage.html"),
                    new Dictionary<string, string>()
                    {
                                { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                                { "{{receiverFullName}}", senderFullName},
                                { "{{senderFullName}}", senderFullName },
                                { "{{senderEmail}}", model.ContactEmail },
                                { "{{message}}", model.Description},
                    }, settings.ContactUsEmail, settings.SendGridFromEmail, senderFullName + $" has sent you a message");

                var ObjContract = await _UnitOfWork.Repository<Models.WebsiteContact>().Insert(model);
                return true;
            }
            catch
            {
                return false;
            }
            #endregion
        }



    }
}
