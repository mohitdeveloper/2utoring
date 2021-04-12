using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IStripeCountryService : IDisposable
    {
        Task<List<Models.StripeCountry>> Get();
    }
}
