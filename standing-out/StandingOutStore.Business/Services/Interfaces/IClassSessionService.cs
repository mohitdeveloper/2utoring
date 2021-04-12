using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Data.Models;
using StandingOut.Data.Enums;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IClassSessionService : IDisposable
    {
        Task<DTO.PagedList<DTO.LessonCard>> GetPagedCards(DTO.LessonSearch model);
        Task<DTO.LessonCard> GetCard(Guid classSessionId);
        Task<DTO.CardSet> GetCardSet(Guid classSessionId);
        Task<List<DTO.SafeguardingClassSessionOption>> GetSafegaurdingOptions(Models.User user);
        Task<List<DTO.LessonTimetableDay>> GetStudentTimetable(Models.User user, int timeOffset, int weekOffset);
        Task<List<DTO.LessonTimetableDay>> GetTutorTimetable(Models.User user, int timeOffset, int weekOffset,int minutesBeforeEntry);
        Task<DTO.PagedList<DTO.ClassSession>> GetPaged(DTO.SearchModel model, string includes, string ownerId = null, Guid? companyId=null, bool excludeFutureLessons = false);
        Task<Models.ClassSession> GetById(Guid id);
        Task<Models.ClassSession> GetById(Guid id, string includes);
        Task<Models.ClassSession> Create(Models.ClassSession model);
        Task<Models.ClassSession> CreateMain(Models.ClassSession model);
        Task<Models.ClassSession> Update(Models.ClassSession model);
        Task<Models.ClassSession> UpdateMain(Models.ClassSession model);
        Task Delete(Guid id);
        //Task<DTO.PagedList<DTO.ClassSession>> GetPagedForCompany(DTO.SearchModel model, string includes, Guid companyId);
        Task<Models.SessionAttendee> Enrol(User user, Guid classSessionId, Order newOrder);
        Task<bool> CreateVendorEarnings(ClassSession session, VendorType vendorType, List<SessionAttendee> attendees);
        Task<string> CancelLesson(Guid id);
    }
}
