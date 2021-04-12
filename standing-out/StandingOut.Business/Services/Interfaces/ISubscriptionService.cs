using Models = StandingOut.Data.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StandingOut.Business.Services.Interfaces
{
    public interface ISubscriptionService : IDisposable
    {
        Task<List<Models.Subscription>> Get();
        Task<Models.Subscription> GetById(Guid id);
        Task<Models.Subscription> Create(Models.Subscription model);
        Task<Models.Subscription> Update(Models.Subscription model);
        Task<int> Delete(Guid id);
    }
}
