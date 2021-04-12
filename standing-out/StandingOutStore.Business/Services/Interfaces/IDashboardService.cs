using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IDashboardService : IDisposable
    {
        Task<DTO.ManagementInfoDashboard> GetManagementInfo(DTO.SearchModel model);
        Task<DTO.PagedList<DTO.ClassSessionIndex>> GetSessions(DTO.SearchModel model);
    }
}
