using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Http;
using StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ITutorService : IDisposable
    {
        Task<List<Models.Tutor>> GetTutorList();
        Task<DTO.Tutor> GetTutorAvailabilities(Guid tutorId);
        Task<Models.Tutor> GetById(Guid id);
        Task<Models.Tutor> GetById(Guid id, string includes);
        Task<Models.Tutor> GetByUrlSlug(string urlSlug);
        Task<Models.Tutor> GetMyForTutorAuth();
        Task<Models.Tutor> UpdateInitialRegisterStep(Guid id, int step);
        Task<Guid> SaveBasicInfo(DTO.TutorRegister.TutorRegisterBasicInfo model);
        Task<DTO.TutorRegister.TutorRegisterPayment> SavePayment(DTO.TutorRegister.TutorRegisterPayment model);
        Task<DTO.TutorRegister.TutorRegisterBankDetails> SaveBankDetails(DTO.TutorRegister.TutorRegisterBankDetails model);
        Task<Models.Tutor> SetTutorUrlSlug(Guid id);
        Task<DTO.TutorRegister.TutorRegisterPayment> UpdatePayment(DTO.TutorRegister.TutorRegisterPayment model);
        Task SaveDbsCheck(DTO.TutorRegister.TutorRegisterDbsCheck model);
        Task SaveProfile(DTO.TutorRegister.TutorRegisterProfile model);
        Task SaveProfileOne(DTO.TutorRegister.TutorRegisterProfileOne model);
        Task SaveProfileTwo(DTO.TutorRegister.TutorRegisterProfileTwo model);
        Task ProfileUpload(Guid tutorId, IFormFile file);
        Task<DTO.PagedList<DTO.PagedTutor>> GetPaged(DTO.TutorSearchModel model,string role,Guid? companyId);
        Task<Models.Tutor> Update(Models.Tutor tutor);
        Task ApproveProfile(Guid id);
        Task RejectProfile(Guid id);
        Task ApproveDBS(Guid id);
        Task RejectDBS(Guid id);
        Task<List<Models.Tutor>> GetEligibleTutorsForPayout();
        Task MarkProfileAuthorizedMessageRead(Guid id);
        Task MarkDbsAdminApprovedMessageRead(Guid id);
        Task DBSUpload(Guid tutorId, IFormFile file);
        Task<Models.Tutor> CheckTutorStripe(Guid tutorId);
        Task Cancel(Guid tutorId, DTO.TutorCancel model);
        Task CancelByCompany(Guid tutorId, Models.Company company, DTO.TutorCancel model);
        Task<byte[]> GetDbsFile(Guid tutorId);
        Task MarkLinkAccountMessageRead(Guid id);
        Task Delete(Guid id);

        Task InviteTutor(Guid companyId,string name, string[] emailIds);
        Task<DTO.Company> GetCurrentCompany(Models.User user);
        Task<DTO.Company> GetTutorCompany(Guid TutorId);
        Task<Models.CompanyTutor> GetCurrentCompanyTutor(Guid? tutorId);

        Task<Models.Subscription> GetActiveSubscription(Guid tutorId);
        Task<ClassSessionFeatures> GetSubscriptionFeatureSet(Guid tutorId);
        Task UpdateTutorSubscriptioPlan(DTO.TutorSubcriptionPlan model);
        Task<List<DTO.BookedSlot>> GetBookedSlot(Guid tutorId);
        Task<DTO.Tutor> GetTutorProfile(Guid tutorId);
        Task<bool> UpdateIdVerificationStauts(Guid tutorId, bool status);
        Task<List<DTO.TutorCertificate>> GetDBSCirtificates(Guid tutorId);
        Task<List<DTO.TutorCertificate>> GetTutorAllCirtificates(Guid tutorId);

    }
}
