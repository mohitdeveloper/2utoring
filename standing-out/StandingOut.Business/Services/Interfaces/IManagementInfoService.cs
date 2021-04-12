using System;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using StandingOut.Business.Helpers.AcuityScheduling;

namespace StandingOut.Business.Services.Interfaces
{
    public interface IManagementInfoService : IDisposable
    {
        Task<DTO.ManagementInfoDashboard> GetDashboard(DTO.SearchModel model);
        Task<DTO.PagedList<AcuitySchedulingAppointmentType>> Courses(DTO.SearchModel model);
    }
}

