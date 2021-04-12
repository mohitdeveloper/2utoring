using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ITutorSubjectStudyLevelService : IDisposable
    {
        Task<List<Models.TutorSubjectStudyLevel>> GetByTutor(Guid id);
        Task<List<string>> GetByTutorForProfile(Guid id);

        Task<Models.TutorSubjectStudyLevel> GetByTutorSubjectStudyLevel(Models.TutorSubject modelTutorSubject,
            Guid modelStudyLevelId);

        Task<Models.TutorSubjectStudyLevel> Create(Models.TutorSubjectStudyLevel model);
        Task<Models.TutorSubjectStudyLevel> CreateIfNotExists(Models.TutorSubjectStudyLevel model);
        Task<Models.TutorSubjectStudyLevel> Update(Models.TutorSubjectStudyLevel model);
        Task Delete(Guid id);
    }
}
