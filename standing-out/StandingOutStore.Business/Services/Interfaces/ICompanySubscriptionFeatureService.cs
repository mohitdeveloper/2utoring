using StandingOut.Shared;
using System;
using System.Threading.Tasks;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ICompanySubscriptionFeatureService
    {
        Task<SubscriptionFeatureSet> GetSubscriptionFeatureSetByCompanyId(Guid companyId);
    }
}
