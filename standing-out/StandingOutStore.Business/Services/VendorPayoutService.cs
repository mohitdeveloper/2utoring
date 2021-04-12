using Models = StandingOut.Data.Models;
using System;
using System.Threading.Tasks;
using StandingOut.Data.Models;
using StandingOut.Data;
using StandingOutStore.Business.Services.Interfaces;

namespace StandingOutStore.Business.Services
{
    public class VendorPayoutService : IVendorPayoutService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed;

        public VendorPayoutService(IUnitOfWork unitOfWork)
        {
            this._UnitOfWork = unitOfWork;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<VendorPayout> Create(VendorPayout vendorPayout)
        {
            var inserted = await _UnitOfWork.Repository<Models.VendorPayout>().Insert(vendorPayout);

            return (inserted >= 1) ? vendorPayout : null;
        }

    }
}
