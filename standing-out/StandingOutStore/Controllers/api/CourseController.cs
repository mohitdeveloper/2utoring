using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOut.Data.Enums;
using StandingOut.Shared.Integrations.Stripe;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using StandingOutStore.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Course")]
    public class CourseController : NewBaseController
    {
        private readonly ICourseService _courseService;
        private readonly ITutorService _tutorService;
        private readonly ICompanyTutorService _companyTutorService;

        public CourseController(ICourseService courseService,ITutorService tutorService, ICompanyTutorService companyTutorService, UserManager<Models.User> userManager, IUserService userService,IOptions<AppSettings> appSettings, ICompanyService companyService) : base(userManager, appSettings, companyService)
        {
            _courseService = courseService;
            _tutorService = tutorService;
            _companyTutorService = companyTutorService;
        }

        [HttpPost("Paged")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.Course>), 200)]
        public async Task<IActionResult> Paged([FromBody] DTO.SearchModel model)
        {
            if (model == null) {
                return BadRequest();
            }
            var result = new DTO.PagedList<DTO.Course>();
            if (Caller.IsAdmin)
            {
                result = await _courseService.GetPaged(model, Caller.CurrentUserCompany.CompanyId, "Admin");
            }
            else
            {
                if (Caller.IsTutor)
                {
                    result = await _courseService.GetPaged(model, (Guid)Caller.CurrentUser.TutorId, "Tutor");
                }
            }


             return Ok(result);
        }

        
        [HttpGet("getCompanyCoureses/{id}")]
        [ProducesResponseType(typeof(DTO.Course), 200)]
        public async Task<IActionResult> GetCompanyCoureses(Guid id)
        {
            List<DTO.Course> returnModel = new List<DTO.Course>();
            var dataModel = await _courseService.GetCompanyCoureses(id);
            foreach (var item in dataModel)
            {
                DTO.Course dataModalObj = Mappings.Mapper.Map<Models.Course, DTO.Course>(item);
                dataModalObj.ClassSessionsCount = item.ClassSessions.Where(x => x.IsDeleted == false).Count();
                returnModel.Add(dataModalObj);
            }
            return Ok(returnModel);

        }

        [AllowAnonymous]
        [HttpGet("getCouresClassSession/{id}")]
        [ProducesResponseType(typeof(DTO.Course), 200)]
        public async Task<IActionResult> GetCouresClassSession(Guid id)
        {
            var returnModel = await _courseService.GetCouresClassSession(id);
            return Ok(Mappings.Mapper.Map<Models.Course, DTO.Course>(returnModel));
        }

        [AllowAnonymous]
        [HttpGet("getPurchaseCouresData/{id}")]
        [ProducesResponseType(typeof(DTO.Course), 200)]
        public async Task<IActionResult> GetPurchaseCouresData(Guid id)
        {
            var returnModel = await _courseService.GetPurchaseCouresData(id);
            return Ok(Mappings.Mapper.Map<Models.Course, DTO.Course>(returnModel));
        }
        [AllowAnonymous]
        [HttpGet("getCouresInfo/{id}")]
        [ProducesResponseType(typeof(DTO.CourseProfile), 200)]
        public async Task<IActionResult> getCouresInfo(Guid id)
        {
            var returnModel = await _courseService.GetCouresInfo(id);
            return Ok(returnModel);
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(DTO.Course), 200)]
        public async Task<IActionResult> Post([FromBody] DTO.Course model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (await _courseService.GetExistingClassSession(model.ClassSessions))
            {
                model.IsClassSessionExist = true;
                return Ok(model);
            }
            else
            {
                if (Caller.IsTutor)
                {
                    model.TutorId = Caller.CurrentUser.TutorId;
                    var getTutorCompany = await _companyTutorService.GetCompanyByTutor((Guid)model.TutorId);
                    if (getTutorCompany != null)
                    {
                        model.CompanyId = getTutorCompany.CompanyId;
                    }
                }
                else
                {
                    if (Caller.CurrentUserCompany != null)
                    {
                        model.CompanyId = Caller.CurrentUserCompany.CompanyId;
                    }
                }
                if (model.ClassSessions.Count > 0)
                {
                    model.StartDate = model.ClassSessions.OrderBy(x => x.StartDate).FirstOrDefault().StartDate;
                    model.EndDate = model.ClassSessions.OrderBy(x => x.EndDate).LastOrDefault().EndDate;
                }
                var newModel = await _courseService.Create(Mappings.Mapper.Map<DTO.Course, Models.Course>(model));
                var returnModel = await _courseService.GetCouresClassSession(newModel.CourseId);
                return Ok(Mappings.Mapper.Map<Models.Course, DTO.Course>(returnModel));
            }
          
        }

        [HttpPost("updateCourse")]
        [ProducesResponseType(typeof(DTO.Course), 200)]
        public async Task<IActionResult> UpdateCourse([FromBody] DTO.Course model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (await _courseService.GetExistingClassSession(model.ClassSessions))
            {
                model.IsClassSessionExist = true;
                return Ok(model);
            }
            else
            {
                if (Caller.IsTutor && model.TutorId == null)
                {
                    model.TutorId = Caller.CurrentUser.TutorId;
                    var getTutorCompany = await _companyTutorService.GetCompanyByTutor((Guid)model.TutorId);
                    if (getTutorCompany != null)
                    {
                        model.CompanyId = getTutorCompany.CompanyId;
                    }

                }
                else
                {
                    if (Caller.CurrentUserCompany != null)
                    {
                        model.CompanyId = Caller.CurrentUserCompany.CompanyId;
                    }
                }
                if (model.ClassSessions.Count > 0)
                {
                    model.StartDate = model.ClassSessions.OrderBy(x => x.StartDate).FirstOrDefault().StartDate;
                    model.EndDate = model.ClassSessions.OrderBy(x => x.EndDate).LastOrDefault().EndDate;
                    foreach (var item in model.ClassSessions)
                    {
                        item.CourseId = model.CourseId;
                    }
                }
                var newModel = await _courseService.UpdateCourse(Mappings.Mapper.Map<DTO.Course, Models.Course>(model));
                var returnModel = await _courseService.GetCouresClassSession(newModel.CourseId);
                return Ok(Mappings.Mapper.Map<Models.Course, DTO.Course>(returnModel));
            }
        }


        
        [HttpDelete("deleteCourse/{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {
            await _courseService.DeleteCourse(id);
            return Ok();
        }

        [AllowAnonymous]
        [HttpDelete("deleteCourseClassSession/{id}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> DeleteCourseClassSession(Guid id)
        {
            await _courseService.DeleteCourseClassSession(id);
            return Ok();
        }

        [HttpPost("checkAndCreateGoogleDriverFolders")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> checkAndCreateGoogleDriverFolders([FromBody] DTO.GDrive model)
        {
           var returnModel= await _courseService.checkAndCreateGoogleDriverFolders(model);
            return Ok(returnModel);
        }


        [AllowAnonymous]
        [HttpGet("{courseId}/cardSet")]
        [ProducesResponseType(typeof(DTO.CourseCardSet), 200)]
        public async Task<IActionResult> GetCardSet(Guid courseId)
        {
            return Ok(await _courseService.GetCardSet(courseId));
        }
        [HttpGet("courseNotification/{id}")]
        [ProducesResponseType(typeof(bool), 200)]
        public async Task<IActionResult> CourseNotification(Guid id)
        {
            if (!User.IsInRole("Tutor"))
            {
                return Ok(await _courseService.CourseNotification(id));
            }
            return Ok(false);
        }
    }
}
