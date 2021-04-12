using System;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISafeguardingReportService : IDisposable
    {
        Task<Models.SafeguardReport> Create(Models.SafeguardReport model, Models.User user);
        Task<DTO.PagedList<DTO.SafeguardReportIndex>> GetPaged(DTO.SearchModel model, Models.Company currentUserCompany=null);
        Task<Models.SafeguardReport> GetById(Guid id);
        Task<Models.SafeguardReport> Update(Models.SafeguardReport model);
    }
}
