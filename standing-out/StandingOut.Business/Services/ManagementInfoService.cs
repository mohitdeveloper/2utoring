using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using StandingOut.Business.Helpers.AcuityScheduling;

namespace StandingOut.Business.Services
{
    public class ManagementInfoService : IManagementInfoService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private readonly AppSettings _AppSettings;
        private readonly IAcuitySchedulingHelper _AcuitySchedulingHelper;
        private bool _Disposed;

        public ManagementInfoService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager, IAcuitySchedulingHelper acuitySchedulingHelper)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _AcuitySchedulingHelper = acuitySchedulingHelper;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<DTO.ManagementInfoDashboard> GetDashboard(DTO.SearchModel model)
        {
            var result = new DTO.ManagementInfoDashboard();

            result.TutorCount = await _UnitOfWork.GetContext().Users.CountAsync(o => o.TutorId != null && (model.StartDate == null || o.CreatedDate >= model.StartDate) && (model.EndDate == null || o.CreatedDate <= model.EndDate));
            result.StudentCount = await _UnitOfWork.GetContext().Users.CountAsync(o => o.TutorId == null && (model.StartDate == null || o.CreatedDate >= model.StartDate) && (model.EndDate == null || o.CreatedDate <= model.EndDate));
            var acuityAppointmentTypes = await _AcuitySchedulingHelper.GetAppointmentTypes();
            result.CourseCount = acuityAppointmentTypes.Count; // i don't have a date to filter on
            var sessions = await _UnitOfWork.Repository<Models.ClassSession>().Get(o => (model.StartDate == null || o.StartDate >= model.StartDate) && (model.EndDate == null || o.StartDate <= model.EndDate));
            result.SessionCount = sessions.Count;
            var sessionAttendees = await _UnitOfWork.Repository<Models.SessionAttendee>().GetCount(o => (model.StartDate == null || o.ClassSession.StartDate >= model.StartDate) && (model.EndDate == null || o.ClassSession.StartDate <= model.EndDate));
            result.AverageStudentsPerSession = decimal.Divide(sessionAttendees == 0 ? 1 : sessionAttendees, result.SessionCount == 0 ? 1 : result.SessionCount);

            result.PaymentsMadeCount = 0;
            result.PaymentsMadeAmount = 0.00M;
            foreach (var session in sessions)
            {
                if (session.AppointmentId.HasValue)
                {
                    var payments = await _AcuitySchedulingHelper.GetAppointmentPayments(session.AppointmentId.Value);
                    result.PaymentsMadeCount += payments.Count;
                    result.PaymentsMadeAmount += payments.Sum(o => o.Amount);                    
                }
            }         
           
            return result;
        }

        public async Task<DTO.PagedList<AcuitySchedulingAppointmentType>> Courses(DTO.SearchModel model)
        {
            List<AcuitySchedulingAppointmentType> data = await _AcuitySchedulingHelper.GetAppointmentTypes();

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
               
            }                        

            var dataCount = data;

            System.Reflection.PropertyInfo prop = typeof(Models.ClassSession).GetProperty(model.SortType);
            if (prop != null)
            {
                //data = model.Order == "DESC" ? data.OrderByDescending(x => prop.GetValue(x, null)) : data.OrderBy(x => prop.GetValue(x, null));
            }
            else
            {

            }

            var result = new DTO.PagedList<AcuitySchedulingAppointmentType>();

            result.Data = data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToList();
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = dataCount.Count();
            result.Paged.TotalPages = result.Paged.TotalCount % result.Paged.Take == 0 ? (result.Paged.TotalCount / result.Paged.Take) - 1 : result.Paged.TotalCount / result.Paged.Take;

            return result;
        }
    }
}

