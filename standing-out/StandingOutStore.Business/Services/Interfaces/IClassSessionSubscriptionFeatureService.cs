using StandingOut.Shared;
using System;
using System.Threading.Tasks;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IClassSessionSubscriptionFeatureService
    {
        Task<SubscriptionFeatureSet> GetSubscriptionFeatureSetByClassSessionId(Guid classSessionId);
    }
}
