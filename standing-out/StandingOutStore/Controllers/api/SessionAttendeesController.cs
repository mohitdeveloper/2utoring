
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/SessionAttendees")]
    public class SessionAttendeesController : Controller
    {
        private readonly ISessionAttendeeService _SessionAttendeeService;

        public SessionAttendeesController(ISessionAttendeeService sessionAttendeeService)
        {
            _SessionAttendeeService = sessionAttendeeService;
        }            
   
        [HttpGet("getUniqueByOwner/{id}/{cid}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> GetUniqueByOwner(string id,Guid cid)
        {
            var sessionAttendees = await _SessionAttendeeService.GetUniqueByOwner(id,cid);
            return Ok(Mappings.Mapper.Map<List<Models.SessionAttendee>, List<DTO.SessionAttendee>>(sessionAttendees));
        }

        [HttpPost("Paged/{classSessionId}")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.ClassSession>), 200)]
        public async Task<IActionResult> Paged(Guid classSessionId, [FromBody]DTO.SearchModel model)
        {
            var sessionAttendees = await _SessionAttendeeService.GetPaged(model, classSessionId);
            return Ok(sessionAttendees);
        }

        [HttpGet("remove/{classSessionId}/{sessionAttendeeId}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> Remove(Guid classSessionId, Guid sessionAttendeeId)
        {
            await _SessionAttendeeService.Remove(classSessionId, sessionAttendeeId);
            return Ok();
        }

        [HttpGet("undoRemove/{classSessionId}/{sessionAttendeeId}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> UndoRemove(Guid classSessionId, Guid sessionAttendeeId)
        {
            await _SessionAttendeeService.UndoRemove(classSessionId, sessionAttendeeId);
            return Ok();
        }

        [HttpGet("refund/{classSessionId}/{sessionAttendeeId}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> Refund(Guid classSessionId, Guid sessionAttendeeId)
        {
            var result = await _SessionAttendeeService.Refund(classSessionId, sessionAttendeeId);
            return Ok(result);
        }

        [HttpGet("refundStudent/{classSessionId}/{sessionAttendeeId}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> RefundStudentInitiated(Guid classSessionId, Guid sessionAttendeeId)
        {
            var result = await _SessionAttendeeService.Refund(classSessionId, sessionAttendeeId, true);
            return Ok(result);
        }


        #region this is cancel lesson and refund service code for testing
        //[AllowAnonymous]
        //[HttpGet("RefundInitiated")]
        //public async Task<IActionResult> RefundInitiated()
        //{
        //    await _SessionAttendeeService.RefundInitiated();
        //    return Ok(true);
        //} 
        #endregion
    }
}