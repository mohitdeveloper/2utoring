using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace StandingOut.Business.Services
{
    public class SafeguardReportService : ISafeguardReportService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
		private readonly AppSettings _AppSettings;
        private bool _Disposed;

        public SafeguardReportService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
			_AppSettings = appSettings.Value;
        }

		public SafeguardReportService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.SafeguardReport>> Get()
        {
            return await _UnitOfWork.Repository<Models.SafeguardReport>().Get(includeProperties: "ClassSession, ClassSession.Owner, User", orderBy: x => x.OrderByDescending(y => y.LogDate));
        }

        public async Task<Models.SafeguardReport> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SafeguardReport>().GetSingle(o => o.SafeguardReportId == id, includeProperties: "ClassSession, ClassSession.Owner, User");
        }

        public async Task<Models.SafeguardReport> Create(Models.SafeguardReport model)
        {
            await _UnitOfWork.Repository<Models.SafeguardReport>().Insert(model);
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

            try
            {
                string Subject = "URGENT - Safeguarding issue raised on 2utoring.com";
                string HtmlContent = "<p>A safegaurding issue has been raised on 2utoring.com.</p>" +
                $"<p>Please click <a href=\"https://2utoring.com/admin/Safegaurding/View/{model.SafeguardReportId}\">here</a> to read this.</p>";

                await Utilities.EmailUtilities.SendEmail(settings.SendGridApi, "safeguarding@2utoring.com", settings.SendGridFromEmail, Subject, HtmlContent, null, null, null);
            }
            catch (Exception ex)
            {
                string errMess = ex.Message;
            }

            try
            {
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\ReportConfirmation.html"),
                    new Dictionary<string, string>()
                    {
                        { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{imageURL}}",  _AppSettings.MainSiteUrl + "/images/2utoringlogo.png" },
                        { "{{firstName}}", model.User.FirstName },
                        { "{{lastName}}", model.User.LastName }
                    }, model.User.ContactEmail, settings.SendGridFromEmail, "We have recieved your report");
            }
            catch(Exception ex )
            {
                string errMess = ex.Message;
            }

            return model;
        }

        public async Task<Models.SafeguardReport> Update(Models.SafeguardReport model)
        {
            await _UnitOfWork.Repository<Models.SafeguardReport>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var model = await GetById(id);
            model.IsDeleted = true;
            await Update(model);
        }
    }
}

