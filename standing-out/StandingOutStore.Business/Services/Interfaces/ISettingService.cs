using Models = StandingOut.Data.Models;
using System;
using System.Threading.Tasks;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISettingService : IDisposable
    {
        Task<Models.Setting> Get();
    }
}
