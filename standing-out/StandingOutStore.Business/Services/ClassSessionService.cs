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
using StandingOut.Data.Models;

namespace StandingOutStore.Business.Services
{
    public class ClassSessionService : IClassSessionService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IGoogleHelper _GoogleHelper;
        private readonly ISessionAttendeeService _SessionAttendeeService;

        private bool _Disposed;

        public ClassSessionService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager, IGoogleHelper googleHelper, ISessionAttendeeService sessionAttendeeService)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _GoogleHelper = googleHelper;
            _SessionAttendeeService = sessionAttendeeService;
        }

        public ClassSessionService(IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings.Value;
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

        public async Task<DTO.PagedList<DTO.LessonCard>> GetPagedCards(DTO.LessonSearch model)
        {
            var query = _UnitOfWork.Repository<Models.ClassSession>()
                .GetQueryable(x => x.IsUnder16 == model.IsUnder16 && !x.Owner.IsDeleted &&
                                (x.Owner.Tutor.ProfileApprovalStatus == TutorApprovalStatus.Approved
                                    ||
                                 x.Owner.Tutor.ProfileApprovalStatus == TutorApprovalStatus.NotRequired)
                && x.Type == ClassSessionType.Public,
                includeProperties: "Subject, SubjectCategory, StudyLevel, Owner, Owner.Tutor, Owner.Tutor.TutorSubjects, Owner.Tutor.TutorSubjects.Subject, SessionAttendees")
                .AsNoTracking();

            query = query.Where(x => x.StartDate.UtcDateTime > DateTime.UtcNow.AddHours(1));
            if (!string.IsNullOrWhiteSpace(model.Subject))
                query = query.Where(x => x.Subject.Url.ToLower().Trim() == model.Subject.ToLower().Trim());
            if (!string.IsNullOrWhiteSpace(model.SubjectCategory))
                query = query.Where(x => x.SubjectCategory.Url.ToLower().Trim() == model.SubjectCategory.ToLower().Trim());
            if (!string.IsNullOrWhiteSpace(model.StudyLevelUrl))
                query = query.Where(x => x.StudyLevel.Url == model.StudyLevelUrl.ToLower().Trim());

            if (!string.IsNullOrWhiteSpace(model.Search))
                query = query.Where(x => x.Name.Contains(model.Search) ||
                    ((string.IsNullOrEmpty(x.Owner.Title) ? "" : (x.Owner.Title + ". ")) + x.Owner.FirstName + " " + x.Owner.LastName).Contains(model.Search));


            var result = new DTO.PagedList<DTO.LessonCard>();
            result.Paged.TotalCount = await query.CountAsync();
            result.Paged.Take = model.Take;
            result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            result.Paged.Page = result.Paged.TotalPages < model.Page ? 1 : model.Page;
            result.Data = await query.Select(x => Mapping.Mappings.Mapper.Map<Models.ClassSession, DTO.LessonCard>(x))
                .OrderBy(x => x.SessionDate)
                .Skip((result.Paged.Page - 1) * result.Paged.Take)
                .Take(result.Paged.Take)
                .ToListAsync();
            return result;
        }

        public async Task<DTO.LessonCard> GetCard(Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.ClassSession>()
                .GetQueryable(x => x.ClassSessionId == classSessionId && !x.Owner.IsDeleted &&
                (x.Owner.Tutor.ProfileApprovalStatus == TutorApprovalStatus.Approved
                ||
                x.Owner.Tutor.ProfileApprovalStatus == TutorApprovalStatus.NotRequired)
                    , includeProperties: "Subject, SubjectCategory, StudyLevel, Owner, Owner.Tutor, Owner.Tutor.TutorSubjects, Owner.Tutor.TutorSubjects.Subject, SessionAttendees")
                .AsNoTracking()
                .Select(x => Mapping.Mappings.Mapper.Map<Models.ClassSession, DTO.LessonCard>(x))
                .FirstOrDefaultAsync();
        }

        public async Task<DTO.CardSet> GetCardSet(Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.ClassSession>()
                .GetQueryable(x => x.ClassSessionId == classSessionId && !x.Owner.IsDeleted &&
                (x.Owner.Tutor.ProfileApprovalStatus == TutorApprovalStatus.Approved
                ||
                x.Owner.Tutor.ProfileApprovalStatus == TutorApprovalStatus.NotRequired),
                includeProperties: "Subject, SubjectCategory, StudyLevel, Owner, Owner.Tutor, Owner.Tutor.TutorQualifications, Owner.Tutor.TutorSubjects, Owner.Tutor.TutorSubjects.Subject, SessionAttendees")
                .AsNoTracking()
                .Select(x => new DTO.CardSet()
                {
                    Lesson = Mapping.Mappings.Mapper.Map<Models.ClassSession, DTO.LessonCard>(x),
                    Tutor = Mapping.Mappings.Mapper.Map<Models.User, DTO.TutorCard>(x.Owner)
                }).FirstOrDefaultAsync();
        }

        public async Task<List<DTO.SafeguardingClassSessionOption>> GetSafegaurdingOptions(Models.User user)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>()
                .GetQueryable(x => x.UserId == user.Id, includeProperties: "ClassSession")
                .AsNoTracking()
                .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.SafeguardingClassSessionOption>(x))
                .OrderByDescending(x => x.StartDate)
                .Take(30)
                .ToListAsync();
        }

        private (DateTimeOffset, DateTimeOffset) GetTimetableDateBoundaries(int timeOffset, int weekOffset)
        {
            var fromDate = DateTimeOffset.UtcNow.AddDays(7 * weekOffset).ToOffset(new TimeSpan(0, timeOffset, 0));
            fromDate = fromDate.AddHours(-1 * fromDate.Hour).AddMinutes(-1 * fromDate.Minute).AddSeconds(-1 * fromDate.Second).AddMilliseconds(-1 * fromDate.Millisecond);
            if (fromDate.DayOfWeek == DayOfWeek.Sunday)
                fromDate = fromDate.AddDays(-6); // Separate case required for sunday (as enum is 0-Sunday -> 6-Saturday i.e. is on the American week)
            else
            {
                var days = (int)DayOfWeek.Monday - (int)fromDate.DayOfWeek;
                fromDate = fromDate.AddDays(days);
            }
            // fromDate = fromDate.AddDays((int)DayOfWeek.Monday - (int)fromDate.DayOfWeek);
            var actualFromDate = fromDate.ToUniversalTime();
            var actualToDate = actualFromDate.AddDays(7);
            return (actualFromDate, actualToDate);
        }

        private List<DTO.LessonTimetableDay> GroupTimetableResults(List<DTO.LessonTimetableLesson> lessons, DateTimeOffset actualFromDate)
        {
            // Sorts the list into days -> Ensures there's a day even if there are no lessons on it
            List<DTO.LessonTimetableDay> result = new List<DTO.LessonTimetableDay>();

            int skipIterator = 0;
            for (int i = 0; i < 7; i++)
            {
                result.Add(new DTO.LessonTimetableDay() { Date = actualFromDate.AddDays(i) });
                var dateTo = actualFromDate.AddDays(i + 1);
                for (var j = skipIterator; j < lessons.Count; j++)
                {
                    if (lessons[skipIterator].StartDate < dateTo)
                    {
                        result[i].Lessons.Add(lessons[skipIterator]);
                        skipIterator = j + 1;
                    }
                    else
                    {
                        break;
                    }
                }
            }
            return result;
        }

        public async Task<List<DTO.LessonTimetableDay>> GetStudentTimetable(Models.User user, int timeOffset, int weekOffset)
        {
            DateTimeOffset actualFromDate;
            DateTimeOffset actualToDate;
            (actualFromDate, actualToDate) = GetTimetableDateBoundaries(timeOffset, weekOffset);
            List<DTO.LessonTimetableLesson> lessons = await _UnitOfWork.Repository<Models.SessionAttendee>()
                .GetQueryable(x => x.UserId == user.Id && x.ClassSession.StartDate >= actualFromDate && x.ClassSession.StartDate < actualToDate && !x.Removed && !x.Refunded
                    , includeProperties: "ClassSession")
                .AsNoTracking()
                .Select(x => Mapping.Mappings.Mapper.Map<Models.SessionAttendee, DTO.LessonTimetableLesson>(x))
                .OrderBy(x => x.StartDate)
                .ToListAsync();

            lessons.ForEach(o =>
            {
                o.CanStart = o.StartDate < DateTime.UtcNow.AddMinutes(5);
                o.AttendeeCount = 999;
            });

            foreach (var item in lessons)
            {
                var sessions = await _UnitOfWork.Repository<Models.ClassSession>()
             .GetSingle(x => x.ClassSessionId == item.ClassSessionId, includeProperties: "Course");
                
                if(sessions!=null)
                {
                    var tutorId = sessions.Course.TutorId;
                    if (tutorId != null)
                    {
                        var tutorsubscription = await _UnitOfWork.Repository<Models.TutorSubscription>().GetSingle(x => x.TutorId == tutorId && x.IsDeleted==false, includeProperties: "Subscription");
                        if (tutorsubscription != null)
                        {
                            if (tutorsubscription.Subscription.SubscriptionName == "NoFeeTutorPlan" && tutorsubscription.Subscription.SubscriptionPrice==0)
                            {
                                item.IsBasicTutor = true;
                            }
                            else
                            {
                                item.IsBasicTutor = false;
                            }
                        }
                    }

                }
            }

            return GroupTimetableResults(lessons.OrderBy(x => x.StartDate).ToList(), actualFromDate);
        }

        public async Task<List<DTO.LessonTimetableDay>> GetTutorTimetable(Models.User user, int timeOffset, int weekOffset, int minutesBeforeEntry)
        {
            DateTimeOffset actualFromDate;
            DateTimeOffset actualToDate;
            (actualFromDate, actualToDate) = GetTimetableDateBoundaries(timeOffset, weekOffset);

            var sessions = await _UnitOfWork.Repository<Models.ClassSession>()
                .Get(x => x.OwnerId == user.Id && x.StartDate >= actualFromDate && x.StartDate < actualToDate, includeProperties: "SessionAttendees");
            List<DTO.LessonTimetableLesson> lessons = sessions.Select(x => Mapping.Mappings.Mapper.Map<Models.ClassSession, DTO.LessonTimetableLesson>(x))
                .OrderBy(x => x.StartDate)
                .ToList();
            if (minutesBeforeEntry > 0)
            {
                lessons.ForEach(o => { o.CanStart = o.StartDate < DateTime.UtcNow.AddMinutes(minutesBeforeEntry); });
            }
            else
            {
                lessons.ForEach(o => { o.CanStart = o.StartDate < DateTime.UtcNow.AddMinutes(30); });
            }


            return GroupTimetableResults(lessons, actualFromDate);
        }

        public async Task<DTO.PagedList<DTO.ClassSession>> GetPaged(DTO.SearchModel model, string includes, string ownerId = null, Guid? companyId = null,
            bool excludeFutureLessons = false)
        {

            IQueryable<Models.ClassSession> data = _UnitOfWork.Repository<Models.ClassSession>().GetQueryable(includeProperties: includes);
            if (excludeFutureLessons)
                data = data.Where(o => o.StartDate <= DateTime.UtcNow);

            if (!string.IsNullOrWhiteSpace(ownerId))
            {
                data = data.Where(o => o.OwnerId == ownerId);
            }

            if (companyId != null && companyId != Guid.Empty)
            {
                data = data.Where(o => o.Course != null && o.Course.CompanyId == companyId);
            }

            // Search session name, subject, level, tutorname columns
            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => (o.Name != null && o.Name.ToLower().Contains(search))
                || (o.Course.Name != null && o.Course.Name.ToLower().Contains(search))
                || (o.Subject.Name.ToLower().Contains(search))
                || (o.StudyLevel.Name.ToLower().Contains(search))
                || (o.Course != null && o.Course.Tutor != null && o.Course.Tutor.Name.ToLower().Contains(search))
                );
                //data = data.Where(o => (o.Name != null && o.Name.ToLower().Contains(search)|| o.Owner.FullName.ToLower().Contains(search)|| o.Owner.Email.ToLower().Contains(search)));
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
                    data = data.Where(o => o.StartDate >= DateTime.Now.AddHours(-1));
                }
                else if (model.Filter == "previous")
                {
                    data = data.Where(o => o.StartDate <= DateTime.Now.AddHours(-1));
                }
            }

            var result = new DTO.PagedList<DTO.ClassSession>();

            System.Reflection.PropertyInfo prop = typeof(Models.ClassSession).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {

                if (model.SortType == "CourseName")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.Course.Name) : data.OrderByDescending(o => o.Course.Name);
                }
                if (model.SortType == "SubjectName")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.Subject.Name) : data.OrderByDescending(o => o.Subject.Name);
                }
                else if (model.SortType == "StudyLevelName")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.StudyLevel.Name) : data.OrderByDescending(o => o.StudyLevel.Name);
                }
                else if (model.SortType == "SessionAttendeesCount")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.SessionAttendees.Count()) : data.OrderByDescending(o => o.SessionAttendees.Count);
                }
                else if (model.SortType == "Status")
                {
                    data = model.Order == "ASC" ?
                        data.OrderBy(o => o.VendorEarnings.Count() + o.VendorEarnings.Count(ve => ve.VendorPayoutId.HasValue || ve.PaymentProviderFieldSetId.HasValue)) :
                        data.OrderByDescending(o => o.VendorEarnings.Count() + o.VendorEarnings.Count(ve => ve.VendorPayoutId.HasValue || ve.PaymentProviderFieldSetId.HasValue));
                }
                else if (model.SortType == "TutorEarnings" || model.SortType == "StudentFees")
                {
                    data = model.Order == "ASC" ? data.OrderBy(o => o.SessionAttendees.Sum(x => x.AmountCharged)) : data.OrderByDescending(o => o.SessionAttendees.Sum(x => x.AmountCharged));
                }
            }

            var temp = data.ToList();


            result.Data = Mapping.Mappings.Mapper.Map<List<Models.ClassSession>, List<DTO.ClassSession>>(await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;

            return result;
        }
        public async Task<Models.ClassSession> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == id, includeProperties: "Course, Owner,SessionAttendees");
        }

        public async Task<Models.ClassSession> GetById(Guid id, string includes)
        {
            return await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == id, includeProperties: includes);
        }

        public async Task<Models.ClassSession> Create(Models.ClassSession model)
        {
            if (model.RequiresGoogleAccount == true)
            {
                model.SessionDirectoryName = _GoogleHelper.SessionFolderName(model);
                model.MasterStudentDirectoryName = _GoogleHelper.MasterStudentFolderName(model);
                var sessionDetails = await _GoogleHelper.CreateSessionDirectory(model);
                model.BaseTutorDirectoryId = sessionDetails.BaseTutorFolder.Id;
                model.BaseStudentDirectoryId = sessionDetails.BaseStudentFolder.Id;
                model.MasterStudentDirectoryId = sessionDetails.MasterStudentFolder.Id;
                model.SessionDirectoryId = sessionDetails.SessionFolder.Id;
                model.SharedStudentDirectoryId = sessionDetails.SharedStudentFolder.Id;
            }

            await _UnitOfWork.Repository<Models.ClassSession>().Insert(model);

            return model;
        }

        public async Task<Models.ClassSession> CreateMain(Models.ClassSession model)
        {
            model.ChatActive = true;
            var dbClassSession = await Create(model);

            if (dbClassSession.ScheduleType.HasValue && dbClassSession.ScheduleType != ClassSessionScheduleType.Never && dbClassSession.ScheduleEndDate.HasValue)
            {
                var startDate = dbClassSession.StartDate;
                var incAmount = 1;
                if (dbClassSession.ScheduleType == ClassSessionScheduleType.EveryDay)
                {
                    incAmount = 1;
                }
                else if (dbClassSession.ScheduleType == ClassSessionScheduleType.EveryWeek)
                {
                    incAmount = 7;
                }
                else if (dbClassSession.ScheduleType == ClassSessionScheduleType.EveryTwoWeeks)
                {
                    incAmount = 14;
                }
                else if (dbClassSession.ScheduleType == ClassSessionScheduleType.EveryFourWeeks)
                {
                    incAmount = 28;
                }

                int counter = 0;
                while (startDate < dbClassSession.ScheduleEndDate && startDate < dbClassSession.StartDate.AddMonths(2))
                {
                    counter++;
                    startDate = startDate.AddDays(incAmount);

                    var mappedClassSession = Mappings.Mapper.Map<Models.ClassSession, Models.ClassSession>(dbClassSession);
                    mappedClassSession.Name = mappedClassSession.Name;
                    mappedClassSession.StartDate = startDate;
                    mappedClassSession.EndDate = startDate.AddMinutes(dbClassSession.Duration);
                    await Create(mappedClassSession);
                }
            }

            return model;
        }

        public async Task<Models.ClassSession> Update(Models.ClassSession model)
        {
            await _UnitOfWork.Repository<Models.ClassSession>().Update(model);
            return model;
        }

        public async Task<Models.ClassSession> UpdateMain(Models.ClassSession model)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == model.ClassSessionId);

            classSession.RequiresGoogleAccount = model.RequiresGoogleAccount;
            classSession.Name = model.Name;
            classSession.SubjectId = model.SubjectId;
            classSession.SubjectCategoryId = model.SubjectCategoryId;
            classSession.StudyLevelId = model.StudyLevelId;
            classSession.MaxPersons = model.MaxPersons;
            classSession.IsUnder16 = model.IsUnder16;
            classSession.Type = model.Type;
            classSession.LessonDescriptionBody = model.LessonDescriptionBody;
            classSession.StartDate = model.StartDate;
            classSession.EndDate = model.EndDate;
            classSession.ScheduleType = model.ScheduleType;
            classSession.ScheduleEndDate = model.ScheduleEndDate;
            classSession.PricePerPerson = model.PricePerPerson;

            await Update(classSession);
            return classSession;
        }

        public async Task<Models.SessionAttendee> Enrol(User user, Guid classSessionId, Order newOrder)
        {
            var classSession = await GetById(classSessionId);
            if (classSession!=null && classSession.MaxPersons > classSession.SessionAttendees.Count(x => !x.Refunded && !x.Removed && !x.IsDeleted))
            {
                var newAttendee = new SessionAttendee
                {
                    OrderId = newOrder.OrderId,
                    OrderItemId = newOrder.OrderItems.FirstOrDefault(x => x.CourseId == classSession.CourseId).OrderItemId,

                    ClassSessionId = classSessionId,
                    AmountCharged = classSession.PricePerPerson,

                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserId = user.Id,
                    SessionAttendeeDirectoryName = $"{SessionAttendeeService.CapitalizeAndSlugify(user.FirstName)} {SessionAttendeeService.CapitalizeAndSlugify(user.LastName)}, {SessionAttendeeService.CapitalizeAndSlugify(classSession.Name)}, {classSession.StartDate.ToString("h tt, dd-MM-y").ToLower()}",
                };
                classSession.SessionAttendees.Add(newAttendee);
                var classSessionUpdated = await Update(classSession);
                return newAttendee;
            }
            return null;
        }

        /// <summary>
        /// Should have updated SessionAttendee record with SOCut and VendorEarnings as per TieredCommission
        ///  Creates VendorEarning record per Order of that lesson.
        /// </summary>
        /// <param name="classSession"></param>
        /// <param name="attendees"></param>
        /// <returns></returns>
        public async Task<bool> CreateVendorEarnings(ClassSession classSession, VendorType vendorType, List<SessionAttendee> attendees)
        {
            // Attendees could be from diff orders for same lesson, so group by order
            var attendeesByOrder = attendees.GroupBy(x => x.OrderId.Value);
            foreach (var order in attendeesByOrder)
            {
                var orderId = order.Key;
                var attendeesForThisOrder = order.ToList();
                if (!attendeesForThisOrder.Any()) continue;

                // Create earning record even if 0 value..
                var orderAttendeesAmount = attendeesForThisOrder.Sum(x => x.VendorAmount ?? 0);

                var earningRecord = new VendorEarning
                {
                    OrderId = orderId,
                    ClassSessionId = classSession.ClassSessionId,
                    EarningAmount = orderAttendeesAmount,
                };
                if (vendorType == VendorType.Tutor) earningRecord.TutorId = classSession.OwnerVendorId;
                else earningRecord.CompanyId = classSession.OwnerVendorId;

                var inserted = await _UnitOfWork.Repository<VendorEarning>().Insert(earningRecord);
                foreach (var attendee in attendeesForThisOrder)
                {
                    attendee.VendorEarningId = earningRecord.VendorEarningId;
                    await _UnitOfWork.Repository<SessionAttendee>().Update(attendee);
                    //TransferVendorEarning()
                }
            };
            return true;
        }

        public async Task Delete(Guid id)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == id);

            classSession.IsDeleted = true;
            await Update(classSession);
        }

        public async Task<string> CancelLesson(Guid id)
        {
            var session = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(x => x.ClassSessionId == id);
            if (session != null)
            {
                if (session.Started==true && session.Complete==false && session.EndDate.ToUniversalTime() < DateTime.Now.ToUniversalTime())
                {
                    session.Complete = true;
                    session.Ended = true;
                    session.EndedAtDate = session.EndDate;
                    await _UnitOfWork.Repository<Models.ClassSession>().Update(session);
                    return "Completed";
                }
                else if (session.Started==false && session.Cancel==false && DateTime.Now.ToUniversalTime() > session.StartDate.AddMinutes(15).UtcDateTime)
                {
                    session.Cancel = true;
                    await _UnitOfWork.Repository<Models.ClassSession>().Update(session);
                    return "Cancelled";
                }
            }
            return null;

        }
    }
}

