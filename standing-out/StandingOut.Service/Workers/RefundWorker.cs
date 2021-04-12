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
    public class RefundWorker : BackgroundService
    {
        private readonly ILogger<RefundWorker> _logger;
        private readonly int _Interval;
        private readonly IUnitOfWork _UnitOfWork;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly DateTimeOffset _StartTime;
        public RefundWorker(ILogger<RefundWorker> logger, IUnitOfWork unitOfWork, ISessionAttendeeService sessionAttendeeService)
        {
            _logger = logger;

            _StartTime = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day, 3, 15, 0);
            _StartTime = _StartTime.AddDays(1);
            _Interval = Convert.ToInt32(ServiceUtilities.CalculateRunInterval(0, 0, 24));

            //_Interval = Convert.ToInt32(ServiceUtilities.CalculateRunInterval(0, 3, 0));

            _UnitOfWork = unitOfWork;
            _SessionAttendeeService = sessionAttendeeService;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {

            while (!stoppingToken.IsCancellationRequested)
            {
                await EventLogger.LogMessage("", _logger, $"Refund Worker Running At: {DateTimeOffset.Now.ToString("dd/MM/yyyy hh:mm")}", System.Diagnostics.EventLogEntryType.Information);
                try
                {
                    await DoRefundAsync(stoppingToken);
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

        private async Task DoRefundAsync(CancellationToken stoppingToken)
        {
            try
            {
                if (stoppingToken.IsCancellationRequested) return;
                var sessionList = await _UnitOfWork.Repository<Models.ClassSession>()
                    .Get(x => x.Refunded == false && x.Started == false && x.Ended == false && x.Complete == false
                    && DateTime.Now.ToUniversalTime() > x.StartDate.AddMinutes(15).UtcDateTime, includeProperties: "SessionAttendees");
                if (sessionList.Count > 0)
                {
                    foreach (var item in sessionList)
                    {
                        if (item.SessionAttendees.Count > 0)
                        {
                            foreach (var attendee in item.SessionAttendees)
                            {
                                if (attendee.Refunded == false)
                                {
                                    await _SessionAttendeeService.Refund(item.ClassSessionId, attendee.SessionAttendeeId);
                                }
                            }
                            item.Refunded = true;
                        }
                        
                        item.Cancel = true;
                        await _UnitOfWork.Repository<Models.ClassSession>().Update(item);
                    }
                    await EventLogger.LogMessage("", _logger, $"Refunde Worker Completed At: {DateTimeOffset.Now.ToString("dd/MM/yyyy hh:mm")}", System.Diagnostics.EventLogEntryType.Information);
                }
                else
                {
                    await EventLogger.LogMessage("", _logger, $"Refunde Worker No Action Taken", System.Diagnostics.EventLogEntryType.Information);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        }


    }
}
