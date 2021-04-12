using System;
using System.Collections.Generic;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface IHubService : IDisposable
    {
        Task<List<DTO.Hub>> Get();
        Task<DTO.Hub> GetHubToUse();
        string GetDomain(string subDomain);
    }
}

