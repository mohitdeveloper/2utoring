using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ICompanySubjectStudyLevelService : IDisposable
    {
        Task<List<Models.CompanySubjectStudyLevel>> GetByCompany(Guid id);
        Task<List<string>> GetByCompanyForProfile(Guid id);

        Task<Models.CompanySubjectStudyLevel> GetByCompanySubjectStudyLevel(Models.CompanySubject modelCompanySubject,
            Guid modelStudyLevelId);
        Task<Models.CompanySubjectStudyLevel> Create(Models.CompanySubjectStudyLevel model);
        Task<Models.CompanySubjectStudyLevel> CreateIfNotExists(Models.CompanySubjectStudyLevel model);
        Task<Models.CompanySubjectStudyLevel> Update(Models.CompanySubjectStudyLevel model);
        Task Delete(Guid id);
    }
}
