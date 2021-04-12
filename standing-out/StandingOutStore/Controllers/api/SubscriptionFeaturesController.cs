using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using StandingOutStore.Business.Services.Interfaces;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutStore.Extensions;
using StandingOut.Data.DTO;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Business.Services;
using Microsoft.AspNetCore.Authorization;
using StandingOutStore.Business.Services;
using StandingOut.Shared;

namespace StandingOutStore.Controllers.api
{
    [Produces("application/json")]
    [Route("api/subscriptionFeatures")]
    public class SubscriptionFeaturesController : NewBaseController
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IOptions<AppSettings> appSettings;
        private readonly ICompanyService _CompanyService;
        private readonly ISubscriptionFeatureService subscriptionFeatureService;
        private readonly Business.Services.Interfaces.ITutorService tutorService;

        public SubscriptionFeaturesController(UserManager<Models.User> userManager, 
            IOptions<AppSettings> appSettings,
            ICompanyService companyService, 
            ISubscriptionFeatureService subscriptionFeatureService,
            Business.Services.Interfaces.ITutorService tutorService)
            : base(userManager, appSettings, companyService)
        {
            _UserManager = userManager;
            this.appSettings = appSettings;
            _CompanyService = companyService;
            this.subscriptionFeatureService = subscriptionFeatureService;
            this.tutorService = tutorService;
        }

        [ProducesResponseType(typeof(ClassSessionFeatures), 200)]
        [HttpGet("getSubscriptionFeatures/{subscriptionId}")]
        public async Task<IActionResult> GetSubscriptionFeatures(Guid subscriptionId)
        {
            var subfeatures = await subscriptionFeatureService.GetSubscriptionFeatures(subscriptionId);
            var featureSet = new SubscriptionFeatureSet(subfeatures);
            return Ok(featureSet.ToClassSessionFeatures());
        }

        [Authorize]
        [ProducesResponseType(typeof(Models.Subscription), 200)]
        [HttpGet("getActiveSubscription")]
        public async Task<IActionResult> GetActiveSubscription()
        {
            Models.Subscription subs=null;
            if (Caller.IsAdmin && Caller.CurrentUserCompany != null)
                subs = await _CompanyService.GetActiveSubscription(Caller.CurrentUserCompany.CompanyId);
            else if (Caller.IsTutor && Caller.CurrentUser?.TutorId != null)
                subs = await tutorService.GetActiveSubscription(Caller.CurrentUser.TutorId.Value);

            return Ok(subs);
        }
    }
}