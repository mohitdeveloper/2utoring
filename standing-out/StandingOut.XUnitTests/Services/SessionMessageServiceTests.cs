using StandingOut.Business.Services;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using StandingOut.Data.Sample;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace StandingOut.XUnitTests.Services
{
    public class SessionMessageServiceTests
    {
        private AppSettings _AppSettings = new AppSettings()
        {
            AppDataFolderDirectory = @"C:\",
            ContentFolderDirectory = @"C:\",
            MainSiteUrl = "Test"
        };
               
        [Fact]
        public async Task Get()
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
                    ISessionMessageService _Service = new SessionMessageService(_UnitOfWork, _AppSettings);
                                       
                    var item = await _Service.Get();
                    Assert.True(item.Count() >= 0);
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
        public async Task GetById()
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
                    ISessionMessageService _Service = new SessionMessageService(_UnitOfWork, _AppSettings);

                    var firstItem = context.SessionMessages.FirstOrDefault();

                    if(firstItem != null)
                    {
                        var item = await _Service.GetById(firstItem.SessionMessageId);
                        Assert.True(item != null);
                    }                    
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

        [Fact]
        public async Task Delete()
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
                    ISessionMessageService _Service = new SessionMessageService(_UnitOfWork, _AppSettings);

                    var firstItem = context.SessionMessages.FirstOrDefault();

                    if (firstItem != null)
                    {
                        await _Service.Delete(firstItem.SessionMessageId);
                        Assert.True(true);
                    }
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

