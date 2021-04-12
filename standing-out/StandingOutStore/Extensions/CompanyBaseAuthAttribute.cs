using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;
using StandingOutStore.Business.Services.Interfaces;

namespace StandingOutStore.Extensions
{
    public class CompanyBaseAuthAttribute : Attribute, IAsyncActionFilter
    {
        private ICompanyService _CompanyService;
        private readonly ICompanyId _CompanyId;
        private readonly string _UserId;
        internal UserManager<Models.User> _UserManager;
        private bool _AllowSuperAdmin = false;

        public CompanyBaseAuthAttribute(bool AllowSuperAdmin = true)
        {
            _AllowSuperAdmin = AllowSuperAdmin;
        }
        //public CompanyBaseAuthAttribute(UserManager<Models.User> userManager,
        //    ICompanyId companyId = null, string userId = null)
        //{
        //    _CompanyService = companyService;
        //    _UserManager = userManager;
        //    _CompanyId = companyId;
        //    _UserId = userId;
        //}

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var controller = context.Controller as Controller;
            string url = context.HttpContext.Request.Path.ToString().ToLower();
            var callerContext = (controller as NewBaseController)?.Caller;
            var user = context.HttpContext.User;

            _UserManager = controller.HttpContext.RequestServices.GetService(typeof(UserManager<Models.User>)) as UserManager<Models.User>;
            _CompanyService = controller.HttpContext.RequestServices.GetService(typeof(ICompanyService)) as ICompanyService;

            if (!url.Contains("downloadcompanyprofileimage"))
            {
                var modelUser = await _UserManager.FindByEmailAsync(user.Identity.Name);
                if (await _UserManager.IsInRoleAsync(modelUser, "Admin") || _AllowSuperAdmin)
                {
                    context.RouteData.DataTokens.TryAdd("modelUser", modelUser);
                    var company = callerContext?.CurrentUserCompany ?? await _CompanyService.GetByAdminUser(modelUser);
                    if (user.IsInRole("Super Admin") && _AllowSuperAdmin)
                    {
                        await next();
                        return;
                    }

                    //if (company != null && 
                    //    (company.LastTimeStripeSubscriptionChecked < DateTime.Now.AddDays(-1) || 
                    //    company.PaymentStatus == StandingOut.Data.Enums.PaymentStatus.Failed || 
                    //    company.PaymentStatus == StandingOut.Data.Enums.PaymentStatus.Cancelled))
                    //{// we have not check thier stirpe in last 24 hrs or it's failed, lets check to see if fixed
                    //    company = await _CompanyService.CheckCompanyStripe(company.CompanyId);
                    //}

                    // Models.Company company = null;
                    if (company == null)
                    { // they did not get past step 1 of registering (goto plan selection)
                        context.Result = new RedirectToActionResult("Index", "CompanyRegister", new { area = "Admin" });
                        //context.Result = new RedirectToActionResult("Process", "CompanyRegister", new { area = "Admin", id = "1b503c8e-972e-4c5f-bb81-69e74dfdf947" });
                    }
                    else if (company.InitialRegistrationComplete == false)
                    { // they need to finish regsitering
                        context.Result = new RedirectToActionResult("Process", "CompanyRegister",new { area = "Admin", id = company.StripePlanId });
                    }
                    #region Code commented because Redirection code written in ValidatePlan.cs file 
                    //else if (company.PaymentStatus != StandingOut.Data.Enums.PaymentStatus.Paid &&
                    //         !url.Contains("settings/subscriptionIssue") &&
                    //         !url.Contains("settings/subscription") &&
                    //         !url.Contains("settings/cancel"))
                    //{

                    //    // there is a problem with payment but allow them to view payment screens
                    //    context.Result = new RedirectToActionResult("SubscriptionIssue", "Settings", new { area = "Admin" });
                    //} 
                    #endregion
                    else
                    {
                        context.RouteData.DataTokens.TryAdd("modelCompany", company);
                        var resultContext = await next();
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
