using System;
using System.Collections.Generic;
using System.Text;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace StandingOutStore.Business.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private readonly AppSettings _AppSettings;
        private bool _Disposed;

        public DashboardService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
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

        public async Task<DTO.ManagementInfoDashboard> GetManagementInfo(DTO.SearchModel model)
        {
            var result = new DTO.ManagementInfoDashboard();

            result.TutorCount = await _UserManager.Users.CountAsync(o => o.IsDeleted == false && o.TutorId != null && o.Tutor != null && o.Tutor.IsDeleted == false && (model.StartDate == null || o.CreatedDate >= model.StartDate) && (model.EndDate == null || o.CreatedDate <= model.EndDate));
            result.StudentCount = await _UserManager.Users.CountAsync(o => o.IsDeleted == false && o.TutorId == null && (model.StartDate == null || o.CreatedDate >= model.StartDate) && (model.EndDate == null || o.CreatedDate <= model.EndDate));

            var sessions = await _UnitOfWork.Repository<Models.ClassSession>().Get(o => (model.StartDate == null || o.StartDate >= model.StartDate) && (model.EndDate == null || o.StartDate <= model.EndDate), includeProperties: "SessionAttendees");
            result.SessionCount = sessions.Count;
            var sessionAttendees = await _UnitOfWork.Repository<Models.SessionAttendee>().GetCount(o => (model.StartDate == null || o.ClassSession.StartDate >= model.StartDate) && (model.EndDate == null || o.ClassSession.StartDate <= model.EndDate));
            result.AverageStudentsPerSession = decimal.Divide(sessionAttendees == 0 ? 1 : sessionAttendees, result.SessionCount == 0 ? 1 : result.SessionCount);

            result.PaymentsMadeCount = 0;
            result.PaymentsMadeAmount = 0.00M;
            foreach (var session in sessions)
            {
                result.PaymentsMadeCount += session.SessionAttendees.Where(o => o.IsDeleted == false && o.Refunded == false).Count();
                result.PaymentsMadeAmount += session.SessionAttendees
                    .Where(o => o.IsDeleted == false && o.Refunded == false).Sum(o => o.AmountCharged - (o.StandingOutActualCut.HasValue ? o.StandingOutActualCut.Value : 0));
            }

            return result;
        }

        public async Task<DTO.PagedList<DTO.ClassSessionIndex>> GetSessions(DTO.SearchModel model)
        {
            IQueryable<Models.ClassSession> data = _UnitOfWork.Repository<Models.ClassSession>().GetQueryable();

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => o.Name != null && o.Name.ToLower().Contains(search));
            }

            if (model.StartDate.HasValue)
            {
                data = data.Where(o => o.StartDate >= model.StartDate);
            }

            if (model.EndDate.HasValue)
            {
                data = data.Where(o => o.EndDate <= model.EndDate);
            }

            var dataCount = data;

            System.Reflection.PropertyInfo prop = typeof(Models.ClassSession).GetProperty(model.SortType);
            if (prop != null)
            {
                data = model.Order == "DESC" ? data.OrderByDescending(x => prop.GetValue(x, null)) : data.OrderBy(x => prop.GetValue(x, null));
            }
            else
            {

            }

            var result = new DTO.PagedList<DTO.ClassSessionIndex>();

            result.Data = StandingOut.Shared.Mapping.Mappings.Mapper.Map<List<Models.ClassSession>, List<DTO.ClassSessionIndex>>(await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = await dataCount.CountAsync();
            result.Paged.TotalPages = result.Paged.TotalCount % result.Paged.Take == 0 ? (result.Paged.TotalCount / result.Paged.Take) - 1 : result.Paged.TotalCount / result.Paged.Take;

            return result;
        }

    }
}
