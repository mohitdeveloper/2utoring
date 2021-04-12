using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ICourseInviteService : IDisposable
    {
        Task<List<Models.CourseInvite>> GetByCourseId(Guid courseId);
        Task<Models.CourseInvite> GetById(Guid id);
        Task<Models.CourseInvite> Create(Models.User sender, Models.CourseInvite model);
        Task<List<Models.CourseInvite>> Create(Models.User sender, List<Models.CourseInvite> models);
        Task<Models.CourseInvite> Update(Models.CourseInvite model);
        Task Delete(Guid id);
    }
}
