using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services
{
    public class SettingService : ISettingService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed;

        public SettingService(IUnitOfWork unitOfWork)
        {
            _UnitOfWork = unitOfWork;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                _Disposed = true;
            }
        }

        public async Task<Models.Setting> Get()
        {
            return await _UnitOfWork.Repository<Models.Setting>().GetSingle();
        }       
    }
}
