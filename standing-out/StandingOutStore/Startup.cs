using System;
using System.Data;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StandingOut.Data;
using StandingOut.Data.Sample;
using StandingOutStore.Business.Services;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Filters.GlobalException;
using Models = StandingOut.Data.Models;
using Microsoft.AspNetCore.DataProtection;
using System.IO;
using Microsoft.AspNetCore.Authentication;
using StandingOut.Business.Services;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Shared.Helpers.AzureFileHelper;
using StandingOut.Shared.Helpers.GoogleHelper;
using StandingOut.Shared.Helpers.Twilio;
using ClassSessionService = StandingOutStore.Business.Services.ClassSessionService;
using ClassSessionVideoRoomService = StandingOutStore.Business.Services.ClassSessionVideoRoomService;
using ErrorLogService = StandingOutStore.Business.Services.ErrorLogService;
using IClassSessionService = StandingOutStore.Business.Services.Interfaces.IClassSessionService;
using IClassSessionVideoRoomService = StandingOutStore.Business.Services.Interfaces.IClassSessionVideoRoomService;
using IErrorLogService = StandingOutStore.Business.Services.Interfaces.IErrorLogService;
using ISessionAttendeeService = StandingOutStore.Business.Services.Interfaces.ISessionAttendeeService;
using ISessionDocumentService = StandingOutStore.Business.Services.Interfaces.ISessionDocumentService;
using ISessionGroupService = StandingOutStore.Business.Services.Interfaces.ISessionGroupService;
using ISessionMediaService = StandingOutStore.Business.Services.Interfaces.ISessionMediaService;
using ISettingService = StandingOutStore.Business.Services.Interfaces.ISettingService;
using ITutorService = StandingOutStore.Business.Services.Interfaces.ITutorService;
using IUserService = StandingOutStore.Business.Services.Interfaces.IUserService;
using SessionAttendeeService = StandingOutStore.Business.Services.SessionAttendeeService;
using SessionDocumentService = StandingOutStore.Business.Services.SessionDocumentService;
using SessionGroupService = StandingOutStore.Business.Services.SessionGroupService;
using SessionMediaService = StandingOutStore.Business.Services.SessionMediaService;
using SettingService = StandingOutStore.Business.Services.SettingService;
using TutorService = StandingOutStore.Business.Services.TutorService;
using CompanyTutorService = StandingOutStore.Business.Services.CompanyTutorService;
using UserService = StandingOutStore.Business.Services.UserService;
using BusinessServices = StandingOut.Business.Services;
using ICompanyTutorService = StandingOutStore.Business.Services.Interfaces.ICompanyTutorService;
using SearchService = StandingOutStore.Business.Services.SearchService;
using ISearchService = StandingOutStore.Business.Services.Interfaces.ISearchService;
using StandingOutStore.Extensions;

namespace StandingOutStore
{
    public class Startup
    {
        public Startup(IWebHostEnvironment env, IConfiguration configuration)
        {
            Configuration = configuration;
            _env = env;
        }

