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
using System.Text;
using System.Globalization;

namespace StandingOutStore.Business.Services
{
    public class SessionInviteService : ISessionInviteService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IStripeCountryService _StripeCountryService;
        private bool _Disposed;

        public SessionInviteService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager, IStripeCountryService stripeCountryService)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _StripeCountryService = stripeCountryService;
        }

        public SessionInviteService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.SessionInvite>> GetByClassSession(Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.SessionInvite>().Get(o => o.ClassSessionId == classSessionId, includeProperties: "User");
        }

        public async Task<Models.SessionInvite> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SessionInvite>().GetSingle(o => o.SessionInviteId == id);
        }

        public async Task<List<Models.SessionInvite>> Create(List<Models.SessionInvite> models)
        {
            foreach (var model in models)
            {
                await Create(model);
            }
            return models.ToList();
        }

        public async Task<Models.SessionInvite> Create(Models.SessionInvite model)
        {
            Models.User user = null;
            if (!string.IsNullOrEmpty(model.UserId))
            {
                user = await _UserManager.FindByIdAsync(model.UserId);
                model.Email = user.Email;
            }

            var existing = await _UnitOfWork.Repository<Models.SessionInvite>().GetSingle(o => o.ClassSessionId == model.ClassSessionId && string.Equals(o.Email, model.Email, StringComparison.InvariantCultureIgnoreCase));
            if (existing == null)
            {
                model.InviteSent = true;
                await _UnitOfWork.Repository<Models.SessionInvite>().Insert(model);

                var data = await _UnitOfWork.Repository<Models.SessionInvite>()
               .GetQueryable(o => o.ClassSessionId == model.ClassSessionId && string.Equals(o.Email, model.Email, StringComparison.InvariantCultureIgnoreCase), includeProperties: "ClassSession, ClassSession.Owner")
               .AsNoTracking()
               .Select(x => new
               {
                   TutorFirstName = x.ClassSession.Owner.FirstName,
                   TutorLastName = x.ClassSession.Owner.LastName,
                   LessonName = x.ClassSession.Name,
                   LessonStartDate = x.ClassSession.StartDate,
                   LessonPrice = x.ClassSession.PricePerPerson,
                   CourseId = x.ClassSession.CourseId
               }).FirstOrDefaultAsync();
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();

                if (data.CourseId != null)
                {
                    StringBuilder sb = new StringBuilder();
                    var classSession = await _UnitOfWork.Repository<Models.ClassSession>().Get(x => x.CourseId == data.CourseId, includeProperties: "Course,Course.Tutor.Users.StripeCountry,Subject, StudyLevel");
                    var course = classSession.FirstOrDefault().Course;
                    var stripeCountry = course.Tutor.Users.FirstOrDefault().StripeCountry;
                    var coursePriceTotal = course.ClassSessions.Where(x => x.IsDeleted == false && x.StartDate.UtcDateTime >= DateTime.Now.AddMinutes(5).ToUniversalTime()).Sum(x => x.PricePerPerson);
                    if (classSession.Count>0)
                    {
                        sb.Append("<table style='border-collapse:collapse; width:100%;'>");
                        sb.Append("<thead><tr>");
                        sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'>Lesson Name</th>");
                        sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;  width: 25%;'>Description</th>");
                        sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'>Subject</th>");
                        sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'>Level</th>");
                        sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'> Date & Time</th>");
                        sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'>Price</th>");
                        sb.Append("</tr></thead>");
                        sb.Append("<tbody>");
                        foreach (var item in classSession.Where(x=>x.IsDeleted==false && x.StartDate.UtcDateTime >= DateTime.Now.AddMinutes(5).ToUniversalTime()).OrderBy(x=>x.StartDate).ToList())
                        {
                            TimeSpan ts = item.EndDate - item.StartDate;
                            string duration = ts.Minutes.ToString();
                            sb.Append("<tr style='font-size: 12px;'>");
                            sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>" + item.Name+"</td>");
                            sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;  width: 25%;'>" + item.LessonDescriptionBody + "</td>");
                            sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>" + item.Subject.Name + "</td>");
                            sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>" + item.StudyLevel.Name + "</td>");
                            sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>" + item.StartDate.ToString("MM/dd/yyyy h:mm tt") + "</td>");
                            sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>"+ stripeCountry.CurrencySymbol + item.PricePerPerson.ToString("#.##") + "</td>");
                            sb.Append("</tr>");
                        }
                        sb.Append("</tbody>");
                        sb.Append("</table>");
                    }
                    
                   
                   
                    string fName = course.Tutor.Users.FirstOrDefault().FirstName;
                    string lName = course.Tutor.Users.FirstOrDefault().LastName;
                    fName = char.ToUpper(fName[0]) + fName.Substring(1);
                    lName = char.ToUpper(lName[0]) + lName.Substring(1);
                    string tutorFullName = fName + " " + lName;
                    await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi, System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\SessionInvite.html"),
                  new Dictionary<string, string>()
                  {
                       { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{userFullName}}", user == null ? "there" : (user.IsParent ? (user.ParentFirstName + " " + user.ParentLastName) : (user.FirstName + " " + user.LastName)) },
                        {"{{lessonLable}}","Course" },
                        {"{{courseDetail}}",course.Description },
                        { "{{tutorFullName}}", tutorFullName },
                        { "{{lessonName}}", course.Name },
                        { "{{lessonDateTime}}", DateTimeOffset.Parse(course.StartDate.Value.ToString()).ToString("dd-MM-yyyy hh:mm tt") },
                        { "{{lessonPrice}}",  stripeCountry.CurrencySymbol + (coursePriceTotal>0?coursePriceTotal.ToString("#.##"):"0.00") },
                        {"{{classSessionDetail}}",sb.ToString() },
                        //{ "{{lessonSignUpUrl}}", _AppSettings.MainSiteUrl + "/" + (user == null || !user.IsParent ? "student-enroll" : "guardian-enroll") + "/" + model.ClassSessionId },
                        { "{{lessonSignUpUrl}}", _AppSettings.MainSiteUrl + "/Invitation-course-detail/"+course.CourseId},
                  }, model.Email, settings.SendGridFromEmail, $"{tutorFullName} has invited you to take part in their course on 2utoring");
                }
                else
                {
                    //await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                    //    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\SessionInvite.html"),
                    //    new Dictionary<string, string>()
                    //    {
                    //    { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                    //    { "{{userFullName}}", user == null ? "there" : (user.IsParent ? (user.ParentFirstName + " " + user.ParentLastName) : (user.FirstName + " " + user.LastName)) },
                    //    { "{{tutorFullName}}", data.TutorFirstName + " " + data.TutorLastName },
                    //    { "{{lessonName}}", data.LessonName },
                    //    { "{{lessonDateTime}}", TimeZoneInfo.ConvertTimeFromUtc(data.LessonStartDate.UtcDateTime, TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time")).ToString("d/M/yyyy h:mm tt").ToLower() },
                    //    { "{{lessonPrice}}", "£" + data.LessonPrice.ToString("#.##") },
                    //    //{ "{{lessonSignUpUrl}}", _AppSettings.MainSiteUrl + "/" + (user == null || !user.IsParent ? "student-enroll" : "guardian-enroll") + "/" + model.ClassSessionId },
                    //    { "{{lessonSignUpUrl}}", _AppSettings.MainSiteUrl + "/lesson/" + model.ClassSessionId },
                    //}, model.Email, settings.SendGridFromEmail, $"Lesson invitation from {data.TutorFirstName} {data.TutorLastName} - 2utoring");
                }
            }
            return model;
        }

        public async Task CreateBulk(DTO.SessionInvite model)
        {
            var splitEmails = model.BulkEmailString.Split(',');
            foreach (var splitEmail in splitEmails)
            {
                var toAdd = new Models.SessionInvite()
                {
                    ClassSessionId = model.ClassSessionId,
                    Email = splitEmail.Trim(),
                };
                await Create(toAdd);
            }
        }

        public async Task<Models.SessionInvite> Update(Models.SessionInvite model)
        {
            await _UnitOfWork.Repository<Models.SessionInvite>().Update(model);
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

