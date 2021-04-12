using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StandingOut.Shared;
using StandingOutStore.Business.Services.Interfaces;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Business.Services
{
    public class TutorSubscriptionFeatureService : ITutorSubscriptionFeatureService
    {
        private readonly ISubscriptionFeatureService _SubscriptionFeatureService;
        private readonly Dictionary<Guid, List<Models.SubscriptionFeature>> _TutorSubscriptionFeatures = new Dictionary<Guid, List<Models.SubscriptionFeature>>();

        public TutorSubscriptionFeatureService(ISubscriptionFeatureService subscriptionFeatureService)
        {
            _SubscriptionFeatureService = subscriptionFeatureService;
        }

        public async Task<SubscriptionFeatureSet> GetSubscriptionFeatureSetByTutorId(Guid tutorId)
        {
            var subscriptionFeatures = await RetrieveSubscriptionFeatures(tutorId);
            if (!RetrievedSubscriptionFeatures(tutorId)) return null;
            var featureSet = new SubscriptionFeatureSet(subscriptionFeatures);

            return featureSet;
        }

        private async Task<List<Models.SubscriptionFeature>> RetrieveSubscriptionFeatures(Guid tutorId)
        {
            if (RetrievedSubscriptionFeatures(tutorId)) return null;

            var features = await _SubscriptionFeatureService.GetSubscriptionFeaturesForTutor(tutorId);
            _TutorSubscriptionFeatures.Add(tutorId, features); // add null if that's what we got.
            return features;
        }

        private bool RetrievedSubscriptionFeatures(Guid tutorId)
        {
            return _TutorSubscriptionFeatures.ContainsKey(tutorId);
        }
    }
}