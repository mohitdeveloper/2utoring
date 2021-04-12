using StandingOutStore.Business.Services.Interfaces;
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
using StandingOut.Data.Models;

namespace StandingOutStore.Business.Services
{
    public class CourseInviteService : ICourseInviteService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public CourseInviteService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public CourseInviteService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.CourseInvite>> GetByCourseId(Guid courseId)
        {
            return await _UnitOfWork.Repository<Models.CourseInvite>().Get(o => o.CourseId == courseId,
                includeProperties: "User");
        }

        public async Task<Models.CourseInvite> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.CourseInvite>().GetSingle(o => o.CourseInviteId == id);
        }

        public async Task<List<Models.CourseInvite>> Create(User sender, List<Models.CourseInvite> models)
        {
            foreach (var model in models)
            {
                await Create(sender, model);
            }
            return models.ToList();
        }

        public async Task<Models.CourseInvite> Create(Models.User sender, Models.CourseInvite model)
        {
            Models.User user = null;
            var senderFullName = (sender != null) ? sender.FirstName + " " + sender.LastName : "";
            if (!string.IsNullOrEmpty(model.UserId))
            {
                user = await _UserManager.FindByIdAsync(model.UserId);
                model.Email = user.Email;
            }

            var existing = await _UnitOfWork.Repository<Models.CourseInvite>()
                .GetSingle(o => o.CourseId == model.CourseId
                    && string.Equals(o.Email, model.Email, StringComparison.InvariantCultureIgnoreCase));

            if (existing == null)
            {
                model.InviteSent = false;
                await _UnitOfWork.Repository<Models.CourseInvite>().Insert(model);
                model = await _UnitOfWork.Repository<Models.CourseInvite>().GetSingle(x => x.CourseInviteId == model.CourseInviteId);
            }
            else model = existing;

            var data = await _UnitOfWork.Repository<Models.CourseInvite>()
               .GetQueryable(o => o.CourseId == model.CourseId
                && string.Equals(o.Email, model.Email, StringComparison.InvariantCultureIgnoreCase),
                includeProperties: "Course, Course.ClassSessions, Course.Tutor, Course.Tutor.Users")
               .AsNoTracking()
               .Select(x => new
               {
                   TutorFullName = x.Course.Tutor.Users.First().FirstName + " " + x.Course.Tutor.Users.First().LastName,
                   CourseName = x.Course.Name,
                   CourseStartDate = x.Course.StartDate,
                   CoursePrice = x.Course.PricePerPerson,
                   x.CourseId,
                   x.Course,
                   ClassSessions = x.Course.ClassSessions.Where(x => x.StartDate >= DateTime.UtcNow.AddHours(1)),
               }).FirstOrDefaultAsync();
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();

            if (data.CourseId != null)
            {
                var course = data.Course;
                var futureSessions = data.ClassSessions; 
                var coursePriceTotal = futureSessions.Sum(x => x.PricePerPerson);
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi, System.IO.Path.Combine(_Enviroment.ContentRootPath,
                    "Templates\\CourseInvite.html"),
              new Dictionary<string, string>()
              {
                        { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{userFullName}}", user == null ? "there" : (user.IsParent ? (user.ParentFirstName + " " + user.ParentLastName) : (user.FirstName + " " + user.LastName)) },
                        { "{{tutorFullName}}", data.TutorFullName },
                        { "{{courseName}}", data.CourseName },
                        { "{{courseDateTime}}", data.CourseStartDate.ToString() },
                        { "{{coursePrice}}", "£" + (coursePriceTotal>0?coursePriceTotal.ToString("#.##"):"0.00") },
                        { "{{courseSignUpUrl}}", _AppSettings.MainSiteUrl + "/course/"+data.CourseId},
              }, model.Email, settings.SendGridFromEmail, $"{data.TutorFullName} has invited you to take part in their course on 2utoring");

                model.InviteSent = true;
                await _UnitOfWork.Repository<Models.CourseInvite>().Update(model);
            }
            return model;
        }

        public async Task<Models.CourseInvite> Update(Models.CourseInvite model)
        {
            await _UnitOfWork.Repository<Models.CourseInvite>().Update(model);
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

