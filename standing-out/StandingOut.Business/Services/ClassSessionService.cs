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
using StandingOut.Shared.Helpers.GoogleHelper;
using StandingOut.Shared.Helpers.AzureFileHelper;
using Mapping = StandingOut.Shared.Mapping;
using StandingOut.Data.Enums;
//using StandingOut.Data.Models;
using ssbsi = StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data.Migrations;

namespace StandingOut.Business.Services
{
    public class ClassSessionService : IClassSessionService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private readonly AppSettings _AppSettings;
        private readonly IAcuitySchedulingHelper _AcuitySchedulingHelper;
        private readonly IGoogleHelper _GoogleHelper;
        private readonly IAzureFileHelper _AzureFileHelper;
        private readonly ssbsi.IClassSessionSubscriptionFeatureService _ClassSessionSubscriptionFeatureService;

        private bool _Disposed;

        public ClassSessionService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext
            , IOptions<AppSettings> appSettings, UserManager<Models.User> userManager, IAcuitySchedulingHelper acuitySchedulingHelper
            , IGoogleHelper googleHelper, IAzureFileHelper azureFileHelper)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _AcuitySchedulingHelper = acuitySchedulingHelper;
            _GoogleHelper = googleHelper;
            _AzureFileHelper = azureFileHelper;
            //_ClassSessionSubscriptionFeatureService = ClassSessionSubscriptionFeatureService;
        }
        public ClassSessionService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext
           , UserManager<Models.User> userManager, IGoogleHelper googleHelper)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = null;
            _UserManager = userManager;
            _AcuitySchedulingHelper = null;
            _GoogleHelper = googleHelper;
        }

        public ClassSessionService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.ClassSession>> Get()
        {
            return await _UnitOfWork.Repository<Models.ClassSession>().Get(includeProperties: "Owner, SessionAttendees");
        }

        public async Task<List<Models.ClassSession>> GetByTutor(string id)
        {
            return await _UnitOfWork.Repository<Models.ClassSession>().Get(o => o.OwnerId == id, includeProperties: "SessionAttendees");
        }

        public async Task<List<Models.ClassSession>> GetLastMonth(string userId)
        {
            return await _UnitOfWork.Repository<Models.ClassSession>()
                .Get(o => o.StartDate > DateTime.Now.AddDays(-30) && o.StartDate < DateTime.Now && o.SessionAttendees.Any(a => a.UserId == userId && a.IsDeleted == false),
                orderBy: x => x.OrderByDescending(y => y.StartDate));
        }

        public async Task<DTO.PagedList<DTO.ClassSessionIndex>> GetPaged(DTO.SearchModel model, Models.User user, bool tutor, bool past)
        {
            IQueryable<Models.ClassSession> query = _UnitOfWork.Repository<Models.ClassSession>().GetQueryable(includeProperties: "Owner");

            if (past)
                query = query.Where(o => o.EndDate < DateTime.Now);
            else
                query = query.Where(o => o.EndDate > DateTime.Now);

            if (tutor)
                query = query.Where(o => o.OwnerId == user.Id);
            else
                query = query.Where(o => o.SessionAttendees.Any(a => a.UserId == user.Id && a.IsDeleted == false));

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                query = query.Where(o => o.Name != null && o.Name.ToLower().Contains(search));
            }

            var countQuery = query;

            System.Reflection.PropertyInfo prop = typeof(Models.ClassSession).GetProperty(model.SortType);
            if (prop != null)
            {
                query = model.Order == "DESC" ? query.OrderByDescending(x => prop.GetValue(x, null)) : query.OrderBy(x => prop.GetValue(x, null));
            }
            else
            {
                if (past)
                {
                    query = query.OrderByDescending(x => x.StartDate);
                }
                else
                {
                    query = query.OrderBy(x => x.StartDate);
                }
            }

            var result = new DTO.PagedList<DTO.ClassSessionIndex>();

            result.Data = Mapping.Mappings.Mapper.Map<List<Models.ClassSession>, List<DTO.ClassSessionIndex>>(await query.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = await countQuery.CountAsync();
            result.Paged.TotalPages = result.Paged.TotalCount % result.Paged.Take == 0 ? (result.Paged.TotalCount / result.Paged.Take) - 1 : result.Paged.TotalCount / result.Paged.Take;

            return result;
        }

        public async Task<DTO.PagedList<DTO.ClassSessionIndex>> Search(DTO.SearchModel model)
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
                data = data.Where(o => o.EndDate <= model.StartDate);
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

            result.Data = Mapping.Mappings.Mapper.Map<List<Models.ClassSession>, List<DTO.ClassSessionIndex>>(await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = await dataCount.CountAsync();
            result.Paged.TotalPages = result.Paged.TotalCount % result.Paged.Take == 0 ? (result.Paged.TotalCount / result.Paged.Take) - 1 : result.Paged.TotalCount / result.Paged.Take;

            return result;
        }

        public async Task<Models.ClassSession> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == id, includeProperties: "SessionAttendees, SessionAttendees.User, Owner, SessionGroups, Hub, Course, SessionAttendees.Order,SessionAttendees.GoogleFilePermissions");
        }

        public async Task<Models.ClassSession> GetByIdWithTutor(Guid id)
        {
            return await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == id, includeProperties: "Owner");
        }

        public async Task<Models.ClassSession> Create(Models.ClassSession model)
        {
            await _UnitOfWork.Repository<Models.ClassSession>().Insert(model);
            return model;
        }

        public async Task<Models.ClassSession> Update(Models.ClassSession model)
        {
            await _UnitOfWork.Repository<Models.ClassSession>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var model = await GetById(id);
            model.IsDeleted = true;
            await Update(model);
        }

        public async Task HandleWebhook(string action, int id, int calendarId, int appointmentTypeId)
        {
            switch (action.ToLower().Trim())
            {
                case "scheduled":
                    await Create(id, calendarId, appointmentTypeId);
                    break;
                case "rescheduled":
                    await Reschedule(id, calendarId, appointmentTypeId);
                    break;
                case "canceled":
                    //await Cancelled(id, calendarId, appointmentTypeId);
                    break;
                case "changed":
                    //do nothing
                    break;
                case "order.completed":
                    //do nothing
                    break;
                default:
                    throw new Exception("Unknown Response");
            }
        }


        private async Task<Models.ClassSession> Create(int id, int calendarId, int appointmentTypeId)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.CalendarId == calendarId, includeProperties: "Users");
            var user = _UserManager.Users.FirstOrDefault(o => o.TutorId == tutor.TutorId);
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

            if (tutor != null && user != null)
            {
                Models.ClassSession model = null;

                var appointment = await _AcuitySchedulingHelper.GetAppointment(id);
                if (appointment != null)
                {

                    if (appointment.ClassID.HasValue)
                    {
                        model = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassId == appointment.ClassID.Value);
                    }
                    else
                    {
                        model = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.AppointmentId == id);
                    }

                    if (model == null)
                    {
                        model = new Models.ClassSession
                        {
                            OwnerId = user.Id,
                        };

                        model.Name = appointment.Type;
                        model.StartDate = appointment.DateTime;
                        model.EndDate = model.StartDate.AddMinutes(appointment.Duration);

                        model.SessionDirectoryName = _GoogleHelper.SessionFolderName(model);
                        model.MasterStudentDirectoryName = _GoogleHelper.MasterStudentFolderName(model);

                        //This should only be one or the other!
                        model.AppointmentId = appointment.ClassID.HasValue ? (int?)null : id;
                        model.ClassId = appointment.ClassID ?? (int?)null;

                        var sessionDetails = await _GoogleHelper.CreateSessionDirectory(model);
                        model.BaseTutorDirectoryId = sessionDetails.BaseTutorFolder.Id;
                        model.BaseStudentDirectoryId = sessionDetails.BaseStudentFolder.Id;
                        model.MasterStudentDirectoryId = sessionDetails.MasterStudentFolder.Id;
                        model.SessionDirectoryId = sessionDetails.SessionFolder.Id;
                        model.SharedStudentDirectoryId = sessionDetails.SharedStudentFolder.Id;

                        model = await Create(model);
                    }

                    var formItem = appointment.Forms.Select(x => x.Values.FirstOrDefault(y => y.Name.Contains("Email"))).FirstOrDefault();

                    var student = await _UserManager.FindByEmailAsync(formItem != null ? formItem.Value : appointment.Email);

                    Models.User parent = null;
                    if (formItem != null && formItem.Value != appointment.Email)
                        parent = await _UserManager.FindByEmailAsync(appointment.Email);

                    //var data = new Models.SessionAttendee()
                    //{
                    //    ClassSessionId = model.ClassSessionId,
                    //    Email = formItem == null ? appointment.Email : formItem.Value,
                    //    EmailPurchasedBy = appointment.Email,
                    //    FirstName = student != null ? student.FirstName : appointment.FirstName,
                    //    LastName = student != null ? student.LastName : appointment.LastName,
                    //    UserId = student?.Id,
                    //    AppointmentId = id,
                    //    PurchasedById = formItem.Value != appointment.Email ? parent?.Id : student?.Id,
                    //    SessionAttendeeDirectoryName = student != null ? _GoogleHelper.StudentFolderName(student.FirstName, student.LastName, model) : _GoogleHelper.StudentFolderName(appointment.FirstName, appointment.LastName, model)
                    //};

                    //if (student != null)
                    //{
                    //    try
                    //    {
                    //        var sessionDetails = await _GoogleHelper.CreateSessionAttendeeDirectory(student, data, model);
                    //        data.SessionAttendeeDirectoryId = sessionDetails.StudentFolders.Count > 0 ? sessionDetails.StudentFolders.First().Id : null;
                    //    }
                    //    catch (Exception ex)
                    //    {
                    //        // User hasn't given the correct permissions - Directory creation will be attempted again on session start
                    //    }
                    //}

                    //await _UnitOfWork.Repository<Models.SessionAttendee>().Insert(data);

                    return model;
                }
                else
                {
                    throw new Exception("Appointment not found!");
                }
            }
            else
            {
                throw new Exception("Tutor or User not found!");
            }
        }


        private async Task<Models.ClassSession> Reschedule(int id, int calendarId, int appointmentTypeId)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.CalendarId == calendarId, includeProperties: "Users");
            var user = _UserManager.Users.FirstOrDefault(o => o.TutorId == tutor.TutorId);
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

            if (tutor != null && user != null)
            {
                var appointment = await _AcuitySchedulingHelper.GetAppointment(id);
                if (appointment != null)
                {
                    Models.ClassSession session = null;
                    if (appointment.ClassID.HasValue)
                    {
                        session = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassId == appointment.ClassID.Value);
                    }
                    else
                    {
                        session = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.AppointmentId == id);
                    }

                    if (session != null)
                    {
                        session.StartDate = appointment.DateTime;
                        session.EndDate = session.StartDate.AddMinutes(appointment.Duration);

                        return await Update(session);
                    }
                    else
                    {
                        throw new Exception("Session not found!");
                    }
                }
                else
                {
                    throw new Exception("Appointment not found!");
                }
            }
            else
            {
                throw new Exception("Tutor or User not found!");
            }
        }

        //private async Task<Models.ClassSession> Cancelled(int id, int calendarId, int appointmentTypeId)
        //{
        //    var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.CalendarId == calendarId, includeProperties: "Users");
        //    var user = _UserManager.Users.FirstOrDefault(o => o.TutorId == tutor.TutorId);
        //    var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

        //    if (tutor != null && user != null)
        //    {
        //        var appointment = await _AcuitySchedulingHelper.GetAppointment(id);
        //        if (appointment != null)
        //        {
        //            Models.ClassSession session = null;

        //            if (appointment.ClassID.HasValue)
        //            {
        //                session = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassId == appointment.ClassID.Value);
        //            }
        //            else
        //            {
        //                session = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.AppointmentId == id);
        //            }

        //            if (session != null)
        //            {
        //                if (session.ClassId.HasValue)
        //                {
        //                    var attendee = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.ClassSessionId == session.ClassSessionId && o.AppointmentId == id);

        //                    if (attendee != null)
        //                    {
        //                        attendee.IsDeleted = true;
        //                        await _UnitOfWork.Repository<Models.SessionAttendee>().Update(attendee);
        //                    }

        //                    return session;

        //                }
        //                else
        //                {
        //                    session.IsDeleted = true;
        //                    await _UnitOfWork.ExecuteRawSql("UPDATE SessionAttendees SET IsDeleted = 1 WHERE ClassSessionId = @p0", session.ClassSessionId);
        //                    return await Update(session);
        //                }
        //            }
        //            else
        //            {
        //                throw new Exception("Session not found!");
        //            }
        //        }
        //        else
        //        {
        //            throw new Exception("Appointment not found!");
        //        }
        //    }
        //    else
        //    {
        //        throw new Exception("Tutor or User not found!");
        //    }
        //}

        public async Task SendCompletionEmail(Guid id, string userId, DTO.ClassSessionComplete model)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            var session = await GetById(id);
            if (session.OwnerId != userId)
                throw new Exception("User is not the owner of this session");

            session.EmailContents = model.EmailContents;
            session.Complete = true;

            string blobContainer = $"classend-{id.ToString().ToLower()}";

            if (model.File != null)
            {
                var fileStream = model.File.OpenReadStream();
                fileStream.Position = 0;
                string position = await _AzureFileHelper.UploadBlob(fileStream, model.File.FileName, blobContainer);

                session.HasEmailAttachment = true;
            }

            await Update(session);

            var attachments = new List<SendGrid.Helpers.Mail.Attachment>();
            if (session.HasEmailAttachment)
            {
                var fileStream = model.File.OpenReadStream();
                string file = Convert.ToBase64String(_AzureFileHelper.ConvertToByteArray(fileStream));
                SendGrid.Helpers.Mail.Attachment attachment = new SendGrid.Helpers.Mail.Attachment()
                {
                    Filename = model.File.FileName,
                    Content = file,
                    Type = model.File.ContentType
                };

                attachments.Add(attachment);
            }

            var attended = session.SessionAttendees.Where(o => o.Attended && o.Removed == false && o.Refunded == false).Select(x => new SendGrid.Helpers.Mail.EmailAddress(x.Email)).ToList();

            if (attended.Count > 0)
            {
                foreach (var attendee in session.SessionAttendees.Where(o => o.Attended == true && o.Removed == false && o.Refunded == false))
                {
                    try
                    {
                        var dictionary = new Dictionary<string, string>()
                            {
                            { "{{siteUrl}}",  _AppSettings.StoreSiteUrl },
                            { "{{studentFullName}}", attendee.User.FirstName + " " + attendee.User.LastName},
                            { "{{message}}", string.IsNullOrWhiteSpace(session.EmailContents) ?
                                "Thank you for attending today's session! We hope to see you again soon." : session.EmailContents }
                            };

                        await Utilities.EmailUtilities.SendTemplateEmail(
                            settings.SendGridApi,
                            System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\SessionEnded.html"),
                            dictionary,
                            attendee.User.ContactEmail,
                            settings.SendGridFromEmail,
                            $"Session Complete: {session.Name}",
                            null,
                            null,
                            attachments: session.HasEmailAttachment ? attachments : null
                        );
                    }
                    catch (Exception ex)
                    {
                        string er = $"Message: {ex.Message} - Stack Trace {ex.StackTrace}";

                        if (ex.InnerException != null)
                        {
                            er += $"Inner Message: {ex.InnerException.Message} - Inner Stack Trace {ex.InnerException.StackTrace}";
                        }

                        try
                        {
                            await Utilities.EmailUtilities.SendEmail(settings.SendGridApi, "admin@2utoring.com", settings.SendGridFromEmail, $"Failed to Send Complete Email {session.ClassSessionId}", er, null, null, null);
                        }
                        catch (Exception exin)
                        {

                        }

                        // Not fussed if it errors - not critical
                    }
                }
            }
        }

        public async Task CopyFilesFromMasterToStudentFolders(Models.User user, Models.ClassSession session,
            IList<Models.SessionAttendee> activeAttendees)
        {
            if (!session.MasterFilesCopied && session.RequiresGoogleAccount == true)
            {
                var sessionAttendeesWithGoogle = new List<Models.SessionAttendee>();

                foreach (var sessionAttendee in activeAttendees)
                {
                    var existingLogins = await _UserManager.GetLoginsAsync(await _UnitOfWork.GetContext().Users
                        .FirstOrDefaultAsync(o => o.Id == sessionAttendee.UserId));
                    if (existingLogins.Any(o => o.LoginProvider == "Google"))
                    {
                        sessionAttendeesWithGoogle.Add(sessionAttendee);
                    }
                }

                var allUsersInSessionHaveGoogle = true;
                var tutorExistingLogins = await _UserManager.GetLoginsAsync(await _UnitOfWork.GetContext().Users
                    .FirstOrDefaultAsync(o => o.Id == session.OwnerId));
                if (tutorExistingLogins.Any(o => o.LoginProvider == "Google") == false)
                {
                    allUsersInSessionHaveGoogle = false;
                }

                if (!session.MasterFilesCopied && session.RequiresGoogleAccount == true &&
                    allUsersInSessionHaveGoogle == true)
                {
                    var details = await _GoogleHelper.CopyFilesFromMasterToStudentFolders(user, session, sessionAttendeesWithGoogle);
                    var folderDetails = details.Item2;
                    var attendeesToUpdate = details.Item1;
                    session.MasterFilesCopied = true;

                    if (folderDetails.SessionFolder != null &&
                        folderDetails.SessionFolder.Id != session.SessionDirectoryId)
                        session.SessionDirectoryId = folderDetails.SessionFolder.Id;
                    if (folderDetails.MasterStudentFolder != null &&
                        folderDetails.MasterStudentFolder.Id != session.MasterStudentDirectoryId)
                        session.MasterStudentDirectoryId = folderDetails.MasterStudentFolder.Id;
                    if (folderDetails.BaseStudentFolder != null &&
                        folderDetails.BaseStudentFolder.Id != session.BaseStudentDirectoryId)
                        session.BaseStudentDirectoryId = folderDetails.BaseStudentFolder.Id;
                    if (folderDetails.SharedStudentFolder != null &&
                        folderDetails.SharedStudentFolder.Id != session.SharedStudentDirectoryId)
                        session.SharedStudentDirectoryId = folderDetails.SharedStudentFolder.Id;
                    if (folderDetails.BaseTutorFolder != null &&
                        folderDetails.BaseTutorFolder.Id != session.BaseTutorDirectoryId)
                        session.BaseTutorDirectoryId = folderDetails.BaseTutorFolder.Id;

                    await _UnitOfWork.Repository<Models.ClassSession>().Update(session);

                    foreach (var attendeeToUpdate in attendeesToUpdate)
                        await _UnitOfWork.Repository<Models.SessionAttendee>().Update(attendeeToUpdate);
                }
            }
        }

        public async Task<Models.ClassSession> StartSession(Guid classSessionId, Models.User user)
        {
            
            Models.ClassSession classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(x => x.ClassSessionId == classSessionId && x.OwnerId == user.Id, includeProperties: "Course");
            

            if (classSession == null)
                return null;

            classSession.Started = true;
            classSession.StartedAtDate = DateTime.Now;
            //classSession.DueEndDate = classSession.StartedAtDate + (classSession.EndDate - classSession.StartDate);
            classSession.DueEndDate = classSession.StartedAtDate + ((classSession.EndDate - classSession.StartDate) - (classSession.StartedAtDate - classSession.StartDate));
            await _UnitOfWork.Repository<Models.ClassSession>().Update(classSession);

            #region Course Start
            if (classSession.Course != null)
            {
                Models.Course course = classSession.Course;
                if (course.Started == false)
                {
                    course.Started = true;
                    course.Completed = false;
                    course.Cancelled = false;
                    course.Published = false;
                    await _UnitOfWork.Repository<Models.Course>().Update(course);
                }
            }
            #endregion



            return classSession;
        }
        public async Task<string> CancelLesson(Guid id)
        {
            var session = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(x => x.ClassSessionId == id);
            if (session != null)
            {
                 if (session.Started == false && session.Cancel == false && DateTime.Now.ToUniversalTime() > session.StartDate.AddMinutes(15).UtcDateTime)
                {
                    session.Cancel = true;
                    await _UnitOfWork.Repository<Models.ClassSession>().Update(session);
                    return _AppSettings.StoreSiteUrl+ "/my/timetable";
                }
            }
            return null;

        }
        public async Task<bool> EndSession(Guid classSessionId, Models.User user)
        {
            Models.ClassSession classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(x => x.ClassSessionId == classSessionId && x.OwnerId == user.Id);

            if (classSession == null)
                return false;
            
            classSession.Ended = true;
            classSession.EndedAtDate = DateTime.Now;
            classSession.Complete = true;
            await _UnitOfWork.Repository<Models.ClassSession>().Update(classSession);

            #region Course End
                Models.Course course = await _UnitOfWork.Repository<Models.Course>().GetSingle(x => x.CourseId == classSession.CourseId, includeProperties: "ClassSessions");
                bool completed = course.ClassSessions.Any(x => x.Ended == false);
                if (completed==false)
                {
                    if (course.Completed == false)
                    {
                        course.Started = false;
                        course.Completed = true;
                        course.Cancelled = false;
                        course.Published = false;
                        await _UnitOfWork.Repository<Models.Course>().Update(course);
                    }
                }
           
            #endregion



            return true;
        }

        public async Task UpdateChatPermission(Guid classSessionId, bool chatActive)
        {
            string sql = "UPDATE ClassSessions " +
                "SET chatActive = " + (chatActive ? "1" : "0") + " " +
                "WHERE ClassSessionId = '" + classSessionId.ToString() + "'";

            await _UnitOfWork.ExecuteRawSql(sql);
        }

        public async Task<bool> GetAllChatPermission(Guid classSessionId)
        {
            var chatActive = await _UnitOfWork.Repository<Models.ClassSession>().GetQueryable(x => x.ClassSessionId == classSessionId)
                .Select(x => x.ChatActive)
                .FirstOrDefaultAsync();

            return chatActive;
        }

        public async Task<DTO.VideoRoomGroup> GetWebcamGroup(Guid groupId)
        {
            return await _UnitOfWork.Repository<Models.SessionGroup>()
                .GetQueryable(x => x.SessionGroupId == groupId)
                .Select(x => new DTO.VideoRoomGroup()
                {
                    Value = x.ClassSessionId.ToString() + "_" + x.SessionGroupId.ToString(),
                    Text = "Group_" + x.Name,
                    PermissionType = "Group",
                    IsIndividual = false
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<DTO.UserBasicCallInfo>> GetBasicUserCallInfo(Guid classSessionId, string fromUserId)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && !x.IsDeleted && x.UserId != fromUserId, includeProperties: "User")
                .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.UserBasicCallInfo>(x))
                .ToListAsync();
        }

        // TODO Uncomment if we need it
        //public async Task<List<SubscriptionFeature>> GetSubscriptionFeaturesForClassSession(Guid classSessionId)
        //{
        //    // var effectiveDate = DateTime.UtcNow;
        //    var classSession = await GetByIdWithTutor(classSessionId);
        //    if (classSession?.Owner?.TutorId == null) return null; // Session must have tutor, but we dont get features by Tutor, but check later if this is company or tutor based course session

        //    var subscriptionFeatureSet = await GetSubscriptionFeatureSetForClassSession(classSession.ClassSessionId);
        //    return subscriptionFeatureSet?.SubscriptionFeatures;
        //}

        //public async Task<SubscriptionFeatureSet> GetSubscriptionFeatureSetForClassSession(Guid classSessionId)
        //{
        //    // This call internally checks if this is company or tutor based course session
        //    var subscriptionFeatureSet = await _ClassSessionSubscriptionFeatureService.GetSubscriptionFeatureSetByClassSessionId(classSessionId);
        //    return subscriptionFeatureSet;
        //}

        public async Task<int> GetNumGroups(Guid classSessionId)
        {
                var classSession = await _UnitOfWork.Repository<Models.ClassSession>()
                    .GetQueryable(x => x.ClassSessionId == classSessionId,
                    includeProperties: "SessionGroups")
                    .AsNoTracking().FirstOrDefaultAsync();

            var sessionGroupCount = classSession.SessionGroups.Count(x => !x.IsDeleted);
            return sessionGroupCount;
        }

        #region WEBCAM

        public async Task<List<DTO.WebcamGroup>> GetWebcamGroups(Guid classSessionId, Models.User user, bool isTutor)
        {
            List<DTO.WebcamGroup> result = new List<DTO.WebcamGroup>();
            if (isTutor)
            {
                var classSession = await _UnitOfWork.Repository<Models.ClassSession>()
                    .GetQueryable(x => x.ClassSessionId == classSessionId && x.OwnerId == user.Id,
                    includeProperties: "SessionAttendees, SessionGroups")
                    .AsNoTracking().FirstOrDefaultAsync();
                if (classSession == null)
                    throw new Exception("User (" + user.Id + ") is not the owner of the session (" + classSessionId + ")");
                var sessionAttendees = classSession.SessionAttendees.Where(x => !x.IsDeleted && !x.Removed && !x.Refunded).OrderBy(x => x.FirstName);
                var sessionGroups = classSession.SessionGroups.Where(x => !x.IsDeleted).OrderBy(x => x.Name);

                // All
                result.Add(new DTO.WebcamGroup()
                {
                    Type = WebcamGroupType.All,
                    Rooms = new List<DTO.WebcamRoom>()
                    {
                        GetWebcamRoom(classSession, sessionAttendees, user, false)
                    }
                });
                // Groups
                result.Add(new DTO.WebcamGroup()
                {
                    Type = WebcamGroupType.Group,
                    Rooms = sessionGroups.Select(x => GetWebcamRoom(x, sessionAttendees, user, false)).ToList()
                });
                // Users
                result.Add(new DTO.WebcamGroup()
                {
                    Type = WebcamGroupType.Individual,
                    Rooms = sessionAttendees.Select(x => GetWebcamRoom(classSession.ClassSessionId, x, user, false)).ToList()
                });
            }
            else
            {
                var classSession = await _UnitOfWork.Repository<Models.ClassSession>()
                    .GetQueryable(x => x.ClassSessionId == classSessionId && x.SessionAttendees.Any(y => y.UserId == user.Id && !y.IsDeleted && !y.Removed && !y.Refunded),
                    includeProperties: "SessionAttendees, SessionGroups, Owner")
                    .AsNoTracking().FirstOrDefaultAsync();
                if (classSession == null)
                    throw new Exception("User (" + user.Id + ") is not an attendee of the session (" + classSessionId + ")");
                var sessionAttendees = classSession.SessionAttendees.Where(x => !x.IsDeleted && !x.Removed && !x.Refunded).OrderBy(x => x.FirstName);
                var thisAttendee = sessionAttendees.First(x => x.UserId == user.Id);
                var sessionGroups = classSession.SessionGroups.Where(x => thisAttendee.SessionGroupId == x.SessionGroupId && !x.IsDeleted).OrderBy(x => x.Name);

                // All
                result.Add(new DTO.WebcamGroup()
                {
                    Type = WebcamGroupType.All,
                    Rooms = new List<DTO.WebcamRoom>()
                    {
                        GetWebcamRoom(classSession, sessionAttendees, classSession.Owner, false)
                    }
                });
                // Groups
                result.Add(new DTO.WebcamGroup()
                {
                    Type = WebcamGroupType.Group,
                    Rooms = sessionGroups.Select(x => GetWebcamRoom(x, sessionAttendees, classSession.Owner, false)).ToList()
                });
                // Users
                result.Add(new DTO.WebcamGroup()
                {
                    Type = WebcamGroupType.Individual,
                    Rooms = sessionAttendees.Where(x => x.UserId != user.Id)
                        .Select(x => GetWebcamRoom(classSession.ClassSessionId, x, user, !thisAttendee.CallIndividualsEnabled))
                        .Prepend(GetWebcamRoom(classSession.ClassSessionId, classSession.Owner, user, !thisAttendee.CallIndividualsEnabled))
                        .ToList()
                });

            }
            return result;
        }
        private DTO.WebcamRoom GetWebcamRoom(Models.ClassSession classSession, IEnumerable<Models.SessionAttendee> sessionAttendees, Models.User tutorUser, bool hide)
        {
            var room = new DTO.WebcamRoom()
            {
                Text = "Whole Class",
                Value = classSession.ClassSessionId.ToString(),
                Identifier = classSession.ClassSessionId.ToString(),
                Type = WebcamGroupType.All,
                Hide = hide,
                Users = new List<DTO.WebcamGroupUser>()
                {
                    new DTO.WebcamGroupUser()
                    {
                        FirstName = tutorUser.FirstName,
                        LastName = tutorUser.LastName,
                        UserId = tutorUser.Id
                    }
                }
                .Concat(sessionAttendees.OrderBy(o => o.FirstName).ThenBy(o => o.LastName).Select(x => new DTO.WebcamGroupUser()
                {
                    UserId = x.UserId,
                    FirstName = x.FirstName,
                    LastName = x.LastName
                })).ToList()
            };

            return OrderUsers(room);
        }
        public DTO.WebcamRoom GetWebcamRoom(Models.SessionGroup sessionGroup, IEnumerable<Models.SessionAttendee> sessionAttendees, Models.User tutorUser, bool hide)
        {
            var room = new DTO.WebcamRoom()
            {
                Text = sessionGroup.Name,
                Value = GetGroupWebcamRoomValue(sessionGroup.ClassSessionId, sessionGroup.SessionGroupId),
                Identifier = sessionGroup.SessionGroupId.ToString(),
                Type = WebcamGroupType.Group,
                Hide = hide,
                Users = new List<DTO.WebcamGroupUser>()
                {
                    new DTO.WebcamGroupUser()
                    {
                        FirstName = tutorUser.FirstName,
                        LastName = tutorUser.LastName,
                        UserId = tutorUser.Id
                    }
                }
                .Concat(sessionAttendees.Where(x => sessionGroup.SessionGroupId == x.SessionGroupId).OrderBy(o => o.FirstName).ThenBy(o => o.LastName)
                .Select(x => new DTO.WebcamGroupUser()
                {
                    UserId = x.UserId,
                    FirstName = x.FirstName,
                    LastName = x.LastName
                })).ToList()
            };

            return OrderUsers(room);
        }
        private DTO.WebcamRoom GetWebcamRoom(Guid classSessionId, Models.SessionAttendee sessionAttendee, Models.User currentUser, bool hide)
        {
            var room = new DTO.WebcamRoom()
            {
                Text = sessionAttendee.FirstName + " " + sessionAttendee.LastName,
                Value = GetIndividualWebcamRoomValue(classSessionId, sessionAttendee.UserId, currentUser.Id),
                Identifier = sessionAttendee.UserId,
                Type = WebcamGroupType.Individual,
                Hide = hide,
                Users = new List<DTO.WebcamGroupUser>()
                {
                    new DTO.WebcamGroupUser()
                    {
                        FirstName = sessionAttendee.FirstName,
                        LastName = sessionAttendee.LastName,
                        UserId = sessionAttendee.UserId
                    },
                    new DTO.WebcamGroupUser()
                    {
                        FirstName = currentUser.FirstName,
                        LastName = currentUser.LastName,
                        UserId = currentUser.Id
                    }
                }
            };

            var classSession = _UnitOfWork.Repository<Models.ClassSession>().GetQueryable(x => x.ClassSessionId == classSessionId).AsNoTracking().FirstOrDefaultAsync().Result;
            room.Users = room.Users.OrderByDescending(o => o.UserId == classSession.OwnerId).ToList();

            return OrderUsers(room);
        }


        private DTO.WebcamRoom GetWebcamRoom(Guid classSessionId, Models.User tutorUser, Models.User currentUser, bool hide)
        {
            var room = new DTO.WebcamRoom()
            {
                Text = tutorUser.FirstName + " " + tutorUser.LastName,
                Value = GetIndividualWebcamRoomValue(classSessionId, tutorUser.Id, currentUser.Id),
                Identifier = tutorUser.Id,
                Type = WebcamGroupType.Individual,
                Hide = hide,
                Users = new List<DTO.WebcamGroupUser>()
                {
                    new DTO.WebcamGroupUser()
                    {
                        FirstName = tutorUser.FirstName,
                        LastName = tutorUser.LastName,
                        UserId = tutorUser.Id
                    },
                    new DTO.WebcamGroupUser()
                    {
                        FirstName = currentUser.FirstName,
                        LastName = currentUser.LastName,
                        UserId = currentUser.Id
                    }
                }
            };

            return OrderUsers(room);
        }

        private DTO.WebcamRoom OrderUsers(DTO.WebcamRoom room)
        {
            int counter = 0;

            room.Users.ForEach(o =>
            {
                o.OriginalPosition = counter;
                o.Position = counter;
                counter++;
            });

            return room;
        }

        // Naming convention for groups as follows:
        // All: {classSessionId}
        // Group: {classSessionId}_{sessionGroupId}
        // Individual: {classSessionId}_{userId1}_{userId2} where the order of userId's is determined alphabetically
        // This allows for all users to generate the same room values on the fly
        public string GetGroupWebcamRoomValue(Guid classSessionId, Guid sessionGroupId)
        {
            return classSessionId.ToString() + "_" + sessionGroupId.ToString();
        }
        public string GetIndividualWebcamRoomValue(Guid classSessionId, string userId1, string userId2)
        {
            return classSessionId.ToString() + "_" + string.Join('_', (new string[] { userId1, userId2 }).OrderBy(x => x));
        }

        #endregion WEBCAM
    }
}

