using System;
using System.Collections.Generic;
using StandingOut.Business.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using StandingOut.Extensions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace StandingOut.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/classroom/ClassSessionVideoRooms")]
    public class ClassSessionVideoRoomsController : BaseController
    {
        private readonly IClassSessionVideoRoomService _ClassSessionVideoRoomService;
        private readonly UserManager<Models.User> _UserManager;

        public ClassSessionVideoRoomsController(IClassSessionVideoRoomService classSessionVideoRoomService, UserManager<Models.User> userManager)
        {
            _ClassSessionVideoRoomService = classSessionVideoRoomService;
            _UserManager = userManager;
        }
        
        [HttpGet("")]
        [ProducesResponseType(typeof(IEnumerable<DTO.ClassSessionVideoRoom>), 200)]
        public async Task<IActionResult> Get()
        {
            try
            {
                var ClassSessionVideoRooms = await _ClassSessionVideoRoomService.Get();
                return Ok(Mappings.Mapper.Map<List<Models.ClassSessionVideoRoom>, List<DTO.ClassSessionVideoRoom>>(ClassSessionVideoRooms));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.ClassSessionVideoRoom), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var model = await _ClassSessionVideoRoomService.GetById(id);
                return Ok(Mappings.Mapper.Map<Models.ClassSessionVideoRoom, DTO.ClassSessionVideoRoom>(model));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.ClassSessionVideoRoom), 200)]
        public async Task<IActionResult> Post([FromBody]DTO.ClassSessionVideoRoom classSessionVideoRoom)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _UserManager.FindByNameAsync(User.Identity.Name);
                classSessionVideoRoom.UserId = user.Id;
                var model = await _ClassSessionVideoRoomService.Create(Mappings.Mapper.Map<DTO.ClassSessionVideoRoom, Models.ClassSessionVideoRoom>(classSessionVideoRoom));
                return Ok(Mappings.Mapper.Map<Models.ClassSessionVideoRoom, DTO.ClassSessionVideoRoom>(model));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DTO.ClassSessionVideoRoom), 200)]
        public async Task<IActionResult> Put(Guid id, [FromBody]DTO.ClassSessionVideoRoom ClassSessionVideoRoom)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if(id != ClassSessionVideoRoom.ClassSessionVideoRoomId)
                {
                    return BadRequest();
                }

                var model = await _ClassSessionVideoRoomService.Update(Mappings.Mapper.Map<DTO.ClassSessionVideoRoom, Models.ClassSessionVideoRoom>(ClassSessionVideoRoom));
                return Ok(Mappings.Mapper.Map<Models.ClassSessionVideoRoom, DTO.ClassSessionVideoRoom>(model));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _ClassSessionVideoRoomService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }
    }
}
