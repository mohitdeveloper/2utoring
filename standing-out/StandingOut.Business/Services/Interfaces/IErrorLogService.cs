using Models = StandingOut.Data.Models;
using System;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface IErrorLogService : IDisposable
    {
        Task<Models.ErrorLog> Log(Models.ErrorLog model);
        Task ClearLogs(int safeDays = -30);
    }
}
