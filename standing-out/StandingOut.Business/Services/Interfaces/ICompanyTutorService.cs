using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ICompanyTutorService : IDisposable
    {
        Task<List<Models.CompanyTutor>> Get();
        Task<List<Models.CompanyTutor>> GetByCompany(Guid id);
        Task<Models.CompanyTutor> GetById(Guid id);
        Task<Models.CompanyTutor> Create(Models.CompanyTutor model);
        Task<Models.CompanyTutor> Update(Models.CompanyTutor model);
        Task Delete(Guid id);
    }
}

