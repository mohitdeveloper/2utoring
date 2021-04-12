using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IStudyLevelService : IDisposable
    {
        Task<List<DTO.SearchOption>> GetOptions();
        Task<List<Models.StudyLevel>> Get();
        Task<DTO.PagedList<DTO.StudyLevel>> GetPaged(DTO.SearchModel model);
        Task<Models.StudyLevel> GetByIdWithoutIncludes(Guid id);
        Task<List<Models.StudyLevel>> GetCompanyLevels(Guid id);
        Task<List<Models.StudyLevel>> GetTutorLevels(Guid id);
        Task<Models.StudyLevel> GetById(Guid id);
        Task<Models.StudyLevel> GetById(Guid id, string includes);
        Task<Models.StudyLevel> GetByUrl(string url);
        Task<Models.StudyLevel> Create(Models.StudyLevel model);
        Task<Models.StudyLevel> Update(Models.StudyLevel model);
        Task Delete(Guid id);
        Task<List<Models.StudyLevel>> GetCompanyLevelsBySubject(Guid id,Guid subjectId);
        Task<List<Models.StudyLevel>> GetTutorLevelsBySubject(Guid id, Guid subjectId);
        
            
    }
}
