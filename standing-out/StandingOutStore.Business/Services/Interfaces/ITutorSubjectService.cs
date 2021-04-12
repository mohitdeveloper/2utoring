using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ITutorSubjectService : IDisposable
    {
        Task<Models.TutorSubject> GetByTutorAndSubject(Guid id, Guid SubjectId);
        Task<List<Models.TutorSubject>> GetByTutor(Guid id);
        Task<List<string>> GetByTutorForProfile(Guid id);
        Task<Models.TutorSubject> Create(Models.TutorSubject model);
        Task<Models.TutorSubject> Update(Models.TutorSubject model);
        Task Delete(Guid id);
        Task<Models.TutorSubject> CreateIfNotExists(Models.TutorSubject tutorSubject);
    }
}
