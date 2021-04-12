using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Data.Models;
using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StandingOut.Shared.Integrations.Stripe;
using System.Linq;
using StandingOut.Data.Enums;

namespace StandingOutStore.Business.Services
{
    public class TutoringPlanService : ITutoringPlanService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IStripeService _StripeService;
        private readonly ITutorService _TutorService;
        private readonly ICompanyService _CompanyService;
         
        public TutoringPlanService(UserManager<Models.User> userManager, IUnitOfWork unitOfWork, IStripeService stripeService, ITutorService tutorService,ICompanyService companyService)
        {
            _UnitOfWork = unitOfWork;
            _UserManager = userManager;
            _StripeService = stripeService;
            _TutorService = tutorService;
            _CompanyService = companyService;
        }
        public async Task<DTO.PlanValidity> CheckPlanValidity(User user)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();

            DTO.PlanValidity planValidity = new DTO.PlanValidity();
            planValidity.IsValidPlan = true;
            int FreeDaysLeft = 0;
            #region Find User Type
            if (await _UserManager.IsInRoleAsync(user, "Admin"))
            {
                var company = await _UnitOfWork.Repository<Models.Company>().GetSingle(x => x.AdminUserId == user.Id, includeProperties: "StripePlan.Subscription");
                if(company!=null && company.StripePlan!=null)
                {
                    int totalDay = (int)(DateTime.Now - Convert.ToDateTime(company.CreatedDate)).TotalDays;
                    FreeDaysLeft = company.StripePlan.FreeDays != null ? Convert.ToInt32(company.StripePlan.FreeDays) - totalDay : 0;
                    planValidity.UserType = "Admin";
                    planValidity.RemainingDay = FreeDaysLeft;
                    if (FreeDaysLeft <= 7 && company.StripePlan.Subscription.SubscriptionPrice > 0)
                    {
                        company = await _CompanyService.CheckCompanyStripe(company.CompanyId);
                        //check if tutor has not purchase any subscription
                        if (company.PaymentStatus != PaymentStatus.Paid)
                        {
                            if (FreeDaysLeft <= 0)
                            {
                                planValidity.IsValidPlan = false;
                            }
                        }
                    }
                }
            }
            else if (await _UserManager.IsInRoleAsync(user, "Tutor"))
            {
                var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == user.TutorId, includeProperties: "StripePlan.Subscription");
                if (tutor.StripePlan != null)
                {
                    int totalDay = (int)(DateTime.Now - Convert.ToDateTime(tutor.CreatedDate)).TotalDays;
                    FreeDaysLeft = tutor.StripePlan.FreeDays != null ? Convert.ToInt32(tutor.StripePlan.FreeDays) - totalDay : 0;
                    planValidity.UserType = "Tutor";
                    planValidity.RemainingDay = FreeDaysLeft;
                    
                    //check tutor free trial day is less than or equal to 7 then this condition is true
                    if (FreeDaysLeft <= 7 && tutor.StripePlan.Subscription.SubscriptionPrice > 0)
                    {
                        tutor = await _TutorService.CheckTutorStripe(tutor.TutorId);
                        //check if tutor has not purchase any subscription
                        if (tutor.PaymentStatus != PaymentStatus.Paid)
                        {
                            if (FreeDaysLeft <= 0)
                            {
                                planValidity.IsValidPlan = false;
                            }
                        }
                    }
                }
            }
            #endregion
            return planValidity;

        }



    }
}
