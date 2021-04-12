using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Data;
using StandingOut.Data;
using System.Data.SqlClient;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Business.Services;
using StandingOut.Service.Workers;

namespace StandingOut.Service
{
    public class Program
    {
        public static Microsoft.Extensions.Configuration.IConfiguration Configuration { get; set; }

        public static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();

            //would be nice to have this all the time but VS doesn't have the 
            //correct permissions out the box.
            bool createEventLog = true;

#if (DEBUG)
            createEventLog = false;
#endif

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Information)
                .WriteTo.EventLog("StandingOut", manageEventSource: createEventLog)
                .CreateLogger();

            try
            {
                Log.Information("Starting Service...");
                CreateHostBuilder(args).Build().Run();
                return;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Problem starting service.");
                return;
            }
            finally
            {
                //Force write any messages in the buffer upon stopping
                Log.CloseAndFlush();
            }

        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .UseWindowsService()
                .ConfigureServices((hostContext, services) =>
                {

                    services.AddDbContextPool<DbEntities>(options =>
                        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
                        b => b.MigrationsAssembly("StandingOutWeb.Data")));

                    var _Builder = new DbContextOptionsBuilder<DbEntities>();
                    _Builder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));



                    //get our appsettings and add them to scope
                    var appSettings = Configuration.GetSection("AppSettings");
                    services.Configure<AppSettings>(appSettings);

                    ////add Scoped Services
                    services.AddTransient<DbEntities>(_ => new DbEntities(_Builder.Options));
                    services.AddTransient<IDbConnection, SqlConnection>(_ => new SqlConnection(Configuration.GetConnectionString("DefaultConnection")));
                    services.AddTransient<IUnitOfWork, UnitOfWork>();

                    services.AddTransient<IErrorLogService, ErrorLogService>();
                    services.AddTransient<ISettingService, SettingService>();
                    services.AddTransient<IStripeService, StripeService>();
                    services.AddTransient<ITutorService, TutorService>();
                    services.AddTransient<IClassSessionService, ClassSessionService>();
                    services.AddTransient<ISessionAttendeeService, SessionAttendeeService>();
                    services.AddTransient<IVendorEarningService, VendorEarningService>();
                    services.AddTransient<IVendorPayoutService, VendorPayoutService>();
                    services.AddHostedService<PayoutWorker>();
                    services.AddHostedService<RefundWorker>();
                    services.AddHostedService<CourseWorker>();
                }).UseSerilog();
        }



    }
}
