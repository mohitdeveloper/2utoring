using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ITutorQualificationService : IDisposable
    {
        Task<List<Models.TutorQualification>> GetByTutor(Guid id);
        Task<Models.TutorQualification> Create(Models.TutorQualification model);
        Task<Models.TutorQualification> Update(Models.TutorQualification model);
        Task Delete(Guid id);
    }
}
