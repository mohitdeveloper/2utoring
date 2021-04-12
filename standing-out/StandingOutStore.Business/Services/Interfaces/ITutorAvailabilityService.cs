using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Http;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ITutorAvailabilityService : IDisposable
    {
        Task<List<Models.TutorAvailability>> GetByTutorId(Guid tutorid);
        Task<List<Models.Tutor>> GetAvailableTutors(DTO.SearchAvailableTutors model);
        Task<Models.TutorAvailability> GetById(Guid id);
        Task<Models.TutorAvailability> Create(Models.TutorAvailability model);
        Task<List<Models.TutorAvailability>> CreateMultiple(List<Models.TutorAvailability> model);
        
        Task<Models.TutorAvailability> Update(Models.TutorAvailability model);
        Task Delete(Guid id);
        Task DeleteByTutor(Guid id);
        Task<bool> CheckSlotAvailability(DTO.CheckAvailableSlot model);
    }
}
