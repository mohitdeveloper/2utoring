using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data.Models;
using Microsoft.EntityFrameworkCore.Internal;
using System.Linq;

namespace StandingOutStore.Business.Services
{
    public class TutorSubscriptionService : ITutorSubscriptionService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IStripePlanService _StripePlanService;
        private bool _Disposed;

        public TutorSubscriptionService(IUnitOfWork unitOfWork, IHostingEnvironment hosting,
            IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings,
            UserManager<Models.User> userManager, IStripePlanService stripePlanService)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _StripePlanService = stripePlanService;
        }

        public TutorSubscriptionService(IUnitOfWork unitOfWork, AppSettings appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        // Upon Tutor Registration..
        public async Task<TutorSubscription> CreateTutorSubscription(Guid tutorId, Guid stripePlanId)
        {
            var stripePlan = await _StripePlanService.GetById(stripePlanId);
            if (stripePlan.SubscriptionId != null)
            {
                var tutorSubscription = new TutorSubscription
                {
                    TutorId = tutorId,
                    SubscriptionId = stripePlan.SubscriptionId.Value,
                    StartDateTime = DateTime.UtcNow,
                    EndDateTime = null
                };
                var tutorSubs = await _UnitOfWork.Repository<TutorSubscription>().Insert(tutorSubscription);
                if (tutorSubs == 1) return tutorSubscription;
            }
            return null;
        }

        public async Task<TutorSubscription> GetLastTutorSubscription(Guid tutorId)
        {
            var tutorSubs = await _UnitOfWork.Repository<TutorSubscription>().Get(x => x.TutorId == tutorId);
            if (!tutorSubs.Any()) return null;

            return tutorSubs.OrderByDescending(x => x.StartDateTime).Take(1).FirstOrDefault();
        }

        public async Task<bool> ReinstateTutorSubscription(TutorSubscription tutorsLastSubscription)
        {
            throw new NotImplementedException("ReinstateTutorSubscription not implemented yet.");
            //var tutorSubs = await _UnitOfWork.Repository<TutorSubscription>().GetByID(tutorsLastSubscription.TutorSubscriptionId);
            //if (tutorSubs == null) return false;
            
            //tutorSubs.EndDateTime = null;
            //return await _UnitOfWork.Repository<TutorSubscription>().Update(tutorSubs) == 1;
        }
    }
}

