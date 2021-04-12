using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using Microsoft.AspNetCore.Http;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ITutorCertificateService : IDisposable
    {
        Task<List<Models.TutorCertificate>> GetByTutor(Guid id);
        Task Upload(Guid tutorId, IFormFile file);
        Task<Models.TutorCertificate> Update(Models.TutorCertificate model);
        Task Delete(Guid id);
        Task<Models.TutorCertificate> GetById(Guid id);
        Task<byte[]> GetFile(Guid id);
    }
}
