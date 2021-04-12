using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Data.Models;
using StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISessionAttendeeService : IDisposable
    {
        Task<DTO.PagedList<DTO.SessionAttendee>> GetPaged(DTO.SearchModel model, Guid? classSessionId = null);
        Task<List<DTO.StudentSession>> GetStudentSessions(string id, string tutorUserId, Guid? companyId = null);
        Task<List<Models.SessionAttendee>> GetUniqueByOwner(string id, Guid couresId);
        Task<Models.SessionAttendee> Create(DTO.PaymentResponse payment, Models.User user, decimal standingOutCut);
        Task Remove(Guid classSessionId, Guid sessionAttendeeId, bool sendEmail = true);
        Task UndoRemove(Guid classSessionId, Guid sessionAttendeeId);
        Task<bool> Refund(Guid classSessionId, Guid sessionAttendeeId, bool studentInitiated = false);
        //Task<List<Models.SessionAttendee>> GetAttendeesAwaitingPaymentTransfer(Guid tutorId, DateTimeOffset endDateFilter, DateTimeOffset paymentDateFilter);
        Task UpdateSessionAttendeeTransferDetails(Guid id, string payoutId, int status, string error);
        Task<int> GetSessionAttendeesCountByUser(string id);
        Task<List<DTO.SessionAttendeeFileUploader>> GetForFileUpload(Guid classSessionId);
        Task<List<Models.SessionAttendee>> GetByClassSession(Guid classSessionId);
        Task<int> GetAttendeesCountInLast30Days(Guid tutorId, Guid classSessionIdToExclude);
        Task<decimal> CalcStandingOutCut(Models.ClassSession classSession, Guid tutorId, List<CommissionPerStudentTier> commissionPerStudentTiers);
        //Task UpdateStandingOutCut(List<Models.SessionAttendee> sessionAttendees, decimal commissionPerStudent);
        Task UpdateStandingOutCut(Models.ClassSession classSession, Guid tutorId, List<Models.SessionAttendee> sessionAttendees, List<CommissionPerStudentTier> commissionPerStudentTiers);
        
        Task RefundInitiated();
    }
}

