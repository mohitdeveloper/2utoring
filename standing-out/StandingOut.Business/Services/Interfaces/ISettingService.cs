using Models = StandingOut.Data.Models;
using System;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISettingService : IDisposable
    {
        Task<Models.Setting> Get();
        Task<Models.Setting> UpdateSafeguardAlertEmail(Models.Setting model);

        Task ResetAllSessions();
    }
}