        private readonly IWebHostEnvironment _env;
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // For cookie conscent
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential 
                // cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                // requires using Microsoft.AspNetCore.Http;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            //db creation
            services.AddDbContextPool<DbEntities>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("StandingOutWeb.Data")));

            var _Builder = new DbContextOptionsBuilder<DbEntities>();
            _Builder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));


            //get our appsettings and add them to scope
            var appSettings = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettings);

            //add Scoped Services
            services.AddScoped<DbEntities>(_ => new DbEntities(_Builder.Options));
            services.AddScoped<IDbConnection, SqlConnection>(_ => new SqlConnection(Configuration.GetConnectionString("DefaultConnection")));
            services.AddHttpContextAccessor();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<ITwilioHelper, TwilioHelper>();
            services.AddScoped<IGoogleHelper, GoogleHelper>();
            services.AddScoped<IAzureFileHelper, AzureFileHelper>();

            //our services
            services.AddScoped<IErrorLogService, ErrorLogService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IStripePlanService, StripePlanService>();
            services.AddScoped<IStripeCountryService, StripeCountryService>();
            services.AddScoped<ITutorService, TutorService>();
            services.AddScoped<ISearchService, SearchService>();
            services.AddScoped<ITutorAvailabilityService, TutorAvailabilityService>();
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<ISubjectService, SubjectService>();
            services.AddScoped<ISubjectCategoryService, SubjectCategoryService>();
            services.AddScoped<IStudyLevelService, StudyLevelService>();
            services.AddScoped<ITutorCertificateService, TutorCertificateService>();
            services.AddScoped<ITutorQualificationService, TutorQualificationService>();
            services.AddScoped<ITutorSubjectService, TutorSubjectService>();
            services.AddScoped<IClassSessionService, ClassSessionService>();
            services.AddScoped<ISettingService, SettingService>();
            services.AddScoped<IStripeService, StripeService>();
            services.AddScoped<ISessionAttendeeService, SessionAttendeeService>();
            services.AddScoped<IPromoCodeService, PromoCodeService>();
            services.AddScoped<ISessionMediaService, SessionMediaService>();
            services.AddScoped<ISessionInviteService, SessionInviteService>();
            services.AddScoped<ISessionDocumentService, SessionDocumentService>();
            services.AddScoped<ISafeguardingReportService, SafeguardingReportService>();
            services.AddScoped<IClassSessionVideoRoomService, ClassSessionVideoRoomService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<ISessionGroupService, SessionGroupService>();

            services.AddScoped<ITutorSubjectStudyLevelService, TutorSubjectStudyLevelService>();

            services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<ICompanySubscriptionService, CompanySubscriptionService>();
            services.AddScoped<ITutorSubscriptionService, TutorSubscriptionService>();
           services.AddScoped<ICompanySubjectService, CompanySubjectService>();
            services.AddScoped<ICompanySubjectStudyLevelService, CompanySubjectStudyLevelService>();
            services.AddScoped<ISubjectStudyLevelSetupService, SubjectStudyLevelSetupService>();
            services.AddScoped<ICompanyTutorService, CompanyTutorService>();
            services.AddScoped<BusinessServices.Interfaces.IClassSessionService, BusinessServices.ClassSessionService>();
            
            // These are now in Store.Business
            services.AddScoped<ISubscriptionFeatureService, SubscriptionFeatureService>();
            services.AddScoped<IClassSessionSubscriptionFeatureService, ClassSessionSubscriptionFeatureService>();
            services.AddScoped<ITutorSubscriptionFeatureService, TutorSubscriptionFeatureService>();
            services.AddScoped<ICompanySubscriptionFeatureService, CompanySubscriptionFeatureService>();

            services.AddScoped<ICourseInviteService, CourseInviteService>();
            services.AddScoped<IPaymentProviderFieldsetService, PaymentProviderFieldsetService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IVendorEarningService, VendorEarningService>();
            services.AddScoped<IVendorPayoutService, VendorPayoutService>();
            services.AddScoped<ICommonPublicService, CommonPublicServices>();
            services.AddScoped<INotificationMessageService, NotificationMessageService>();
            services.AddScoped<IWebsiteContactService, WebsiteContactService>();
            services.AddScoped<ITutoringPlanService, TutoringPlanService>();
            if (!_env.IsDevelopment())
            {
                services.AddHsts(options =>
                {
                    options.Preload = true;
                    options.MaxAge = TimeSpan.FromDays(30);
                });

                services.AddHttpsRedirection(options =>
                {
                    options.RedirectStatusCode = StatusCodes.Status308PermanentRedirect;
                    options.HttpsPort = 443;
                });
            }


            /*
             * Cookie Sharing
             * https://www.hanselman.com/blog/SharingAuthorizationCookiesBetweenASPNET4xAndASPNETCore10.aspx
             */
            var protectionProvider = DataProtectionProvider.Create(new DirectoryInfo(Configuration["IdentityServer:keyring"]));
            var dataProtector = protectionProvider.CreateProtector(
                    "CookieAuthenticationMiddleware",
                    "Cookie",
                    "v2");
            var ticketFormat = new TicketDataFormat(dataProtector);

            services.AddIdentityCore<Models.User>()
                .AddRoles<IdentityRole>()
                .AddUserManager<UserManager<Models.User>>()
                .AddRoleManager<RoleManager<IdentityRole>>()
                .AddEntityFrameworkStores<DbEntities>();


            //Add Auth Before MVC so it can access it
            services.AddAuthorization();

            //Add Response Compression, must be before AddMVC - https://docs.microsoft.com/en-us/aspnet/core/performance/response-compression?view=aspnetcore-2.2
            services.AddResponseCompression(options =>
            {
                options.Providers.Add<BrotliCompressionProvider>();
                options.Providers.Add<GzipCompressionProvider>();
            });

            //configure logging to console on debug
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddConfiguration(Configuration.GetSection("Logging"));
                loggingBuilder.AddConsole();
                loggingBuilder.AddDebug();
            });

            services.AddRouting(options => options.LowercaseUrls = true);

            //services.ConfigureApplicationCookie(options =>
            //{
            //    // Cookie settings
            //    options.Cookie.HttpOnly = true;


            //    options.LoginPath = new PathString("/Account/Login/");
            //    options.AccessDeniedPath = new PathString("/Account/Forbidden/");


            //    options.Cookie.Name = "StandingOut";
            //    options.LoginPath = "/Login";
            //    options.AccessDeniedPath = "/Account/Forbidden";
            //    options.SlidingExpiration = true;
            //});


            //startup MVC, add our exception system and set JSON Options to CamelCase/DateFormatting
            //AddMVC() is only really needed when you require multiple types of MVC
            //https://docs.microsoft.com/en-us/aspnet/core/migration/22-to-30?view=aspnetcore-3.0&tabs=visual-studio
            services.AddControllersWithViews(config =>
            {
                config.Filters.Add(typeof(GlobalExceptionFilter));
            })
            .AddRazorRuntimeCompilation()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

            JwtSecurityTokenHandler.DefaultMapInboundClaims = false;
            //JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = "Cookies";
                options.DefaultChallengeScheme = "oidc";
            })

                .AddCookie("Cookies", options => {
                    options.Cookie.HttpOnly = true;
                    options.LoginPath = new PathString("/Account/Login/");
                    options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                    options.Cookie.Name = Configuration["IdentityServer:cookie_name"];

                    options.TicketDataFormat = ticketFormat;

                    if (Configuration["IdentityServer:cookie_domain"] != "testSite") {
                        options.Cookie.Domain = Configuration["IdentityServer:cookie_domain"];
                    }

                })
                .AddOpenIdConnect("oidc", options =>
                {
                    options.Authority = Configuration["IdentityServer:authority"];
                    options.RequireHttpsMetadata = false;

                    options.ClientId = Configuration["IdentityServer:client_id"];
                    options.ClientSecret = Configuration["IdentityServer:client_secret"];
                    options.ResponseType = "code";

                    options.SaveTokens = true;
                    options.GetClaimsFromUserInfoEndpoint = true;
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        NameClaimType = "name",
                        RoleClaimType = "role"
                    };
                    options.Scope.Add("Classroom");
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // For useage see https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.1
                app.UseStatusCodePagesWithReExecute("/Home/StatusCode", "?code={0}");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseResponseCompression();

            //this should be last
            app.UseEndpoints(endpoints =>
            {
                // My area nice routing
                endpoints.MapControllerRoute(
                    "MyTimetable",
                   "my/timetable",
                   new { area = "My", controller = "Home", action = "Timetable" }
                 );
                endpoints.MapControllerRoute(
                    "MySafeguarding",
                   "my/safeguarding",
                   new { area = "My", controller = "Home", action = "Safeguarding" }
                 );
                endpoints.MapControllerRoute(
                    "MySettings",
                   "my/settings",
                   new { area = "My", controller = "Home", action = "Settings" }
                 );
                endpoints.MapControllerRoute(
                    "MyReceipts",
                   "my/receipts",
                   new { area = "My", controller = "Home", action = "Receipts" }
                 );

                //area router, should handle all the default routing for areas.
                endpoints.MapControllerRoute(
                    name: "areaRoute",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
                );

                //endpoints.MapControllerRoute("CompanyPlans", "company-plans", new { controller = "CompanyRegister", action = "Index", area = "Admin" });
                //endpoints.MapControllerRoute("TutorPlans", "tutor-plans", new { controller = "Register", action = "Index", area = "Tutor" });
                //endpoints.MapControllerRoute(name: "Search", pattern: "find-a-lesson/{*data}", defaults: new { controller = "Search", action = "Index" });
                endpoints.MapControllerRoute("CompanyPlans", "company-plans", new { controller = "Home", action = "Pricing" });
                endpoints.MapControllerRoute("TutorPlans", "tutor-plans", new { controller = "Home", action = "Pricing" });
                endpoints.MapControllerRoute(name: "Search", pattern: "find-a-lesson/{*data}", defaults: new { controller = "Search", action = "CourseSearch" });
                endpoints.MapControllerRoute(name: "MainSearch", pattern: "main-search/{*data}", defaults: new { controller = "Search", action = "MainSearch" });
                endpoints.MapControllerRoute(name: "TutorCourseSearch", pattern: "tutor-course-search/{*data}", defaults: new { controller = "Search", action = "TutorCourseSearch" });
                endpoints.MapControllerRoute(name: "TutorSearch", pattern: "tutor-search/{*data}", defaults: new { controller = "Search", action = "TutorSearch" });
                endpoints.MapControllerRoute(name: "CourseSearch", pattern: "course-search/{*data}", defaults: new { controller = "Search", action = "CourseSearch" });
                endpoints.MapControllerRoute(name: "MyCourse", pattern: "my-course", defaults: new { controller = "Course", action = "ParentStudentCouse" });
                endpoints.MapControllerRoute(name: "TutorIdVerification", pattern: "tutor-id-verification", defaults: new { controller = "Home", action = "GetPayoutStatus" });
                endpoints.MapControllerRoute(name: "CompanyIdVerification", pattern: "company-id-verification", defaults: new { controller = "Home", action = "GetPayoutStatus" });
                endpoints.MapControllerRoute(
                    "CompanyView",
                    "company/{id}",
                    new { controller = "Company", action = "View" }
                );

                //endpoints.MapControllerRoute(
                //    "CompanyView",
                //    "company/{urlSlug}",
                //    new { controller = "Company", action = "View" }
                //);

                //endpoints.MapControllerRoute(
                //    "TutorView",
                //    "tutor/{urlSlug}",
                //    new { controller = "Tutors", action = "View" }
                //);
                endpoints.MapControllerRoute(
                    "TutorView",
                    "tutor/{id}",
                    new { controller = "Tutors", action = "View" }
                );

                endpoints.MapControllerRoute(
                  "courseView",
                 "Invitation-course-detail/{id}",
                 new { controller = "Course", action = "View" }
               );
                endpoints.MapControllerRoute(
                 "courseDetail",
                "course-details",
                new { controller = "Course", action = "CourseDetail" }
              );
                endpoints.MapControllerRoute(
                  "StudentEnroll",
                  "course-student-enroll/{id}",
                  new { controller = "Course", action = "StudentEnroll" }
              );
                endpoints.MapControllerRoute(
                    "GuardianEnroll",
                    "course-guardian-enroll/{id}",
                    new { controller = "Course", action = "GuardianEnroll" }
                );

                // endpoints.MapControllerRoute(
                //    "CourseSignIn",
                //    "course-sign-in/{id}",
                //    new { controller = "Course", action = "CourseSignIn" }
                //);

                endpoints.MapControllerRoute(
                    "CourseSignIn",
                    "course-sign-in/{id}/{type}",
                    new { controller = "Course", action = "CourseSignIn" }
                );

                endpoints.MapControllerRoute(
                   "LessonView",
                  "lesson/{id}",
                  new { controller = "Lessons", action = "View" }
                );
                endpoints.MapControllerRoute(
                   "StudentEnroll",
                   "student-enroll/{id}",
                   new { controller = "Lessons", action = "StudentEnroll" }
               );
                endpoints.MapControllerRoute(
                    "GuardianEnroll",
                    "guardian-enroll/{id}",
                    new { controller = "Lessons", action = "GuardianEnroll" }
                );
                
               

                endpoints.MapControllerRoute("SignIn", "login", new { controller = "Home", action = "SignIn" });

                //static pages
                
                endpoints.MapControllerRoute("TermsOfUse", "terms-of-use", new { controller = "Pages", action = "TermsOfUse" });
                endpoints.MapControllerRoute("OnlineSafetySafeguarding", "online-safety-safeguarding", new { controller = "Pages", action = "OnlineSafetySafeguarding" });
                endpoints.MapControllerRoute("SafeguardingPolicy", "safeguarding-policy", new { controller = "Pages", action = "SafeguardingPolicy" });
                endpoints.MapControllerRoute("AcceptableUse", "website-acceptable-use-policy", new { controller = "Pages", action = "AcceptableUse" });
                endpoints.MapControllerRoute("CookiePolicy", "cookie-policy", new { controller = "Pages", action = "CookiePolicy" });
                endpoints.MapControllerRoute("PrivacyPolicy", "privacy-policy", new { controller = "Pages", action = "PrivacyPolicy" });
                endpoints.MapControllerRoute("TermsAndConditions", "terms-of-website-use", new { controller = "Pages", action = "TermsAndConditions" });
                //endpoints.MapControllerRoute("BecomeATutor", "join-as-a-tutor", new { controller = "Pages", action = "BecomeATutor" });
                //endpoints.MapControllerRoute("JoinAsACompany", "join-as-a-company", new { controller = "Pages", action = "JoinAsACompany" });
                endpoints.MapControllerRoute("CancellationForm", "cancellation-form", new { controller = "Pages", action = "CancellationForm" });
                endpoints.MapControllerRoute("ClassroomSellingPage", "our-virtual-classroom", new { controller = "Pages", action = "ClassroomSellingPage" });

                //interactive pages
                endpoints.MapControllerRoute("ClassRoom", "digital-classroom", new { controller = "Home", action = "ClassRoom" });
                endpoints.MapControllerRoute("ContactUs", "contact-us", new { controller = "Home", action = "ContactUs" });
                endpoints.MapControllerRoute("ContactUsComplete", "contact-us-complete", new { controller = "Home", action = "ContactUsComplete" });
                endpoints.MapControllerRoute("WaitingList", "waiting-list", new { controller = "Home", action = "WaitingList" });

                #region New Design Implements
                // Public Pages Root
                //classroom
                endpoints.MapControllerRoute("ClassRoom", "digital-classroom", new { controller = "Home", action = "ClassRoom" });
                //pricing
                endpoints.MapControllerRoute("Pricing", "pricing", new { controller = "Home", action = "Pricing" });
                //about
                endpoints.MapControllerRoute("About", "about", new { controller = "Home", action = "About" });
                //safeguarding
                endpoints.MapControllerRoute("Safeguarding", "safeguarding", new { controller = "Home", action = "Safeguarding" });

                //Tutor
                endpoints.MapControllerRoute("Overview", "tutors/overview", new { controller = "Tutors", action = "OverView" });
                endpoints.MapControllerRoute("HowItWorks", "tutors/how-it-works", new { controller = "Tutors", action = "HowItWorks" });
                endpoints.MapControllerRoute("JoinAsTutor", "tutors/join-as-tutor", new { controller = "Tutors", action = "JoinAsTutor" });

                //student & parent
                endpoints.MapControllerRoute("Overview", "students-parents/overview", new { controller = "StudentsParents", action = "OverView" });
                endpoints.MapControllerRoute("HowItWorks", "students-parents/how-it-works", new { controller = "StudentsParents", action = "HowItWorks" });

                //agencies
                endpoints.MapControllerRoute("Overview", "agencies/overview", new { controller = "Company", action = "OverView" });
                endpoints.MapControllerRoute("HowItWorks", "agencies/how-it-works", new { controller = "Company", action = "HowItWorks" });

              
                #endregion


                // company routes
                endpoints.MapControllerRoute(
                    "CompanyPlans",
                    "company/plans",
                    new { area = "Admin", controller = "CompanyRegister", action = "Index" }
                );

                // tutor routes
                endpoints.MapControllerRoute(
                   "TutorPlans",
                   "tutor/plans",
                   new { area = "Tutor", controller = "Register", action = "Index" }
                );

                endpoints.MapControllerRoute(
                   "Default",
                  "{controller=Home}/{action=Index}/{id?}"
                );
            });

            //only apply if Dev
            if (env.IsDevelopment())
            {
                //Sample Data Test
                //SampleData.InitializeSeedData(app.ApplicationServices);
                SampleData.InitializeMigrations(app.ApplicationServices);

            }
            else
            {
                //Init Migrations if in production
                SampleData.InitializeMigrations(app.ApplicationServices);
            }
        }
    }
}
