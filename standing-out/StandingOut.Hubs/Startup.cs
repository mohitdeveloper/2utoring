using System;
using System.Collections.Generic;
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
using StandingOut.Hubs.Hubs;
using Models = StandingOut.Data.Models;
using Microsoft.AspNetCore.Authentication;
using System.Data;
using System.Data.SqlClient;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Business.Services;
using StandingOut.Shared.Helpers.GoogleHelper;
using Microsoft.AspNetCore.DataProtection;
using System.IO;
using StandingOut.Shared.Helpers.AzureFileHelper;
using IdentityServer4.AccessTokenValidation;
using IdentityModel.AspNetCore.OAuth2Introspection;
using Microsoft.AspNetCore.SignalR;
using StandingOut.Hubs.Providers;
using System.Text.Json;
using System.Text.Json.Serialization;
using StandingOut.Hubs.Filters.GlobalException;
using ssbsi = StandingOutStore.Business.Services.Interfaces;
using ssbs = StandingOutStore.Business.Services;
using Stripe;
using StandingOut.Data.Models;

namespace StandingOut.Hubs
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
        List<string> origins = new List<string>
        {
            "https://classroom.2utoring.com",
            "https://testclassroom.2utoring.com",
        };

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            if (_Env.IsDevelopment())
            {
                origins.Add("https://localhost:44316");
            }

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.WithOrigins(origins.ToArray());
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                    builder.AllowCredentials();
                });
            });


            //db creation
            services.AddDbContextPool<DbEntities>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("BaseProject.Data")));

            var _Builder = new DbContextOptionsBuilder<DbEntities>();
            _Builder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));

            //add Scoped Services
            services.AddScoped<DbEntities>(_ => new DbEntities(_Builder.Options));
            services.AddScoped<IDbConnection, SqlConnection>(_ => new SqlConnection(Configuration.GetConnectionString("DefaultConnection")));
            services.AddHttpContextAccessor();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            //our services
            services.AddScoped<ISessionWhiteBoardService, SessionWhiteBoardService>();
            services.AddScoped<ISessionAttendeeService, SessionAttendeeService>();
            services.AddScoped<IClassSessionService, ClassSessionService>();
            services.AddScoped<ISessionGroupService, SessionGroupService>();
            services.AddScoped<ISessionMediaService, SessionMediaService>();
            services.AddScoped<ISessionDocumentService, SessionDocumentService>();
            services.AddScoped<ISessionMessageService, SessionMessageService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ISettingService, SettingService>();
            services.AddScoped<IErrorLogService, ErrorLogService>();

            services.AddScoped<ssbsi.IClassSessionService, ssbs.ClassSessionService>();
            services.AddScoped<ssbsi.ISubscriptionFeatureService, ssbs.SubscriptionFeatureService>();
            services.AddScoped<ssbsi.IClassSessionSubscriptionFeatureService, ssbs.ClassSessionSubscriptionFeatureService>();
            services.AddScoped<ssbsi.ITutorSubscriptionFeatureService, ssbs.TutorSubscriptionFeatureService>();
            services.AddScoped<ssbsi.ICompanySubscriptionFeatureService, ssbs.CompanySubscriptionFeatureService>();

            // our helpers
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

            services.AddControllers(config =>
            {
                config.Filters.Add(typeof(GlobalExceptionFilter));
            })
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
                    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });



            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
                .AddIdentityServerAuthentication(options =>
                {
                    options.Authority = Configuration["IdentityServer:authority"];
                    options.RequireHttpsMetadata = false;
                    options.ApiName = "Classroom";
                    options.TokenRetriever = new Func<HttpRequest, string>(req =>
                    {
                        var fromHeader = TokenRetrieval.FromAuthorizationHeader();
                        var fromQuery = TokenRetrieval.FromQueryString();
                        return fromHeader(req) ?? fromQuery(req);
                    });
                });



            services.AddSingleton<IUserIdProvider, UserIdProvider>();
            services.AddSignalR(options => 
            { 
                options.MaximumReceiveMessageSize = Int32.MaxValue; 
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
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors("AllowAll");
            app.UseCookiePolicy();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseResponseCompression();

            app.UseEndpoints(endpoints =>
            {
                //endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/hubs/chat", options => { options.ApplicationMaxBufferSize = Int32.MaxValue; });
                endpoints.MapHub<WhiteboardHub>("/hubs/whiteboard", options => { options.ApplicationMaxBufferSize = Int32.MaxValue; });
                endpoints.MapHub<TutorCommandHub>("/hubs/tutorCommand", options => { options.ApplicationMaxBufferSize = Int32.MaxValue; });


                endpoints.MapControllerRoute(
                   "Default",
                  "{controller=Home}/{action=Index}/{id?}"
                );
            });
        }
    }
}
