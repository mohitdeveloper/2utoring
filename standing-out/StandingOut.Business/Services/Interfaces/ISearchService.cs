using System;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISearchService : IDisposable
    {
        Task<DTO.PagedList<DTO.GlobalSearchResult>> Global(DTO.GlobalSearch model);
    }
}

