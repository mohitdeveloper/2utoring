using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Google.Apis.Drive.v3;
using IdentityServer4;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StandingOut.Data;
using StandingOutIdentity.Business.Services;
using StandingOutIdentity.Business.Services.Interfaces;
using StandingOutIdentity.Filters.GlobalException;
using StandingOutIdentity.IdentityService;
using Models = StandingOut.Data.Models;

namespace StandingOutIdentity
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
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
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
                b => b.MigrationsAssembly("StandingOut.Data")));

            var _Builder = new DbContextOptionsBuilder<DbEntities>();
            _Builder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));


            //get our appsettings and add them to scope
            var appSettings = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettings);

            //add Scoped Services
            services.AddScoped<DbEntities>(_ => new DbEntities(_Builder.Options));
            services.AddHttpContextAccessor();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            //our services
            services.AddScoped<IErrorLogService, ErrorLogService>();
            services.AddScoped<IUserService, UserService>();

            // our helpers
            //            services.AddScoped<ITwilioHelper, TwilioHelper>();


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

            var protectionProvider = DataProtectionProvider.Create(new DirectoryInfo(Configuration["IdentityServer:keyring"]));
            var dataProtector = protectionProvider.CreateProtector(
                    "CookieAuthenticationMiddleware",
                    "Cookie",
                    "v2");
            var ticketFormat = new TicketDataFormat(dataProtector);

            //inject the identity services which were in  IdentityHostingStartup
            services.AddIdentity<Models.User, IdentityRole>()
                .AddRoles<IdentityRole>()
                .AddRoleManager<RoleManager<IdentityRole>>()
                .AddDefaultTokenProviders()
                .AddEntityFrameworkStores<DbEntities>();

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;
                options.SignIn.RequireConfirmedEmail = true;
                //options.Tokens.EmailConfirmationTokenProvider = "emailconfirmation";

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // User settings.
                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = false;
            });



            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            services.AddIdentityServer(options =>
            {
                options.Endpoints.EnableDeviceAuthorizationEndpoint = false;

                options.IssuerUri = Configuration["IdentityServer:authority"];
            })
            //.AddDeveloperSigningCredential()
            .AddSigningCredential(AddCertificateFromFile())
            //Add ASP Identity 
            .AddAspNetIdentity<Models.User>()

            // this adds the config data from DB (clients, resources, CORS)
            .AddConfigurationStore(options =>
            {
                options.ConfigureDbContext = builder =>
                    builder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
                        sql => sql.MigrationsAssembly(migrationsAssembly));
            })
            // this adds the operational data from DB (codes, tokens, consents)
            .AddOperationalStore(options =>
            {
                options.ConfigureDbContext = builder =>
                    builder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
                        sql => sql.MigrationsAssembly(migrationsAssembly));

                // this enables automatic token cleanup. this is optional.
                options.EnableTokenCleanup = true;
                options.TokenCleanupInterval = 28800; // interval in seconds (default is 3600), set to every 8 hours
            })
            .AddProfileService<IdentityProfileService>();

            services.AddAuthentication().AddGoogle(googleOptions =>
            {
                googleOptions.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                googleOptions.ClientId = Configuration["GoogleApi:client_id"];
                googleOptions.ClientSecret = Configuration["GoogleApi:client_secret"];
                googleOptions.ClaimActions.MapJsonKey(ClaimTypes.GivenName, "givenName");
                googleOptions.ClaimActions.MapJsonKey(ClaimTypes.Surname, "surname");
                googleOptions.ClaimActions.MapJsonKey(ClaimTypes.Gender, "gender");

                googleOptions.Scope.Add(DriveService.Scope.Drive);
                googleOptions.AccessType = "offline";
                googleOptions.AuthorizationEndpoint += "?prompt=consent";


                googleOptions.Scope.Add("profile");


                googleOptions.SaveTokens = true;
                googleOptions.Events.OnCreatingTicket = ctx =>
                {
                    ctx.Identity.AddClaim(new Claim("picture", ctx.User.GetString("picture")));

                    List<AuthenticationToken> tokens = ctx.Properties.GetTokens() as List<AuthenticationToken>;
                    tokens.Add(new AuthenticationToken()
                    {
                        Name = "TicketCreated",
                        Value = DateTime.UtcNow.ToString()
                    });
                    ctx.Properties.StoreTokens(tokens);
                    return Task.CompletedTask;
                };
                googleOptions.Events.OnRemoteFailure = ctx =>
                {
                    ctx.Response.Redirect("https://2utoring.com");
                    ctx.HandleResponse();
                    return Task.FromResult(0);
                };
            }).AddCookie("Cookies", options => {
                options.Cookie.HttpOnly = true;
                options.LoginPath = new PathString("/Account/Login/");
                options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                options.Cookie.Name = Configuration["IdentityServer:cookie_name"];

                options.TicketDataFormat = ticketFormat;

                if (Configuration["IdentityServer:cookie_domain"] != "testSite")
                {
                    options.Cookie.Domain = Configuration["IdentityServer:cookie_domain"];
                }

            });

            //startup MVC, add our exception system and set JSON Options to CamelCase/DateFormatting
            services.AddControllersWithViews(config =>
            {
                config.Filters.Add(typeof(GlobalExceptionFilter));
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                //options.JsonSerializerOptions.Converters.Add(new Json);
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

            services.AddRouting(options => options.LowercaseUrls = true);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // this will do the initial DB population
            InitializeDatabase(app);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseIdentityServer();
            app.UseStaticFiles();
            app.UseHttpsRedirection();


            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseResponseCompression();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                   "PrivacyPolicy",
                   "privacypolicy",
                   new { controller = "Home", action = "PrivacyPolicy" }
               );

                endpoints.MapControllerRoute(
                  "Terms",
                  "termsandconditions",
                  new { controller = "Home", action = "Terms" }
              );

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                endpoints.MapControllers();

                //endpoints.MapControllerRoute(
                //    name: "default",
                //    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        public X509Certificate2 AddCertificateFromFile()
        {
            var keyFilePath = Configuration["Certificate:keyFilePath"];
            var keyFilePassword = "mS1W!5&5BS^kz6SfSFIF";

            if (File.Exists(keyFilePath))
            {
                // You can simply add this line in the Startup.cs if you don't want an extension. 
                // This is neater though ;)
                return new X509Certificate2(keyFilePath, keyFilePassword);
            }
            else
            {
                throw new Exception("Certificate Missing");
            }
        }

        private void InitializeDatabase(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();

                var context = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
                context.Database.Migrate();
                if (!context.Clients.Any())
                {
                    foreach (var client in Config.GetClients())
                    {
                        context.Clients.Add(client.ToEntity());
                    }
                    context.SaveChanges();
                }

                if (!context.IdentityResources.Any())
                {
                    foreach (var resource in Config.GetIdentityResources())
                    {
                        context.IdentityResources.Add(resource.ToEntity());
                    }
                    context.SaveChanges();
                }

                if (!context.ApiResources.Any())
                {
                    foreach (var resource in Config.GetApiResources())
                    {
                        context.ApiResources.Add(resource.ToEntity());
                    }
                    context.SaveChanges();
                }
            }
        }
    }
}
