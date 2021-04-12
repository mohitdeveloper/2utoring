using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISubjectStudyLevelSetupService : IDisposable
    {
        // Task<List<DTO.SearchOption>> GetOptions();
        Task<List<Models.SubjectStudyLevelSetup>> Get(Guid ContextEntityId);
        Task<Models.SubjectStudyLevelSetup> getPricePerPerson(DTO.SubjectStudyLevelSetupPrice model);
        Task<DTO.PagedList<DTO.SubjectStudyLevelSetup>> GetPaged(DTO.SubjectStudyLevelSearchModel model);
        Task<Models.SubjectStudyLevelSetup> GetBySubjectStudyLevel(Guid? entityId, Guid subjectId, Guid studyLevelId,
            string includes = "");

        //Task<Models.SubjectStudyLevelSetup> GetByIdWithoutIncludes(Guid id);
        //Task<Models.SubjectStudyLevelSetup> GetById(Guid id);
        Task<Models.SubjectStudyLevelSetup> GetById(Guid id, string includes="");
        Task<Models.SubjectStudyLevelSetup> Create(Models.SubjectStudyLevelSetup model);
        Task<Models.SubjectStudyLevelSetup> Update(Models.SubjectStudyLevelSetup model);
        Task Delete(Guid id);
    }
}
