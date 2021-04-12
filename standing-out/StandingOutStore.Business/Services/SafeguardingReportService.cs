using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using StandingOut.Shared.Mapping;
using StandingOut.Data.Models;

namespace StandingOutStore.Business.Services
{
    public class SafeguardingReportService : ISafeguardingReportService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
		private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public SafeguardingReportService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
			_AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

		public SafeguardingReportService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<Models.SafeguardReport> Create(Models.SafeguardReport model, Models.User user)
        {
            await _UnitOfWork.Repository<Models.SafeguardReport>().Insert(model);

            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();

            try
            {
                var message = new SendGrid.Helpers.Mail.SendGridMessage()
                {
                    From = new SendGrid.Helpers.Mail.EmailAddress(settings.SendGridFromEmail),
                    Subject = "URGENT - Safeguarding issue raised on 2utoring.com",
                    HtmlContent = "<p>A safegaurding issue has been raised on 2utoring.com.</p>" +
                    $"<p>Please click <a href=\"https://2utoring.com/admin/Safegaurding/View/{model.SafeguardReportId}\">here</a> to read this.</p>"
                };

                var client = new SendGrid.SendGridClient(settings.SendGridApi);

                await client.SendEmailAsync(message);
            }
            catch { }

            try
            {
                if (model.ClassSessionId.HasValue)
                {
                    var classSession = await _UnitOfWork.Repository<Models.ClassSession>()
                        .GetQueryable(o => o.ClassSessionId == model.ClassSessionId.Value, includeProperties: "ClassSession, ClassSession.Owner")
                        .AsNoTracking()
                        .Select(x => new {
                            TutorFirstName = x.Owner.FirstName,
                            TutorLastName = x.Owner.LastName,
                            LessonName = x.Name,
                            LessonStartDate = x.StartDate,
                            LessonPrice = x.PricePerPerson
                        })
                        .FirstOrDefaultAsync();

                    await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\SafeguardingConfirmation.html"),
                    new Dictionary<string, string>()
                    {
                        { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{userFullName}}", user == null ? "" : (" " + (user.IsParent ? (user.ParentFirstName + " " + user.ParentLastName) : (user.FirstName + " " + user.LastName))) },
                        { "{{tutorFullName}}", classSession.TutorFirstName + " " + classSession.TutorLastName },
                        { "{{lessonName}}", classSession.LessonName },
                        { "{{lessonStartDate}}", TimeZoneInfo.ConvertTimeFromUtc(classSession.LessonStartDate.UtcDateTime, TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time")).ToString("d/M/yyyy h:mm tt").ToLower() },
                        { "{{lessonPrice}}", "£" + classSession.LessonPrice.ToString("#.##") },
                    }, model.User.ContactEmail, settings.SendGridFromEmail, $"We have received your confirmation query regarding the {classSession.LessonName} lesson", new string[1] { settings.SafeguardReportAlertEmail });
                }
                else
                {
                    await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\SafeguardingConfirmationBasic.html"),
                    new Dictionary<string, string>()
                    {
                        { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{userFullName}}", user == null ? "" : (" " + (user.IsParent ? (user.ParentFirstName + " " + user.ParentLastName) : (user.FirstName + " " + user.LastName))) },
                    }, model.User.ContactEmail, settings.SendGridFromEmail, "We have received your confirmation query", new string[1] { settings.SafeguardReportAlertEmail });
                }

                
            }
            catch { }

            return model;
        }


        public async Task<DTO.PagedList<DTO.SafeguardReportIndex>> GetPaged(DTO.SearchModel model, Company company = null)
        {
            var query = _UnitOfWork.Repository<Models.SafeguardReport>().GetQueryable(includeProperties: "ClassSession, ClassSession.Owner, User");
            if (company != null)
            {
                query = query.Where(x => x.ClassSession.Course.CompanyId == company.CompanyId);
            }

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                query = query.Where(x => (x.User.FirstName.ToLower() + " " + x.User.LastName.ToLower()).Contains(search) ||
                    (x.ClassSessionId.HasValue && (x.ClassSession.Name.ToLower().Contains(search) || 
                    (x.ClassSession.Owner.FirstName.ToLower() + " " + x.ClassSession.Owner.FirstName.ToLower()).Contains(search))));
            }

            System.Reflection.PropertyInfo prop = typeof(Models.SafeguardReport).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                query = query.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {
                //perform some manual sorting (if required, this should only be for sub-objects).
            }

            var selectedQuery = query.Select(x => Mappings.Mapper.Map<Models.SafeguardReport, DTO.SafeguardReportIndex>(x));

            var result = new DTO.PagedList<DTO.SafeguardReportIndex>();

            

            result.Data = await selectedQuery.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync();
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = selectedQuery.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;

            return result;
        }

        public async Task<Models.SafeguardReport> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SafeguardReport>().GetSingle(x => x.SafeguardReportId == id, includeProperties: "ClassSession, ClassSession.Owner, ClassSession.Course, User");
        }
        public async Task<Models.SafeguardReport> Update(Models.SafeguardReport model)
        {
            await _UnitOfWork.Repository<Models.SafeguardReport>().Update(model);
            return model;
        }
    }
}

