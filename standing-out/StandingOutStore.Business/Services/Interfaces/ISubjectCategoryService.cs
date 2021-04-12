using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISubjectCategoryService : IDisposable
    {
        Task<List<DTO.GuidOptionExpanded>> GetOptions(Guid? subjectId);
        Task<List<Models.SubjectCategory>> Get();
        Task<DTO.PagedList<DTO.SubjectCategory>> GetPaged(DTO.SearchModel model);
        Task<Models.SubjectCategory> GetByIdWithoutIncludes(Guid id);
        Task<Models.SubjectCategory> GetById(Guid id);
        Task<Models.SubjectCategory> GetById(Guid id, string includes);
        Task<Models.SubjectCategory> GetByUrl(string url);
        Task<Models.SubjectCategory> Create(Models.SubjectCategory model);
        Task<Models.SubjectCategory> Update(Models.SubjectCategory model);
        Task Delete(Guid id);
    }
}
