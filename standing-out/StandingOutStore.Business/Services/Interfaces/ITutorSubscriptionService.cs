using StandingOut.Data.Models;
using System;
using System.Threading.Tasks;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ITutorSubscriptionService : IDisposable
    {
        Task<TutorSubscription> CreateTutorSubscription(Guid tutorId, Guid stripePlanId);
        Task<TutorSubscription> GetLastTutorSubscription(Guid tutorId);
        Task<bool> ReinstateTutorSubscription(TutorSubscription tutorsLastSubscription);

        //Task<List<Models.CompanySubscription>> GetByCompanyId(Guid companyId);
        //Task<Models.CompanySubscription> CreateIfNotExists();

        //Task<Models.CompanySubscription> Create(Models.CompanySubscription model);
        //Task<Models.CompanySubscription> Update(Models.CompanySubscription model);
        //Task Delete(Guid id);
    }
}
