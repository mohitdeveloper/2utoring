using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StandingOut.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Data;
using System.Data.SqlClient;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Business.Services;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Logging;
using StandingOut.Filters.GlobalException;
using Models = StandingOut.Data.Models;
using StandingOut.Data.Sample;
using Microsoft.AspNetCore.Authentication;
using StandingOut.Business.Helpers.AcuityScheduling;
using StandingOut.Shared.Helpers.GoogleHelper;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Hosting;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.DataProtection;
using System.IO;
using StandingOut.Shared.Helpers.AzureFileHelper;
using StandingOut.Shared.Helpers.Twilio;
using IdentityModel.Client;
using System.Net.Http;
using ssbs = StandingOutStore.Business.Services;
using ssbsi = StandingOutStore.Business.Services.Interfaces;

namespace StandingOut
{
    public class Startup
    {
        public Startup(IWebHostEnvironment env, IConfiguration configuration)
        {
            Configuration = configuration;
            _Env = env;

            NReco.PdfRenderer.License.SetLicenseKey(
                "PDF_Renderer_Bin_Pack_250242938557",
                "VcCe2SuAyUem6Pd8xDAVX4r0LHqlquriwZzeK7VcV9+VjUotZUSurQ9WQQu96qTDIE1An9UlEiusMTKj5c5lJ7mrAbHK5SpoGJJyQ4q8cusEBoaQQvb8Dv+cQ63l0ab2CFu3SqNNhD8xaeXSGsY1VHujVfgyZKoYc/J+Df8Owgw="
            );
        }

        private readonly IWebHostEnvironment _Env;
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            //db creation
            services.AddDbContextPool<DbEntities>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("BaseProject.Data")));

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

            //our services
            services.AddScoped<IErrorLogService, ErrorLogService>();
            services.AddScoped<IClassSessionService, ClassSessionService>();
            services.AddScoped<IClassSessionVideoRoomService, ClassSessionVideoRoomService>();
            services.AddScoped<ISafeguardReportService, SafeguardReportService>();
            services.AddScoped<ISessionAttendeeService, SessionAttendeeService>();
            services.AddScoped<ISessionGroupService, SessionGroupService>();
            services.AddScoped<ISessionMediaService, SessionMediaService>();
            services.AddScoped<ISessionMessageService, SessionMessageService>();
            services.AddScoped<ISessionWhiteBoardService, SessionWhiteBoardService>();
            services.AddScoped<ITutorService, TutorService>();
            services.AddScoped<ISettingService, SettingService>();
            services.AddScoped<ISystemToolService, SystemToolService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ISessionDocumentService, SessionDocumentService>();
            services.AddScoped<IManagementInfoService, ManagementInfoService>();

            services.AddScoped<ssbsi.ISessionAttendeeService, ssbs.SessionAttendeeService>();
            services.AddScoped<ssbsi.ITutorSubscriptionService, ssbs.TutorSubscriptionService>();
            services.AddScoped<ssbsi.ICompanySubscriptionService, ssbs.CompanySubscriptionService>();
            services.AddScoped<ssbsi.ICompanyService, ssbs.CompanyService>();
            services.AddScoped<ssbsi.IStripePlanService, ssbs.StripePlanService>();

            services.AddScoped<ssbsi.ITutorService, ssbs.TutorService>();
            services.AddScoped<ICompanyTutorService, CompanyTutorService>();
            services.AddScoped<ISearchService, SearchService>();
            services.AddScoped<IHubService, HubService>();
            services.AddScoped<IJWTService, JWTService>();

            services.AddScoped<ssbsi.IClassSessionService, ssbs.ClassSessionService>();
            services.AddScoped<ssbsi.ISubscriptionFeatureService, ssbs.SubscriptionFeatureService>();
            services.AddScoped<ssbsi.IClassSessionSubscriptionFeatureService, ssbs.ClassSessionSubscriptionFeatureService>();
            services.AddScoped<ssbsi.ITutorSubscriptionFeatureService, ssbs.TutorSubscriptionFeatureService>();
            services.AddScoped<ssbsi.ICompanySubscriptionFeatureService, ssbs.CompanySubscriptionFeatureService>();
            services.AddScoped<ssbsi.ISessionAttendeeService, ssbs.SessionAttendeeService>();
            services.AddScoped<ssbsi.IVendorEarningService, ssbs.VendorEarningService>();

            // our helpers
            services.AddScoped<ITwilioHelper, TwilioHelper>();
            services.AddScoped<IAcuitySchedulingHelper, AcuitySchedulingHelper>();
            services.AddScoped<IGoogleHelper, GoogleHelper>();
            services.AddScoped<IAzureFileHelper, AzureFileHelper>();


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

            if (!_Env.IsDevelopment())
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

            services.AddControllersWithViews(config =>
            {
                config.Filters.Add(typeof(GlobalExceptionFilter));
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
           .AddRazorRuntimeCompilation()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

            services.AddHttpClient();
            services.AddSingleton<IDiscoveryCache>(r =>
            {
                var factory = r.GetRequiredService<IHttpClientFactory>();
                return new DiscoveryCache(Configuration["IdentityServer:authority"], () => factory.CreateClient());
            });

            services.AddRouting(options => options.LowercaseUrls = true);

            JwtSecurityTokenHandler.DefaultMapInboundClaims = false;
            //JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = "Cookies";
                options.DefaultChallengeScheme = "oidc";
            })
                .AddCookie("Cookies", options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.LoginPath = new PathString("/Account/Login/");
                    options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                    options.Cookie.Name = Configuration["IdentityServer:cookie_name"];

                    options.TicketDataFormat = ticketFormat;

                    if (Configuration["IdentityServer:cookie_domain"] != "testSite")
                    {
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
                //app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCookiePolicy();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseResponseCompression();

            app.UseEndpoints(endpoints =>
            {
                // CUSTOM CLASSROOM ROUTING
                endpoints.MapControllerRoute(
                    "ClassroomMain",
                   "c/{id}",
                   new { area = "Classroom", controller = "Sessions", action = "Main" }
                 );
                endpoints.MapControllerRoute(
                    "ClassroomComplete",
                   "f/{id}",
                   new { area = "Classroom", controller = "Sessions", action = "Complete" }
                 );

                //area routing, should handle every area by default
                endpoints.MapControllerRoute(
                    name: "areaRoute",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
                );


                endpoints.MapControllerRoute(name: "sessionSetup", pattern: "/Session/{classSessionId}/{controller=Setup}/{action=Index}/{id?}");

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller:exists=Home}/{action=Index}/{id?}");

                endpoints.MapControllerRoute(
                    name: "cms",
                    pattern: "{action=Index}",
                    defaults: new { controller = "Home" });
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
