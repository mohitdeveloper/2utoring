using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IPromoCodeService : IDisposable
    {
        Task<Models.PromoCode> GetByName(string name);
        Task<int> GetUses(Guid promoCodeId);
        Task<List<Models.PromoCode>> Create(List<Models.PromoCode> codes);
    }
}
