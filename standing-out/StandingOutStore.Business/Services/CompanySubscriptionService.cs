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

namespace StandingOutStore.Business.Services
{
    public class CompanySubscriptionService : ICompanySubscriptionService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IStripePlanService _StripePlanService;
        private bool _Disposed;

        public CompanySubscriptionService(IUnitOfWork unitOfWork, IHostingEnvironment hosting,
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

        public CompanySubscriptionService(IUnitOfWork unitOfWork, AppSettings appSettings)
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
        public async Task<CompanySubscription> CreateCompanySubscription(Guid companyId, Guid stripePlanId)
        {
            var stripePlan = await _StripePlanService.GetById(stripePlanId);
            if (stripePlan.SubscriptionId != null)
            {
                var companySubscription = new CompanySubscription
                {
                    CompanyId = companyId,
                    SubscriptionId = stripePlan.SubscriptionId.Value,
                    StartDateTime = DateTime.UtcNow,
                    EndDateTime = null
                };
                var companySubs = await _UnitOfWork.Repository<CompanySubscription>().Insert(companySubscription);
                if (companySubs == 1) return companySubscription;
            }
            return null;
        }

    }
}

