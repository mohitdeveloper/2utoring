using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using System.Linq;
using System.Threading;
using Microsoft.Extensions.Logging;
using StandingOut.Data.DTO;
using StandingOut.Data.Enums;
using StandingOut.Data;

namespace StandingOutStore.Controllers.api
{
    [Produces("application/json")]
    [Route("api/CoureRemove")]
    public class CoureRemoveServiceController : ControllerBase
    {
        private readonly IUnitOfWork _UnitOfWork;
        public CoureRemoveServiceController(IUnitOfWork unitOfWork)
        {
            _UnitOfWork = unitOfWork;
        }


        [HttpGet("runRemove")]
        public async Task DoCleanUpAsync()
        {
            var StudentParentCourse = await _UnitOfWork.Repository<Models.Course>().Get(x => x.UniqueNumber != null, includeProperties: "ClassSessions");
            foreach (var item in StudentParentCourse)
            {
                var IsCoursePurchase = await _UnitOfWork.Repository<Models.OrderItem>().GetSingle(x => x.CourseId == item.CourseId);
                if (IsCoursePurchase == null)
                {
                    if (item.StartDate.Value.UtcDateTime >= DateTime.Now.AddMinutes(15).ToUniversalTime())
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
        }

    }
}


