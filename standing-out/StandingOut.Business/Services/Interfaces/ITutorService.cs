using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ITutorService : IDisposable
    {
        Task<List<Models.Tutor>> Get();
        Task<Models.Tutor> GetById(Guid tutorId);
        Task<Models.Tutor> Create(DTO.CreateTutor model);
        Task<Models.Tutor> Update(DTO.EditTutor model);
        Task<Models.Tutor> UpdateMy(DTO.EditTutor model);
        Task<Models.Tutor> UploadImage(Guid tutorId, ICollection<IFormFile> file);
        Task Delete(Models.User model);

        Task<DTO.TutorProfile> GetProfileById(Guid id);
    }
}

