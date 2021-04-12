using StandingOut.Business.Services;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using StandingOut.Data.Sample;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;
using Models = StandingOut.Data.Models;

namespace StandingOut.XUnitTests.Services
{
    public class ErrorLogServiceTests
    {
        private AppSettings _AppSettings = new AppSettings()
        {
            AppDataFolderDirectory = @"C:\",
            ContentFolderDirectory = @"C:\",
            MainSiteUrl = "Test"
        };

        [Fact]
        public async Task Log()
        {
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            try
            {
                var options = new DbContextOptionsBuilder<DbEntities>()
                    .UseSqlite(connection)
                    .Options;

                

                //setup and the run test
                using (var context = new DbEntities(options))
                {
                    //setup sample data and services required for testing
                    SampleData.InitializeSeedData(context);
                    IUnitOfWork _UnitOfWork = new UnitOfWork(context, null, null);
                    IErrorLogService _Service = new ErrorLogService(_UnitOfWork, _AppSettings);

                    var error = new Models.ErrorLog()
                    {
                        Path = "test",
                        Message = "test",
                        InnerException = "test",
                        StackTrace = "test",
                        InnerStackTrace = "test",
                        LogDate = DateTime.Now
                    };


                    var item = await _Service.Log(error);
                    Assert.True(item != null);
                }
            }
            catch(Exception ex)
            {
                string stop = ex.Message;
                Assert.False(true);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public async Task ClearLogs()
        {
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            try
            {
                var options = new DbContextOptionsBuilder<DbEntities>()
                    .UseSqlite(connection)
                    .Options;

                //setup and the run test
                using (var context = new DbEntities(options))
                {
                    //setup sample data and services required for testing
                    SampleData.InitializeSeedData(context);
                    IUnitOfWork _UnitOfWork = new UnitOfWork(context, null, null);
                    IErrorLogService _Service = new ErrorLogService(_UnitOfWork, _AppSettings);

                    await _Service.ClearLogs();
                    Assert.True(true);
                }
            }
            catch (Exception ex)
            {
                string stop = ex.Message;
                Assert.False(true);
            }
            finally
            {
                connection.Close();
            }
        }

    }
}
