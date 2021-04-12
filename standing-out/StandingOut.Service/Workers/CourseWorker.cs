using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StandingOut.Data;
using StandingOutStore.Business.Services.Interfaces;
using Models = StandingOut.Data.Models;
using StandingOut.Data.DTO;

namespace StandingOut.Service.Workers
{
    public class CourseWorker : BackgroundService
    {
        private readonly ILogger<CourseWorker> _logger;
        private readonly int _Interval;
        private readonly IUnitOfWork _UnitOfWork;
        public CourseWorker(ILogger<CourseWorker> logger, IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _Interval = Convert.ToInt32(ServiceUtilities.CalculateRunInterval(0, 15, 0));
            _UnitOfWork = unitOfWork;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            
            while (!stoppingToken.IsCancellationRequested)
            {
                await EventLogger.LogMessage("", _logger, $"Course cleaner running at: {DateTimeOffset.Now.ToString("dd/MM/yyyy hh:mm")}", System.Diagnostics.EventLogEntryType.Information);
                try
                {
                    await DoCleanUpAsync(stoppingToken);
                }
                catch (Exception courseErrorEx)
                {
                    _logger.LogError(courseErrorEx, courseErrorEx.Message);

                    string message = $"Message: {courseErrorEx.Message} - Stack Trace: {courseErrorEx.StackTrace}";

                    if (courseErrorEx.InnerException != null)
                    {
                        message += $" - Inner Message: {courseErrorEx.InnerException.Message} - Inner Stack Trace: {courseErrorEx.InnerException.StackTrace}";
                    }

                    throw courseErrorEx; //break out because something went wrong, io need to know Logger deals with this.
                }


                //this must always be at the bottom
                await Task.Delay(_Interval, stoppingToken);
            }
        }

        private async Task DoCleanUpAsync(CancellationToken stoppingToken)
        {
            try
            {
                if (stoppingToken.IsCancellationRequested) return;
                var StudentParentCourse = await _UnitOfWork.Repository<Models.Course>().Get(x => x.UniqueNumber != null, includeProperties: "ClassSessions");
                foreach (var item in StudentParentCourse)
                {
                    var IsCoursePurchase = await _UnitOfWork.Repository<Models.OrderItem>().GetSingle(x => x.CourseId == item.CourseId);
                    if (IsCoursePurchase == null)
                    {
                        if (item.CreatedDate.Value.AddMinutes(15).ToUniversalTime() >= DateTime.Now.ToUniversalTime())
                        {
                            foreach (var cls in item.ClassSessions)
                            {
                                var sessionInvite = await _UnitOfWork.Repository<Models.SessionInvite>().Get(x => x.ClassSessionId == cls.ClassSessionId);
                                if (sessionInvite.Count > 0)
                                {
                                    await _UnitOfWork.Repository<Models.SessionInvite>().Delete(sessionInvite);
                                }
                            }
                            await _UnitOfWork.Repository<Models.ClassSession>().Delete(item.ClassSessions);
                            await _UnitOfWork.Repository<Models.Course>().Delete(item);
                        }
                    }
                }
                await EventLogger.LogMessage("", _logger, $"Course cleaner completed at: {DateTimeOffset.Now.ToString("dd/MM/yyyy hh:mm")}", System.Diagnostics.EventLogEntryType.Information);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        }


    }
}
