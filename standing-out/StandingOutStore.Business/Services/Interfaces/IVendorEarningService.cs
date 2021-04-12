using Models = StandingOut.Data.Models;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IVendorEarningService : IDisposable
    {
        Task<List<Models.VendorEarning>> GetVendorEarningsEligibleForPayout(DateTimeOffset endDateFilter, DateTimeOffset paymentDateFilter);
        Task<List<Models.VendorEarning>> Update(List<Models.VendorEarning> earningsPaidOut);
        Task<List<Models.VendorEarning>> TransferPendingVendorEarnings(Models.Setting settings,Guid id);
    }
}
