using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StandingOut.Data.Models;
using StandingOut.Shared;
using StandingOutStore.Business.Services.Interfaces;

namespace StandingOutStore.Business.Services
{
    public class ClassSessionSubscriptionFeatureService : IClassSessionSubscriptionFeatureService
    {
        private readonly ISubscriptionFeatureService _SubscriptionFeatureService;
        //private readonly ICompanySubscriptionFeatureService companySubscriptionFeatureService;
        //private readonly ITutorSubscriptionFeatureService tutorSubscriptionFeatureService;
        private readonly IClassSessionService classSessionService;
        private Dictionary<Guid, List<SubscriptionFeature>> _ClassSessionSubscriptionFeatures = 
            new Dictionary<Guid, List<SubscriptionFeature>>();

        private List<SubscriptionFeature> subscriptionFeatures;

        public ClassSessionSubscriptionFeatureService(ISubscriptionFeatureService subscriptionFeatureService,
            //ICompanySubscriptionFeatureService companySubscriptionFeatureService, 
            //ITutorSubscriptionFeatureService tutorSubscriptionFeatureService, 
            IClassSessionService classSessionService)
        {
            _SubscriptionFeatureService = subscriptionFeatureService;
            //this.companySubscriptionFeatureService = companySubscriptionFeatureService;
            //this.tutorSubscriptionFeatureService = tutorSubscriptionFeatureService;
            this.classSessionService = classSessionService;
        }

        public async Task<SubscriptionFeatureSet> GetSubscriptionFeatureSetByClassSessionId(Guid classSessionId)
        {
            var session = await classSessionService.GetById(classSessionId, includes: "Course, Owner");
            SubscriptionFeatureSet featureSet=null;
            //if (session.Course.CompanyId.HasValue)
            //    featureSet = await companySubscriptionFeatureService.GetSubscriptionFeatureSetByCompanyId(session.Course.CompanyId.Value);
            //else
            //    featureSet = await tutorSubscriptionFeatureService.GetSubscriptionFeatureSetByTutorId(session.Owner.TutorId.Value);

            if (RetrievedSubscriptionFeatures(classSessionId))
                subscriptionFeatures = _ClassSessionSubscriptionFeatures[classSessionId];
            else
                subscriptionFeatures = await RetrieveSubscriptionFeatures(classSessionId, session.Course?.CompanyId, session.Owner?.TutorId);

            featureSet = new SubscriptionFeatureSet(subscriptionFeatures);

            return featureSet;
        }

        private async Task<List<SubscriptionFeature>> RetrieveSubscriptionFeatures(Guid classSessionId, Guid? companyId=null, Guid? tutorId = null)
        {
            List<SubscriptionFeature> subscriptionFeatures;
            if (companyId.HasValue)
                subscriptionFeatures = await _SubscriptionFeatureService.GetSubscriptionFeaturesForCompany(companyId.Value);
            else
                subscriptionFeatures = await _SubscriptionFeatureService.GetSubscriptionFeaturesForTutor(tutorId.Value);

            _ClassSessionSubscriptionFeatures.Add(classSessionId, subscriptionFeatures); // add null if that's what we got.
            return subscriptionFeatures;
        }

        private bool RetrievedSubscriptionFeatures(Guid classSessionId)
        {
            return _ClassSessionSubscriptionFeatures.ContainsKey(classSessionId);
        }
    }
}