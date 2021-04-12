using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StandingOut.Data;
using Models = StandingOut.Data.Models;
using StandingOutStore.Business.Services.Interfaces;

namespace StandingOutStore.Business.Services
{
    public class SubscriptionFeatureService : ISubscriptionFeatureService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed = false;

        public SubscriptionFeatureService(IUnitOfWork unitOfWork)
        {
            _UnitOfWork = unitOfWork;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<List<Models.SubscriptionFeature>> GetSubscriptionFeatures(Guid subscriptionId)
        {
            var subscriptionFeatures = await _UnitOfWork.Repository<Models.SubscriptionFeature>()
                .Get(x => x.SubscriptionId == subscriptionId,
                    includeProperties: "Feature, Subscription");

            return subscriptionFeatures;
        }

        public async Task<List<Models.SubscriptionFeature>> GetSubscriptionFeaturesForTutor(Guid tutorId)
        {
            // await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == id,
            // includeProperties: "SessionAttendees, SessionAttendees.User, Owner, SessionGroups, Hub");
            var effectiveDate = DateTime.UtcNow;

            var tutorSubscription = await _UnitOfWork.Repository<Models.TutorSubscription>()
                .GetSingle(x => x.TutorId == tutorId &&
                                x.StartDateTime.HasValue && x.StartDateTime <= effectiveDate &&
                                (!x.EndDateTime.HasValue ||
                                 (x.EndDateTime.HasValue && x.EndDateTime >= effectiveDate)));
            if (tutorSubscription == null) return null;

            var subscriptionFeatures = await GetSubscriptionFeatures(tutorSubscription.SubscriptionId);

            return subscriptionFeatures;
        }

        public async Task<List<Models.SubscriptionFeature>> GetSubscriptionFeaturesForCompany(Guid companyId)
        {
            // await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == id,
            // includeProperties: "SessionAttendees, SessionAttendees.User, Owner, SessionGroups, Hub");
            var effectiveDate = DateTime.UtcNow;

            var companySubscription = await _UnitOfWork.Repository<Models.CompanySubscription>()
                .GetSingle(x => x.CompanyId == companyId &&
                                x.StartDateTime.HasValue && x.StartDateTime <= effectiveDate &&
                                (!x.EndDateTime.HasValue ||
                                 (x.EndDateTime.HasValue && x.EndDateTime >= effectiveDate)));
            if (companySubscription == null) return null;

            var subscriptionFeatures = await GetSubscriptionFeatures(companySubscription.SubscriptionId);

            return subscriptionFeatures;
        }

        // DONT Use this as it doesnt consider Company ownership of session
        //public async Task<List<Models.SubscriptionFeature>> GetSubscriptionFeaturesForClassSession(Guid classSessionId)
        //{
        //    var classSession = await GetByIdWithTutor(classSessionId);
        //    if (classSession?.Owner?.TutorId == null) return null;

        //    var tutorId = classSession.Owner?.TutorId.Value;
        //    return await GetSubscriptionFeaturesForTutor(tutorId.Value);

        //}

        //private async Task<Models.ClassSession> GetByIdWithTutor(Guid id)
        //{
        //    return await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == id, includeProperties: "Owner");
        //}

    }

}
