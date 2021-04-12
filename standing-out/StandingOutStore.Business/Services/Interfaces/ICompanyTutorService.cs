using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Http;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ICompanyTutorService : IDisposable
    {
        Task<Models.CompanyTutor> Create(Models.CompanyTutor model);
        Task<List<Models.Tutor>> GetTutorByCompany(Guid companyId);
        Task<List<Models.Tutor>> GetCompanyTutorBySubject(Guid companyId, Guid subjectId, Guid levelId);
        Task<Models.CompanyTutor> GetCompanyByTutor(Guid tutorId);
        Task<Models.CompanyTutor> GetTutorCompany(Guid tutorId);
        Task<List<Models.Tutor>> GetTutorsByCompanySubjectAndLevel(Guid companyId, Guid subjectId, Guid levelId);
        Task<List<DTO.TutorDDL>> GetTutorByAvailability(Guid companyId, DTO.CTutorAvailability model);
        Task<DTO.Tutor> GetTutorDetail(Guid companyId, Guid TutorId);
        Task<List<DTO.Subject>> GetCompanyTutorSubject(Guid companyId);
        Task<List<DTO.StudyLevel>> GetCompanyTutorsLevelBySubject(Guid companyId, Guid subjectId);


    }
}
