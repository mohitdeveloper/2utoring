using StandingOutIdentity.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutIdentity.Business.Services
{
    public class ErrorLogService : IErrorLogService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly AppSettings _AppSettings;
        private bool _Disposed;

        public ErrorLogService(IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings.Value;
        }

        public ErrorLogService(IUnitOfWork unitOfWork, AppSettings appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                    _Disposed = true;
            }
        }

        public async Task<Models.ErrorLog> Log(Models.ErrorLog model)
        {
            await _UnitOfWork.Repository<Models.ErrorLog>().Insert(model);
            await ClearLogs();

            return model;
        }

        public async Task ClearLogs(int safeDays = -30)
        {
            DateTime expiryDate = DateTime.Today.AddDays(safeDays);
            var logs = await _UnitOfWork.Repository<Models.ErrorLog>().Get(o => o.LogDate < expiryDate);

            //This is the only time we would ever remove an object, as these would fill a database quickly
            await _UnitOfWork.Repository<Models.ErrorLog>().Delete(logs);
        }
    }
}
