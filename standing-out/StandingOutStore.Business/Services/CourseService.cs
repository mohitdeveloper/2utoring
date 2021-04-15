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
using StandingOut.Data.Enums;
using Mapping = StandingOut.Shared.Mapping;
using StandingOut.Shared.Helpers.GoogleHelper;
using System.Linq.Dynamic.Core;
using StandingOut.Shared.Mapping;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using StandingOut.Shared.Helpers.AzureFileHelper;
using StandingOut.Data.DTO;
using StandingOut.Data.Migrations;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;

namespace StandingOutStore.Business.Services
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed;
        private readonly IAzureFileHelper _AzureFileHelper;
        private readonly IGoogleHelper _GoogleHelper;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly IStripeCountryService _StripeCountryService;
        public CourseService(IUnitOfWork unitOfWork, IAzureFileHelper azureFileHelper, IGoogleHelper googleHelper, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings,IStripeCountryService stripeCountryService)
        {
            _UnitOfWork = unitOfWork;
            _AzureFileHelper = azureFileHelper;
            _GoogleHelper = googleHelper;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _Enviroment = hosting;
            _StripeCountryService = stripeCountryService;
        }
        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }
        public async Task<Models.Course> Create(Models.Course model)
        {
            if (model.ClassSessions.Count > 0)
            {
                foreach (var item in model.ClassSessions)
                {
                    if (item.RequiresGoogleAccount == true)
                    {
                        item.SessionDirectoryName = _GoogleHelper.SessionFolderName(item);
                        item.MasterStudentDirectoryName = _GoogleHelper.MasterStudentFolderName(item);
                        var sessionDetails = await _GoogleHelper.CreateSessionDirectory(item);
                        item.BaseTutorDirectoryId = sessionDetails.BaseTutorFolder.Id;
                        item.BaseStudentDirectoryId = sessionDetails.BaseStudentFolder.Id;
                        item.MasterStudentDirectoryId = sessionDetails.MasterStudentFolder.Id;
                        item.SessionDirectoryId = sessionDetails.SessionFolder.Id;
                        item.SharedStudentDirectoryId = sessionDetails.SharedStudentFolder.Id;
                    }
                }
            }
            await _UnitOfWork.Repository<Models.Course>().Insert(model);
            return model;
        }

        public async Task<bool> GetExistingClassSession(List<DTO.ClassSession> classSessionsList)
        {
            bool IsClassSessionExist = false;
            if (classSessionsList.Count > 0)
            {
                foreach (var item in classSessionsList)
                {
                    var cs = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(x => x.OwnerId == item.OwnerId && x.ClassSessionId != item.ClassSessionId && !x.IsDeleted && x.StartDate == item.StartDate && x.EndDate == item.EndDate);
                    if (cs != null)
                    {
                        IsClassSessionExist = true;
                        break;
                    }
                }
            }
            return IsClassSessionExist;
        }
        public async Task<bool> CourseNotification(Guid courseId)
        {

            var courseObj = await _UnitOfWork.Repository<Models.Course>().GetSingle(o => o.CourseId == courseId, includeProperties: "ClassSessions, Tutor.Users,Subject, StudyLevel");
            var user = courseObj.Tutor.Users.FirstOrDefault();
            #region Tutor Name
            string fName = user.FirstName;
            string lName = user.LastName;
            fName = char.ToUpper(fName[0]) + fName.Substring(1);
            lName = char.ToUpper(lName[0]) + lName.Substring(1);
            #endregion
            var coursePriceTotal = courseObj.ClassSessions.Sum(x => x.PricePerPerson);
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            if (courseObj.ClassSessions.Count > 0)
            {
                sb.Append("<table style='border-collapse:collapse; width:100%;'>");
                sb.Append("<thead><tr>");
                sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'>Lesson Name</th>");
                sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'>Description</th>");
                sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'>Subject</th>");
                sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'>Level</th>");
                sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'> Date & Time</th>");
                sb.Append("<th style='text-align: left;padding: 8px; background-color: #4CAF50;color: white;'>Price</th>");
                sb.Append("</tr></thead>");
                sb.Append("<tbody>");
                foreach (var item in courseObj.ClassSessions)
                {
                    TimeSpan ts = item.EndDate - item.StartDate;
                    string duration = ts.Minutes.ToString();
                    sb.Append("<tr style='font-size: 12px;'>");
                    sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>" + item.Name + "</td>");
                    sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>" + item.LessonDescriptionBody + "</td>");
                    sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>" + courseObj.Subject.Name + "</td>");
                    sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>" + courseObj.StudyLevel.Name + "</td>");
                    sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>" + item.StartDate.ToString("MM/dd/yyyy h:mm tt") + "</td>");
                    sb.Append("<td style='text-align: left;padding: 8px;border: 1px solid #eee;'>£" + item.PricePerPerson.ToString("#.##") + "</td>");
                    sb.Append("</tr>");
                }
                sb.Append("</tbody>");
                sb.Append("</table>");
            }
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();
            await Utilities.EmailUtilities.SendTemplateEmail
                (
                    settings.SendGridApi,
                    System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\CourseNotification.html"),
                    new Dictionary<string, string>()
                 {
                     { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                     { "{{tutorFullName}}", fName + " " + lName },
                     { "{{courseName}}", courseObj.Name },
                     { "{{courseDateTime}}", DateTimeOffset.Parse(courseObj.StartDate.Value.ToString()).ToString("dd-MM-yyyy hh:mm tt") },
                     { "{{coursePrice}}", "£" + (coursePriceTotal>0?coursePriceTotal.ToString("#.##"):"0.00") },
                     {"{{courseDetail}}",courseObj.Description },
                     {"{{classSessionDetail}}",sb.ToString() },
                     { "{{courseSignUpUrl}}", _AppSettings.MainSiteUrl + "/Invitation-course-detail/"+courseId},
                 },
                    user.Email,
                    settings.SendGridFromEmail,
                    $"{fName + " " + lName} a new course has been created for you"
                );

            courseObj.UniqueNumber = null;
            courseObj.IPAddress = null;
            await _UnitOfWork.Repository<Models.Course>().Update(courseObj);
            return true;
        }
        public async Task<Models.Course> UpdateCourse(Models.Course model)
        {


            foreach (var item in model.ClassSessions)
            {
                if (item.ClassSessionId == Guid.Empty)
                {
                    if (item.RequiresGoogleAccount == true && item.BaseTutorDirectoryId == null)
                    {
                        item.SessionDirectoryName = _GoogleHelper.SessionFolderName(item);
                        item.MasterStudentDirectoryName = _GoogleHelper.MasterStudentFolderName(item);
                        var sessionDetails = await _GoogleHelper.CreateSessionDirectory(item);
                        item.BaseTutorDirectoryId = sessionDetails.BaseTutorFolder.Id;
                        item.BaseStudentDirectoryId = sessionDetails.BaseStudentFolder.Id;
                        item.MasterStudentDirectoryId = sessionDetails.MasterStudentFolder.Id;
                        item.SessionDirectoryId = sessionDetails.SessionFolder.Id;
                        item.SharedStudentDirectoryId = sessionDetails.SharedStudentFolder.Id;
                    }
                    await _UnitOfWork.Repository<Models.ClassSession>().Insert(item);
                }
                else
                {
                    if (item.RequiresGoogleAccount == true)
                    {
                        if (item.BaseTutorDirectoryId == null)
                        {
                            await _GoogleHelper.CreateSessionDirectory(item);
                            //item.SessionDirectoryName = _GoogleHelper.SessionFolderName(item);
                            //item.MasterStudentDirectoryName = _GoogleHelper.MasterStudentFolderName(item);
                            //var sessionDetails = await _GoogleHelper.CreateSessionDirectory(item);
                            //item.BaseTutorDirectoryId = sessionDetails.BaseTutorFolder.Id;
                            //item.BaseStudentDirectoryId = sessionDetails.BaseStudentFolder.Id;
                            //item.MasterStudentDirectoryId = sessionDetails.MasterStudentFolder.Id;
                            //item.SessionDirectoryId = sessionDetails.SessionFolder.Id;
                            //item.SharedStudentDirectoryId = sessionDetails.SharedStudentFolder.Id;
                        }
                        else
                        {
                            await _UnitOfWork.Repository<Models.ClassSession>().Update(item);
                        }
                    }
                    else
                    {
                        await _UnitOfWork.Repository<Models.ClassSession>().Update(item);
                    }
                }

            }
            await _UnitOfWork.Repository<Models.Course>().Update(model);
            return model;
        }

        public async Task<DTO.GDrive> checkAndCreateGoogleDriverFolders(DTO.GDrive model)
        {
            DTO.GDrive returnModel = new DTO.GDrive();
            if (model.classSessionId != null)
            {
                var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(x => x.ClassSessionId == model.classSessionId);
                if (model.status)
                {
                    if (classSession.BaseTutorDirectoryId == null && classSession.BaseStudentDirectoryId == null)
                    {
                        classSession.RequiresGoogleAccount = model.status;
                        await _GoogleHelper.CreateSessionDirectory(classSession);
                        returnModel.ApiResponse = true;
                        returnModel.BaseTutorDirectoryId = classSession.BaseTutorDirectoryId;
                        returnModel.SessionDirectoryName = classSession.SessionDirectoryName;
                        returnModel.SessionDirectoryId = classSession.SessionDirectoryId;
                        returnModel.BaseStudentDirectoryId = classSession.BaseStudentDirectoryId;
                        returnModel.BaseTutorDirectoryId = classSession.BaseTutorDirectoryId;
                        returnModel.SharedStudentDirectoryId = classSession.SharedStudentDirectoryId;
                        returnModel.MasterStudentDirectoryName = classSession.MasterStudentDirectoryName;
                        returnModel.MasterStudentDirectoryId = classSession.MasterStudentDirectoryId;
                        returnModel.MasterFilesCopied = classSession.MasterFilesCopied;
                    }
                    else
                    {

                        classSession.RequiresGoogleAccount = model.status;
                        await _UnitOfWork.Repository<Models.ClassSession>().Update(classSession);
                        returnModel.ApiResponse = true;
                        returnModel.BaseTutorDirectoryId = classSession.BaseTutorDirectoryId;
                        returnModel.SessionDirectoryName = classSession.SessionDirectoryName;
                        returnModel.SessionDirectoryId = classSession.SessionDirectoryId;
                        returnModel.BaseStudentDirectoryId = classSession.BaseStudentDirectoryId;
                        returnModel.BaseTutorDirectoryId = classSession.BaseTutorDirectoryId;
                        returnModel.SharedStudentDirectoryId = classSession.SharedStudentDirectoryId;
                        returnModel.MasterStudentDirectoryName = classSession.MasterStudentDirectoryName;
                        returnModel.MasterStudentDirectoryId = classSession.MasterStudentDirectoryId;
                        returnModel.MasterFilesCopied = classSession.MasterFilesCopied;

                    }

                }
                else
                {

                    classSession.RequiresGoogleAccount = model.status;
                    await _UnitOfWork.Repository<Models.ClassSession>().Update(classSession);
                    returnModel.ApiResponse = true;
                    returnModel.BaseTutorDirectoryId = classSession.BaseTutorDirectoryId;
                    returnModel.SessionDirectoryName = classSession.SessionDirectoryName;
                    returnModel.SessionDirectoryId = classSession.SessionDirectoryId;
                    returnModel.BaseStudentDirectoryId = classSession.BaseStudentDirectoryId;
                    returnModel.BaseTutorDirectoryId = classSession.BaseTutorDirectoryId;
                    returnModel.SharedStudentDirectoryId = classSession.SharedStudentDirectoryId;
                    returnModel.MasterStudentDirectoryName = classSession.MasterStudentDirectoryName;
                    returnModel.MasterStudentDirectoryId = classSession.MasterStudentDirectoryId;
                    returnModel.MasterFilesCopied = classSession.MasterFilesCopied;
                }


            }
            return returnModel;

        }

        public async Task DeleteCourse(Guid courseId)
        {
            var RemoveCourse = await _UnitOfWork.Repository<Models.Course>().GetSingle(x => x.CourseId == courseId, includeProperties: "ClassSessions");
            if (RemoveCourse != null)
            {
                RemoveCourse.IsDeleted = true;
                foreach (var item in RemoveCourse.ClassSessions)
                {
                    item.IsDeleted = true;
                }
                await _UnitOfWork.Repository<Models.Course>().Update(RemoveCourse);
            }

        }
        public async Task DeleteCourseClassSession(Guid classSessionId)
        {
            var RemoveCourseClassSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(x => x.ClassSessionId == classSessionId && x.IsDeleted == false);
            if (RemoveCourseClassSession != null)
            {
                RemoveCourseClassSession.IsDeleted = true;
                await _UnitOfWork.Repository<Models.ClassSession>().Update(RemoveCourseClassSession);
            }

        }
        public async Task<List<Models.Course>> GetCompanyCoureses(Guid companyId)
        {
            return await _UnitOfWork.Repository<Models.Course>().Get(x => x.CompanyId == companyId && x.IsDeleted == false, includeProperties: "ClassSessions");

        }
        public async Task<Models.Course> GetCouresClassSession(Guid courseId)
        {
            var courseModel = await _UnitOfWork.Repository<Models.Course>().GetSingle(x => x.CourseId == courseId && x.IsDeleted == false, includeProperties: "Company,Subject, StudyLevel,SubjectCategory,Tutor,Tutor.TutorAvailabilities,ClassSessions,ClassSessions.SessionMedia,OrderItems");
            courseModel.ClassSessions = courseModel.ClassSessions.Where(x => x.IsDeleted == false).ToList();
            return courseModel;
        }

        public async Task<Models.Course> GetById(Guid courseId)
        {
            var courseModel = await _UnitOfWork.Repository<Models.Course>().GetSingle(x => x.CourseId == courseId && x.IsDeleted == false, includeProperties: "Tutor,Tutor.Users");
            courseModel.ClassSessions = courseModel.ClassSessions.Where(x => x.IsDeleted == false).ToList();

            return courseModel;
        }

        public async Task<DTO.PagedList<DTO.Course>> GetPaged(DTO.SearchModel model, Guid id, string role)
        {
            string includes = "Company,Subject, StudyLevel,SubjectCategory, ClassSessions,Tutor.Users, ClassSessions.SessionAttendees,OrderItems";
            IQueryable<Models.Course> data = _UnitOfWork.Repository<Models.Course>().GetQueryable(includeProperties: includes);
            foreach (var item in data.ToList())
            {
                item.ClassSessions = item.ClassSessions.Where(x => x.IsDeleted == false).OrderBy(y=>y.StartDate).ToList();
                item.PricePerPerson = item.ClassSessions.Sum(x => x.PricePerPerson);
            }

            if (!string.IsNullOrWhiteSpace(role) && id != null)
            {

                if (role == "Admin")
                {
                    data = data.Where(o => o.CompanyId == id);
                }
                else
                {
                    data = data.Where(o => o.TutorId == id);
                }
            }

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => (o.Name != null && o.Name.ToLower().Contains(search)));
            }

            if (model.StartDate.HasValue)
            {
                data = data.Where(o => o.StartDate >= model.StartDate);
            }

            if (model.EndDate.HasValue)
            {
                data = data.Where(o => o.StartDate < model.EndDate);
            }

            if (!string.IsNullOrEmpty(model.Filter))
            {
                if (model.Filter == "upcoming")
                {
                    // data = data.Where(o => o.EndDate >= DateTime.Now.AddHours(-1));
                    data = data.Where(o => o.EndDate.Value.UtcDateTime >= DateTime.Now.AddHours(-1).ToUniversalTime());
                }
                else if (model.Filter == "previous")
                {
                    data = data.Where(o => o.EndDate.Value.UtcDateTime < DateTime.Now.AddHours(-1).ToUniversalTime());
                }
            }

            var result = new DTO.PagedList<DTO.Course>();

            System.Reflection.PropertyInfo prop = typeof(Models.Course).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {
                if (model.SortType == "SubjectName")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.Subject.Name) : data.OrderByDescending(o => o.Subject.Name);
                }
                else if (model.SortType == "StudyLevelName")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.StudyLevel.Name) : data.OrderByDescending(o => o.StudyLevel.Name);
                }
                else if (model.SortType == "ClassSession")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.ClassSessions.Count) : data.OrderByDescending(o => o.ClassSessions.Count);
                }
                //else if (model.SortType == "Status")
                //{
                //    data = model.Order == "ASC" ? data.OrderBy(o => o.SessionAttendees.Where(o => o.Refunded == false && o.TutorPaid == TutorPaymentStatus.Paid).Count() == 0) : data.OrderByDescending(o => o.SessionAttendees.Where(o => o.Refunded == false && o.TutorPaid == TutorPaymentStatus.Paid).Count() == 0);
                //}
            }

            var temp = await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync();
            result.Data = Mapping.Mappings.Mapper.Map<List<Models.Course>, List<DTO.Course>>(temp);
            result.Data = result.Data.OrderBy(x => x.StartDate).ToList();
            //foreach (var item in result.Data)
            //{
            //    //item.ClassSessionsCount = item.ClassSessions.Count;
            //    //item.CourseAttendeesCount = item.ClassSessions.Sum(x => x.SessionAttendeesCount);
            //    //item.ClassSessionsTotalAmount = item.ClassSessions.Sum(x => x.PricePerPerson);
            //}


            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;

            return result;
        }

        public async Task<DTO.CourseCardSet> GetCardSet(Guid courseId)
        {

            DTO.CourseCardSet model = await _UnitOfWork.Repository<Models.Course>()
              .GetQueryable(x => x.CourseId == courseId && x.IsDeleted == false
                  , includeProperties: "Subject, SubjectCategory, StudyLevel,ClassSessions.Subject, ClassSessions.SubjectCategory, ClassSessions.StudyLevel, ClassSessions.Owner, ClassSessions.Owner.Tutor, ClassSessions.Owner.Tutor.TutorQualifications, ClassSessions.Owner.Tutor.TutorSubjects, ClassSessions.Owner.Tutor.TutorSubjects.Subject, ClassSessions.SessionAttendees")
              .AsNoTracking()
               .Select(x => new DTO.CourseCardSet()
               {
                   Course = Mapping.Mappings.Mapper.Map<Models.Course, DTO.Course>(x),
                   LessonList = Mapping.Mappings.Mapper.Map<List<Models.ClassSession>, List<DTO.LessonCard>>(x.ClassSessions.Where(y => y.IsDeleted == false && y.StartDate.UtcDateTime >= DateTime.UtcNow.AddHours(1)).ToList()),
                   Tutor = Mapping.Mappings.Mapper.Map<Models.User, DTO.TutorCard>(x.Tutor.Users.FirstOrDefault())
               }).FirstOrDefaultAsync();
            if (model != null && model.Course != null && model.Course.ClassSessions != null)
            {
                model.Course.ClassSessions = new List<ClassSession>();
            }
            return model;
        }
        public async Task<List<Models.ClassSession>> GetFutureLessons(Guid courseId)
        {

            var course = await _UnitOfWork.Repository<Models.Course>()
              .GetSingle(x => x.CourseId == courseId && !x.IsDeleted && x.ClassSessions.Any(),
                includeProperties: "Subject, SubjectCategory, StudyLevel,ClassSessions.Subject, ClassSessions.SubjectCategory, ClassSessions.StudyLevel, ClassSessions.Owner, ClassSessions.Owner.Tutor, ClassSessions.Owner.Tutor.TutorQualifications, ClassSessions.Owner.Tutor.TutorSubjects, ClassSessions.Owner.Tutor.TutorSubjects.Subject, ClassSessions.SessionAttendees");
            if (course != null)
            {
                var classSessions = course.ClassSessions.Where(x => x.StartDate.UtcDateTime >= DateTime.UtcNow.AddMinutes(5) && x.IsDeleted==false).ToList();
                return classSessions;
            }
            return new List<Models.ClassSession>();
        }
        public async Task<Models.Course> GetPurchaseCouresData(Guid courseId)
        {
            var courseModel = await _UnitOfWork.Repository<Models.Course>().GetSingle(x => x.CourseId == courseId && x.IsDeleted == false, includeProperties: "Subject, StudyLevel,SubjectCategory,Tutor,Tutor.Users.StripeCountry,ClassSessions");
            courseModel.ClassSessions = courseModel.ClassSessions.Where(x => x.IsDeleted == false && x.StartDate.UtcDateTime >= DateTime.UtcNow.AddMinutes(5)).ToList();
            return courseModel;
        }
        public async Task<DTO.CourseProfile> GetCouresInfo(Guid courseId)
        {
            CourseProfile CourseData = new CourseProfile();
            DTO.StripeCountry stripeCountry = new DTO.StripeCountry();
            string includeProperties = "ClassSessions,ClassSessions.SessionAttendees,Tutor.Users,Company,Subject,StudyLevel,OrderItems";
            var data = await _UnitOfWork.Repository<Models.Course>().GetSingle(o => o.CourseId == courseId, includeProperties: includeProperties);
            var ObjCourse = Mapping.Mappings.Mapper.Map<Models.Course, DTO.Course>(data);
            var ObjTutor = Mapping.Mappings.Mapper.Map<Models.Tutor, DTO.Tutor>(data.Tutor);
            if (ObjTutor.StripeCountryID != null)
            {
                var sCountry = await _StripeCountryService.GetById(Guid.Parse(ObjTutor.StripeCountryID.ToString()));
                stripeCountry= Mapping.Mappings.Mapper.Map<Models.StripeCountry, DTO.StripeCountry>(sCountry);
            }

            var classSession = ObjCourse.ClassSessions.Where(y => y.StartDate.UtcDateTime >= DateTime.UtcNow.AddMinutes(5) && y.EndDate.UtcDateTime >= DateTime.UtcNow && y.IsDeleted == false).ToList();
            ObjCourse.ClassSessions.Clear();
            ObjCourse.ClassSessions = classSession.OrderBy(x=>x.StartDate).ToList();
            ObjCourse.StartDate = ObjCourse.ClassSessions.First().StartDate;
            ObjCourse.ClassSessionsTotalAmount = classSession.Sum(x => x.PricePerPerson);
            ObjCourse.ClassSessionsCount = classSession.Count;
            
            //ObjCourse.CourseAttendeesCount = data.ClassSessions.Sum(x => x.SessionAttendees.Where(o => o.Refunded == false).Count());
            ObjTutor.SubjectStudyLevelSetup = new List<DTO.SubjectStudyLevelSetup>();
            var tutorPriceList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.TutorId == ObjTutor.TutorId && o.IsDeleted == false, includeProperties: "Subject,StudyLevel");
            List<Models.SubjectStudyLevelSetup> subjectStudyLevelSetup = new List<Models.SubjectStudyLevelSetup>();
            if (data.Company != null)
            {
                ObjTutor.CurrentCompany = Mapping.Mappings.Mapper.Map<Models.Company, DTO.Company>(data.Company);
                var companyPriceList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.CompanyId == data.Company.CompanyId && o.IsDeleted == false, includeProperties: "Subject,StudyLevel");
                foreach (var item1 in tutorPriceList)
                {
                    var P1 = companyPriceList.Where(o => o.SubjectId == item1.SubjectId && o.StudyLevelId == item1.StudyLevelId && o.CreatedBy == item1.CreatedBy).Select(x => x).FirstOrDefault();
                    if (P1 != null)
                    {
                        subjectStudyLevelSetup.Add(P1);
                    }
                }
            }
            else
            {
                subjectStudyLevelSetup = tutorPriceList;

            }
            if (subjectStudyLevelSetup.Count > 0)
            {
                ObjTutor.TutorPriceLesson.OneToOneMinPrice = subjectStudyLevelSetup.Min(x => x.PricePerPerson);
                ObjTutor.TutorPriceLesson.OneToOneMaxPrice = subjectStudyLevelSetup.Max(x => x.PricePerPerson);
                ObjTutor.TutorPriceLesson.GroupMinPrice = Convert.ToDecimal(subjectStudyLevelSetup.Min(x => x.GroupPricePerPerson));
                ObjTutor.TutorPriceLesson.GroupMaxPrice = Convert.ToDecimal(subjectStudyLevelSetup.Max(x => x.GroupPricePerPerson));
                ObjTutor.TutorSubjectNameList = subjectStudyLevelSetup.Where(x => !x.IsDeleted).Select(x => x.Subject.Name).Distinct().ToList();
            }
            var tutorQualification = await _UnitOfWork.Repository<Models.TutorQualification>().Get(o => o.TutorId == ObjTutor.TutorId && o.IsDeleted == false);
            ObjTutor.TutorQualification = tutorQualification.Where(x => !x.IsDeleted).Select(x => x.Name).ToList();

            var TutorLessonList = await _UnitOfWork.Repository<Models.ClassSession>().Get(o => o.OwnerId == ObjTutor.UserId && o.IsDeleted == false && o.Complete == true && o.EndedAtDate >= DateTime.Now.AddDays(-30));
            if (TutorLessonList.Count > 0)
            {
                ObjTutor.TutorPriceLesson.OneToOneLessonCount = TutorLessonList.Count(x => x.MaxPersons == 1 && x.Complete == true);
                ObjTutor.TutorPriceLesson.GroupLessonCount = TutorLessonList.Count(x => x.MaxPersons > 1 && x.Complete == true);
            }

            CourseData.Course = ObjCourse;
            CourseData.Tutor = ObjTutor;
            CourseData.StripeCountry = stripeCountry;
            CourseData.RelatedCourseList = await GetRelatedCouresDetail(ObjCourse);
            return CourseData;
        }

        public async Task<List<DTO.CourseDetail>> GetRelatedCouresDetail(Course co)
        {
            List<CourseDetail> courseDetailList = new List<CourseDetail>();
            string includeProperties = "OrderItems,ClassSessions,ClassSessions.SessionAttendees,Tutor.Users,Tutor.TutorQualifications,Tutor.TutorAvailabilities,Subject,StudyLevel";
            var data = await _UnitOfWork.Repository<Models.Course>().Get(x => x.CourseId != co.CourseId && x.SubjectId == co.SubjectId
            && x.IsDeleted == false && x.CourseType == CourseType.Public && x.EndDate.Value.UtcDateTime >= DateTime.UtcNow, includeProperties: includeProperties);

            foreach (var item in data)
            {
                if (item.OrderItems.Count < item.MaxClassSize)
                {
                    var classSession = item.ClassSessions.Where(y=>y.IsDeleted==false).OrderByDescending(x => x.StartDate).FirstOrDefault();
                    if (classSession != null)
                    {
                        DTO.StripeCountry stripeCountry = new DTO.StripeCountry();
                        #region Tutor Availabilities and Booked slot
                        int totalSlotCount = await GetFutureAvailableSlot(item.Tutor.TutorId);
                        int totalBookedSlot = await GetBookedSlot(item.Tutor.Users.FirstOrDefault().Id);
                        #endregion
                        if (item.Tutor.Users.FirstOrDefault().StripeCountryID != null)
                        {
                            var sCountry = await _StripeCountryService.GetById(Guid.Parse(item.Tutor.Users.FirstOrDefault().StripeCountryID.ToString()));
                            stripeCountry = Mapping.Mappings.Mapper.Map<Models.StripeCountry, DTO.StripeCountry>(sCountry);
                        }
                        courseDetailList.Add(new CourseDetail
                        {
                            CourseId = item.CourseId,
                            CourseName = item.Name,
                            SubjectName = item.Subject.Name,
                            StudyLevelName = item.StudyLevel.Name,
                            ClassSessionsCount = item.ClassSessions.Count(),
                            CourseTotalAmount = item.ClassSessions.Sum(x => x.PricePerPerson),
                            TotalBookedSlot = totalBookedSlot,
                            TotalSlotCount = totalSlotCount,
                            StartDate = classSession.StartDate,
                            EndDate = classSession.EndDate,
                            PlacesRemaining = item.MaxClassSize - item.ClassSessions.Sum(x => x.SessionAttendees.Where(o => o.Refunded == false).Count()),
                            TutorId = item.Tutor.TutorId,
                            TutorName = item.Tutor.Users.FirstOrDefault().Title + ". " + item.Tutor.Users.FirstOrDefault().FirstName + " " + item.Tutor.Users.FirstOrDefault().LastName,
                            TutorDBSStatus = item.Tutor.DbsApprovalStatus,
                            TutorImage = !string.IsNullOrEmpty(item.Tutor.ProfileImageFileLocation) ? $"/Tutor/Home/DownloadTutorProfileImage/{item.Tutor.TutorId}?dummy={Guid.NewGuid()}" : "",
                            TutorQualification = item.Tutor.TutorQualifications.Select(x => x.Name).ToList(),
                            StripeCountry= stripeCountry
                        });
                    }
                }

                if (courseDetailList.Count == 3)
                    break;
            }
            return courseDetailList;
        }

        public async Task<int> GetFutureAvailableSlot(Guid tutorId)
        {
            var tutorAvailability = await _UnitOfWork.Repository<Models.TutorAvailability>().Get(o => o.TutorId == tutorId && o.IsDeleted == false
                       && o.StartTime.AddDays(Convert.ToInt32(o.NoOfWeek * 7)).ToUniversalTime() >= DateTime.Now.ToUniversalTime());
            int totalSlotCount = 0;
            foreach (var av in tutorAvailability)
            {
                totalSlotCount = totalSlotCount + Convert.ToInt32((av.NoOfWeek == 0 ? 1 : av.NoOfWeek));
                var nextDate = DateTime.Now;
                double d = (double)((nextDate - av.StartTime).Days) / 7.0;
                int noOfDays = Convert.ToInt32(Math.Ceiling(d)); //less then 0 mean previus date return minus value 
                if (Convert.ToInt32(av.DayOfWeek) != -1 && noOfDays > 0)
                {
                    totalSlotCount = totalSlotCount - noOfDays;
                }
            }
            return totalSlotCount;
        }
        public async Task<int> GetBookedSlot(string OwnerId)
        {
            var classSessions = await _UnitOfWork.Repository<Models.ClassSession>().Get(x => x.OwnerId == OwnerId && x.StartDate.ToUniversalTime() >= DateTime.UtcNow && x.IsDeleted == false);
            return classSessions.Count();
        }
    }
}
