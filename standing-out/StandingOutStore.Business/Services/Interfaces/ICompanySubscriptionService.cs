using StandingOut.Data.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ICompanySubscriptionService : IDisposable
    {
        Task<CompanySubscription> CreateCompanySubscription(Guid companyId, Guid stripePlanId);


        //Task<List<Models.CompanySubscription>> GetByCompanyId(Guid companyId);
        //Task<Models.CompanySubscription> CreateIfNotExists();

        //Task<Models.CompanySubscription> Create(Models.CompanySubscription model);
        //Task<Models.CompanySubscription> Update(Models.CompanySubscription model);
        //Task Delete(Guid id);
    }
}
