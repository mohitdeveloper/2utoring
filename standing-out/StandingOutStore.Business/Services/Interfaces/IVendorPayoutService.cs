using System;
using System.Threading.Tasks;
using StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IVendorPayoutService : IDisposable
    {
        Task<VendorPayout> Create(VendorPayout vendorPayout);
    }
}
