using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutIdentity.IdentityService
{
    public class IdentityProfileService : IProfileService
    {
        //https://stackoverflow.com/questions/41387069/identity-server-4-adding-claims-to-access-token/43369166#43369166
        //https://github.com/IdentityServer/IdentityServer4/issues/1356
        private readonly IUserClaimsPrincipalFactory<Models.User> _claimsFactory;
        private readonly UserManager<Models.User> _userManager;

        public IdentityProfileService(IUserClaimsPrincipalFactory<Models.User> claimsFactory, UserManager<Models.User> userManager)
        {
            _claimsFactory = claimsFactory;
            _userManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(sub);
            if (user == null)
            {
                throw new ArgumentException("");
            }

            var principal = await _claimsFactory.CreateAsync(user);
            var claims = principal.Claims.ToList();

            //Add more claims like this
            //claims.Add(new System.Security.Claims.Claim("MyProfileID", user.Id));

            context.IssuedClaims = claims;
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(sub);
            context.IsActive = user != null;
        }
    }
}