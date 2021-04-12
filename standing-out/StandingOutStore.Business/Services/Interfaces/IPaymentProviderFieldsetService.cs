using Models = StandingOut.Data.Models;
using System;
using System.Threading.Tasks;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IPaymentProviderFieldsetService : IDisposable
    {
        Task<Models.PaymentProviderFieldSet> GetById(Guid paymentProviderFieldSetId);
    }
}
