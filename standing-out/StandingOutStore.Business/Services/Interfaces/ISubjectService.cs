using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISubjectService : IDisposable
    {
        Task<List<DTO.SearchOption>> GetOptions();
        Task<List<Models.Subject>> Get();
        Task<DTO.PagedList<DTO.Subject>> GetPaged(DTO.SearchModel model);
        Task<Models.Subject> GetByIdWithoutIncludes(Guid id);
        Task<List<Models.Subject>> GetCompanySubjects(Guid id);
        Task<List<Models.Subject>> GetTutorSubjects(Guid id);
        Task<Models.Subject> GetById(Guid id);
        Task<Models.Subject> GetById(Guid id, string includes);
        Task<Models.Subject> GetByUrl(string url);
        Task<Models.Subject> Create(Models.Subject model);
        Task<Models.Subject> Update(Models.Subject model);
        Task Delete(Guid id);
    }
}
