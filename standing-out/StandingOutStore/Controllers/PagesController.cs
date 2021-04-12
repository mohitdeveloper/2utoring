using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutStore.Extensions;
using Models = StandingOut.Data.Models;
using System;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace StandingOutStore.Controllers
{
    public class PagesController : NewBaseController
    {
        private readonly ISettingService _SettingService;
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutorService _TutorService;
        private readonly ICompanyService _CompanyService;
        private readonly IOptions<AppSettings> _AppSettings;
        private readonly IStripeService _StripeService;
        public PagesController(ISettingService settingService, IStripeService stripeService,
        UserManager<Models.User> userManager, IOptions<AppSettings> appSettings, ITutorService tutorService, ICompanyService companyService) : base(userManager, appSettings)
        {
            _SettingService = settingService;
            _UserManager = userManager;
            _StripeService = stripeService;
            _AppSettings = appSettings;
            _TutorService = tutorService;
            _CompanyService = companyService;
        }

        public async Task<IActionResult> AcceptableUse()
        {
            return View();
        }

        public async Task<IActionResult> CookiePolicy()
        {
            return View();
        }

        public async Task<IActionResult> PrivacyPolicy()
        {
            return View();
        }

        public async Task<IActionResult> TermsAndConditions()
        {
            return View();
        }



        public async Task<IActionResult> TermsOfUse()
        {
            return View();
        }
        public async Task<IActionResult> OnlineSafetySafeguarding()
        {
            return View();
        }
        public async Task<IActionResult> SafeguardingPolicy()
        {
            return View();
        }





        public async Task<IActionResult> BecomeATutor()
        {
            var settings = await _SettingService.Get();
            ViewBag.BaseClassSessionCommision = settings.BaseClassSessionCommision;
            if (User.Identity.IsAuthenticated)
            {
                if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
                    ViewBag.ShowBecomeTutorLinks = true;
                else if (User.IsInRole("Admin") || User.IsInRole("Super Admin"))
                    ViewBag.ShowBecomeTutorLinks = false;
                else
                {
                    var user = await _UserManager.FindByNameAsync(User.Identity.Name);
                    ViewBag.ShowBecomeTutorLinks = !user.IsSetupComplete;
                }
            }
            else
                ViewBag.ShowBecomeTutorLinks = true;
            return View();
        }

        public async Task<IActionResult> JoinAsACompany()
        {
            var settings = await _SettingService.Get();
            ViewBag.BaseClassSessionCommision = settings.BaseClassSessionCommision;
            if (User.Identity.IsAuthenticated)
            {
                if (Caller.IsAdmin)
                    ViewBag.ShowBecomeCompanyLinks = true;
                else if (User.IsInRole("Admin") || User.IsInRole("Super Admin"))
                    ViewBag.ShowBecomeCompanyLinks = false;
                else
                {
                    var user = await _UserManager.FindByNameAsync(User.Identity.Name);
                    ViewBag.ShowBecomeCompanyLinks = !Caller.CurrentUser.IsSetupComplete;
                }
            }
            else
                ViewBag.ShowBecomeCompanyLinks = true;
            return View();
        }

        public async Task<IActionResult> CancellationForm()
        {
            return View();
        }

        public async Task<IActionResult> ClassroomSellingPage()
        {
            //return RedirectToRoute("Default", new { controller = "Home", action = "Index"});


            var settings = await _SettingService.Get();
            ViewBag.BaseClassSessionCommision = settings.BaseClassSessionCommision;
            if (User.Identity.IsAuthenticated)
            {
                if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
                    ViewBag.ShowBecomeTutorLinks = true;
                else if (User.IsInRole("Admin") || User.IsInRole("Super Admin"))
                    ViewBag.ShowBecomeTutorLinks = false;
                else
                {
                    var user = await _UserManager.FindByNameAsync(User.Identity.Name);
                    ViewBag.ShowBecomeTutorLinks = !user.IsSetupComplete;
                }
            }
            else
                ViewBag.ShowBecomeTutorLinks = true;
            return View();
        }


        public async Task<IActionResult> IDVerification()
        {
            bool isUpdate = false;
            if (User.Identity.IsAuthenticated)
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                var settings = await _StripeService.GetSetting();

                if (Caller.IsAdmin)
                {
                    var company = await _CompanyService.GetByAdminUser(user);
                    if (company != null && company.StripeConnectAccountId != null && company.InitialRegistrationComplete)
                    {
                        bool status = await GetPayoutResponse(company.StripeConnectAccountId, settings.StripeKey);
                        if (status)
                        {
                            isUpdate = await _CompanyService.UpdateIdVerificationStauts(company.CompanyId, status);
                        }
                    }
                }
                else if (Caller.IsTutor)
                {
                    var currentCompany = await _TutorService.GetCurrentCompany(user);
                    if (currentCompany == null)
                    {
                        var tutor = await _TutorService.GetById(Guid.Parse(user.TutorId.ToString()));
                        if (tutor != null && tutor.StripeConnectAccountId != null && tutor.InitialRegistrationComplete)
                        {
                            bool status = await GetPayoutResponse(tutor.StripeConnectAccountId, settings.StripeKey);
                            if (status)
                            {
                                isUpdate = await _TutorService.UpdateIdVerificationStauts(tutor.TutorId, status);
                            }
                        }
                    }
                }
                
            }
            return Ok(isUpdate);
        }

        public async Task<bool> GetPayoutResponse(string acid, string stripeKey)
        {
            bool status = false;
            // Create a request for the URL. 		
            WebRequest request = WebRequest.Create("https://api.stripe.com/v1/accounts/" + acid);
            // If required by the server, set the credentials.
            request.Headers.Add("Authorization", "Bearer " + stripeKey);
            request.Credentials = CredentialCache.DefaultCredentials;
            request.Method = "GET";
            request.ContentType = "application/json; charset=utf-8";
            // Get the response.
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            // Display the status.
            //Console.WriteLine(response.StatusDescription);
            // Get the stream containing content returned by the server.
            Stream dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.
            string responseFromServer = reader.ReadToEnd();
            //var JsonObj= JsonConvert.DeserializeObject<dynamic>(reader.ReadToEnd());
            dynamic data = JObject.Parse(responseFromServer);
            //((Newtonsoft.Json.Linq.JValue)data.payouts_enabled).Value
            status = data.payouts_enabled.Value;
            // Cleanup the streams and the response.
            reader.Close();
            dataStream.Close();
            return status;
        }
    }
}
