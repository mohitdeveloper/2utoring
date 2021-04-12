using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using StandingOut.Shared;
using StandingOutStore.Business.Services.Interfaces;

namespace StandingOutStore.Business.Services
{
    public class CompanySubscriptionFeatureService : ICompanySubscriptionFeatureService
    {
        private readonly ISubscriptionFeatureService _SubscriptionFeatureService;
        private readonly Dictionary<Guid, List<Models.SubscriptionFeature>> _CompanySubscriptionFeatures 
            = new Dictionary<Guid, List<Models.SubscriptionFeature>>();

        public CompanySubscriptionFeatureService(ISubscriptionFeatureService subscriptionFeatureService)
        {
            _SubscriptionFeatureService = subscriptionFeatureService;
        }

        public async Task<SubscriptionFeatureSet> GetSubscriptionFeatureSetByCompanyId(Guid companyId)
        {
            var subscriptionFeatures = RetrievedSubscriptionFeatures(companyId) ? 
                        _CompanySubscriptionFeatures[companyId]: 
                        await RetrieveSubscriptionFeatures(companyId); 
            
            if (subscriptionFeatures == null) return null;

            var featureSet = new SubscriptionFeatureSet(subscriptionFeatures);
            return featureSet;
        }

        private async Task<List<Models.SubscriptionFeature>> RetrieveSubscriptionFeatures(Guid companyId)
        {
            var features = await _SubscriptionFeatureService.GetSubscriptionFeaturesForCompany(companyId);
            if (features == null) return null;

            _CompanySubscriptionFeatures.Add(companyId, features); 
            return features;
        }

        private bool RetrievedSubscriptionFeatures(Guid companyId)
        {
            return _CompanySubscriptionFeatures.ContainsKey(companyId);
        }
    }
}