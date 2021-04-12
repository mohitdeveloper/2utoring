using StandingOut.Shared;
using System;
using System.Threading.Tasks;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ITutorSubscriptionFeatureService
    {
        Task<SubscriptionFeatureSet> GetSubscriptionFeatureSetByTutorId(Guid tutorId);
    }
}
