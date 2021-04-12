using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StandingOut.Data.Models;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISubscriptionFeatureService : IDisposable
    {
        // Subscription Features (maybe move these to Tutor service and ClassSession service)
        Task<List<SubscriptionFeature>> GetSubscriptionFeatures(Guid subscriptionId);
        Task<List<SubscriptionFeature>> GetSubscriptionFeaturesForTutor(Guid tutorId);
        Task<List<SubscriptionFeature>> GetSubscriptionFeaturesForCompany(Guid companyId);
        //Task<List<SubscriptionFeature>> GetSubscriptionFeaturesForClassSession(Guid classSessionId);
    }
}
