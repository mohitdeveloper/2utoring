using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ICompanySubjectService : IDisposable
    {
        Task<Models.CompanySubject> GetByCompanyAndSubject(Guid companyId, Guid SubjectId);
        Task<List<Models.CompanySubject>> GetByCompany(Guid id);
        Task<List<string>> GetByCompanyForProfile(Guid id);
        Task<Models.CompanySubject> CreateIfNotExists(Models.CompanySubject model);

        Task<Models.CompanySubject> Create(Models.CompanySubject model);
        Task<Models.CompanySubject> Update(Models.CompanySubject model);
        Task Delete(Guid id);
    }
}
