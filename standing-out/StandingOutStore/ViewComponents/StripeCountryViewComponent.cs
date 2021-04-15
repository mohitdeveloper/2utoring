using StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using StandingOut.Data.DTO;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using StandingOut.Data;
using System;
using StandingOut.Shared.Mapping;

namespace StandingOutStore.ViewComponents
{
    public class StripeCountryViewComponent : ViewComponent
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IStripeCountryService _StripeCountryService;
        public StripeCountryViewComponent(UserManager<Models.User> userManager, IStripeCountryService stripeCountryService)
        {
            _UserManager = userManager;
            _StripeCountryService = stripeCountryService;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            StripeCountry model = new StripeCountry();
            if (User.Identity.IsAuthenticated)
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                if (user.StripeCountryID != null)
                {
                    var stripeCountry = await _StripeCountryService.GetById(Guid.Parse(user.StripeCountryID.ToString()));
                    model = Mappings.Mapper.Map<Models.StripeCountry, StripeCountry>(stripeCountry);
                }
            }
            return View(model);
        }
    }
}
