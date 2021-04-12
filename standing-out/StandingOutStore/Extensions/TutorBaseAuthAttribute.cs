using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Extensions
{
    public class TutorBaseAuthAttribute : Attribute, IAsyncActionFilter
    {
        internal ITutorService _TutorService;
        internal UserManager<Models.User> _UserManager;

        private bool _AllowSuperAdmin = false;

        public TutorBaseAuthAttribute(bool AllowSuperAdmin = false)
        {
            _AllowSuperAdmin = AllowSuperAdmin; // Need to set [Allow "Super Admin"] on action method too
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            Controller controller = context.Controller as Controller;
            string url = context.HttpContext.Request.Path.ToString().ToLower();
            _TutorService = controller.HttpContext.RequestServices.GetService(typeof(ITutorService)) as ITutorService;
            _UserManager = controller.HttpContext.RequestServices.GetService(typeof(UserManager<Models.User>)) as UserManager<Models.User>;

            if (!url.Contains("downloadtutorprofileimage"))
            {
                var modelUser = await _UserManager.FindByEmailAsync(context.HttpContext.User.Identity.Name);
                if (await _UserManager.IsInRoleAsync(modelUser, "Tutor") || _AllowSuperAdmin)
                {
                    context.RouteData.DataTokens.TryAdd("modelUser", modelUser);
                    var tutor = await _TutorService.GetMyForTutorAuth();
                    if (controller.User.IsInRole("Super Admin") && _AllowSuperAdmin)
                    {
                        await next();
                        return;
                    }

                    var currentCompany = await _TutorService.GetCurrentCompany(modelUser);

                    //if (tutor != null && currentCompany == null &&
                    //    !string.IsNullOrWhiteSpace(tutor.StripeSubscriptionId) &&
                    //    !string.IsNullOrWhiteSpace(tutor.StripeCustomerId) &&
                    //    (tutor.LastTimeStripeSubscriptionChecked < DateTime.Now.AddDays(-1) ||
                    //    tutor.PaymentStatus == StandingOut.Data.Enums.PaymentStatus.Failed ||
                    //    tutor.PaymentStatus == StandingOut.Data.Enums.PaymentStatus.Cancelled))
                    //{// we have not check thier stirpe in last 24 hrs or it's failed, lets check to see if fixed
                    //    tutor = await _TutorService.CheckTutorStripe(tutor.TutorId);
                    //}

                    if (currentCompany != null && tutor != null && tutor.InitialRegistrationComplete == false)
                    {
                        context.Result = new RedirectToActionResult("CompanyProcess", "Register", new { area = "Tutor", companyId = currentCompany.CompanyId });
                    }
                    else if (currentCompany != null && tutor != null && tutor.InitialRegistrationComplete == true)
                    {
                        context.RouteData.DataTokens.TryAdd("modelTutor", tutor);
                        var resultContext = await next();
                    }
                    else
                    {

                        if (tutor == null)
                        { // they did not get past step 1 of registering
                            context.Result = new RedirectToActionResult("Index", "Register", new { area = "Tutor" });
                        }
                        else if (tutor.InitialRegistrationComplete == false)
                        { // they need to finish regsitering
                            context.Result = new RedirectToActionResult("Process", "Register", new { area = "Tutor", id = tutor.StripePlanId });
                        }
                        #region  #Code commented because Redirection code written in ValidatePlan.cs file 
                        //else if (tutor.PaymentStatus != StandingOut.Data.Enums.PaymentStatus.Paid
                        //                   && !url.Contains("settings/subscriptionIssue") &&
                        //                   !url.Contains("settings/subscription") &&
                        //                   !url.Contains("settings/cancel"))
                        //{

                        //    // there is a problem with payment but allow them to view payment screens
                        //    context.Result = new RedirectToActionResult("SubscriptionIssue", "Settings", new { area = "Tutor" });
                        //} 
                        #endregion
                        else
                        {
                            context.RouteData.DataTokens.TryAdd("modelTutor", tutor);
                            var resultContext = await next();
                        }
                    }

                }
                else
                {
                    // they are not authorized
                    context.Result = new RedirectToActionResult("Forbidden", "Home", new { area = "" });
                }
            }
            else
            {
                // it was an unauthed endpoint
                var resultContext = await next();
            }
        }
    }
}
