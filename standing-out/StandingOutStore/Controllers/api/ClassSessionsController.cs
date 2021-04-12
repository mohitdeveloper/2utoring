using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Shared.Mapping;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StandingOut.Business.Services;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Data.Enums;
using DTO = StandingOut.Data.DTO;
using IClassSessionService = StandingOutStore.Business.Services.Interfaces.IClassSessionService;
using IClassSessionVideoRoomService = StandingOutStore.Business.Services.Interfaces.IClassSessionVideoRoomService;
using ISettingService = StandingOutStore.Business.Services.Interfaces.ISettingService;
using Models = StandingOut.Data.Models;
using StandingOutStore.Extensions;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Shared;

namespace StandingOutStore.Controllers.api
{
    [Produces("application/json")]
    [Route("api/ClassSessions")]
    public class ClassSessionsController : NewBaseController
    {
        private readonly IClassSessionService _ClassSessionService;
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISettingService _SettingService;
        private readonly IClassSessionVideoRoomService _ClassSessionVideoRoomService;
        private readonly IClassSessionSubscriptionFeatureService _ClassSessionSubscriptionFeatureService;
        private readonly ITutorSubscriptionFeatureService _TutorSubscriptionFeatureService;
        private readonly ICompanySubscriptionFeatureService companySubscriptionFeatureService;
        private readonly Business.Services.Interfaces.ITutorService tutorService;

        public ClassSessionsController(IClassSessionService classSessionService, UserManager<Models.User> userManager, ISettingService settingService,
            IClassSessionVideoRoomService classSessionVideoRoomService,
            IClassSessionSubscriptionFeatureService classSessionSubscriptionFeatureService,
            ITutorSubscriptionFeatureService tutorSubscriptionFeatureService,
            IOptions<AppSettings> appSettings, ICompanyService companyService,
            ICompanySubscriptionFeatureService companySubscriptionFeatureService,
            Business.Services.Interfaces.ITutorService tutorService)
            : base(userManager, appSettings, companyService)
        {
            _ClassSessionService = classSessionService;
            _UserManager = userManager;
            _SettingService = settingService;
            _ClassSessionVideoRoomService = classSessionVideoRoomService;
            _ClassSessionSubscriptionFeatureService = classSessionSubscriptionFeatureService;
            _TutorSubscriptionFeatureService = tutorSubscriptionFeatureService;
            this.companySubscriptionFeatureService = companySubscriptionFeatureService;
            this.tutorService = tutorService;
        }

        [HttpPost("pagedCards")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.LessonCard>), 200)]
        public async Task<IActionResult> GetPagedCards([FromBody] DTO.LessonSearch model)
        {
            return Ok(await _ClassSessionService.GetPagedCards(model));
        }

        [HttpGet("{classSessionId}/card")]
        [ProducesResponseType(typeof(DTO.LessonCard), 200)]
        public async Task<IActionResult> GetCard(Guid classSessionId)
        {
            return Ok(await _ClassSessionService.GetCard(classSessionId));
        }

        [HttpGet("{classSessionId}/cardSet")]
        [ProducesResponseType(typeof(DTO.CardSet), 200)]
        public async Task<IActionResult> GetCardSet(Guid classSessionId)
        {
            return Ok(await _ClassSessionService.GetCardSet(classSessionId));
        }

        [Authorize]
        [HttpGet("safeguardingOptions")]
        [ProducesResponseType(typeof(List<DTO.SafeguardingClassSessionOption>), 200)]
        public async Task<IActionResult> GetSafegaurdingOptions()
        {
            var user = await _UserManager.FindByNameAsync(User.Identity.Name);
            return Ok(await _ClassSessionService.GetSafegaurdingOptions(user));
        }

        [Authorize]
        [HttpGet("timetable")]
        [ProducesResponseType(typeof(List<DTO.LessonTimetableDay>), 200)]
        public async Task<IActionResult> GetTimetable(int timeOffset, int weekOffset)
        {
            if (User.IsInRole("Admin"))
                Redirect("/");
            var user = await _UserManager.FindByNameAsync(User.Identity.Name);
            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
            {

                int minutesBeforeEntry = 0;
                if(user.TutorId!=null)
                {
                    SubscriptionFeatureSet subscriptionFeatureSet = null;
                    var tutor = await tutorService.GetById(Guid.Parse(user.TutorId.ToString()));
                    var companyTutor = await tutorService.GetCurrentCompanyTutor(tutor?.TutorId);
                    if (Caller.IsTutor && companyTutor != null)
                        subscriptionFeatureSet = await companySubscriptionFeatureService.GetSubscriptionFeatureSetByCompanyId(companyTutor.CompanyId);
                    else
                        subscriptionFeatureSet = await _TutorSubscriptionFeatureService.GetSubscriptionFeatureSetByTutorId(tutor.TutorId);

                    var classSessionFeatures = subscriptionFeatureSet.ToClassSessionFeatures();

                    minutesBeforeEntry = classSessionFeatures.Classroom_ClassroomEntryTime_MinutesBeforeEntry;
                }
                
                return Ok(await _ClassSessionService.GetTutorTimetable(user, timeOffset, weekOffset , minutesBeforeEntry));
            }
            else
                return Ok(await _ClassSessionService.GetStudentTimetable(user, timeOffset, weekOffset));
        }

        [Authorize]
        [HttpPost("Paged")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.ClassSession>), 200)]
        public async Task<IActionResult> Paged([FromBody] DTO.SearchModel model)
        {
            string userId = null;
            DTO.PagedList<DTO.ClassSession> classSessions = null;
            string includes = "Subject, StudyLevel, SessionAttendees, Owner";
            // string role = null; 

            //if(Caller.IsAdmin)
            //{
            //    // role = "Admin";
            //    // userId = Caller.CurrentUserCompany.CompanyId.ToString(); // Invalid use of variable.
            //    includes += ", Course";
            //}
            //else if(Caller.IsTutor)
            //{
            //    role = "Tutor";
            //}

            if (Caller.IsSuperAdmin)
                classSessions = await _ClassSessionService.GetPaged(model, includes, null);
            else if (Caller.IsAdmin && Caller.CurrentUserCompany != null)
            {
                includes += ", Course";
                classSessions = await _ClassSessionService.GetPaged(model, includes, null, Caller.CurrentUserCompany.CompanyId);
            }
            else
                classSessions = await _ClassSessionService.GetPaged(model, includes, userId);

            return Ok(classSessions);
        }

        [Authorize]
        [HttpPost("Earnings")]
        [ProducesResponseType(typeof(DTO.PagedList<DTO.ClassSession>), 200)]
        public async Task<IActionResult> Earnings([FromBody] DTO.SearchModel model)
        {
            DTO.PagedList<DTO.ClassSession> classSessions = null;
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (Caller.CurrentUserCompany != null)
            {
                classSessions = await _ClassSessionService.GetPaged(model,
                    "Subject, StudyLevel, SessionAttendees, Course, VendorEarnings, Owner", null, Caller.CurrentUserCompany.CompanyId, true);
            }
            else
            {
                classSessions = await _ClassSessionService.GetPaged(model,
                    "Subject, StudyLevel, SessionAttendees, Course, VendorEarnings, Owner", user.Id, null, true);
            }
            return Ok(classSessions);
        }

        [Authorize]
        [HttpGet("cancelLesson/{id}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> CancelLesson(Guid id)
        {
            return Ok(await _ClassSessionService.CancelLesson(id));
        }


        [Authorize]
        [HttpGet("getById/{id}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var classSession = await _ClassSessionService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.ClassSession, DTO.ClassSession>(classSession));
        }

        [Authorize]
        [HttpPost("")]
        public async Task<IActionResult> Create([FromBody] DTO.ClassSession model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.DetailsDuration <= 0)
            {
                return BadRequest("Duration must be greater than 0.");
            }

            var settings = await _SettingService.Get();
            if (settings.MinimumDateForClassSession.HasValue && model.StartDate < settings.MinimumDateForClassSession)
            {
                return BadRequest("Sorry you are not able to book a lesson on this date");
            }

            var classsSession = await _ClassSessionService.CreateMain(Mappings.Mapper.Map<DTO.ClassSession, Models.ClassSession>(model));
            return Ok(Mappings.Mapper.Map<Models.ClassSession, DTO.ClassSession>(classsSession));
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] DTO.ClassSession model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.ClassSessionId)
            {
                return BadRequest();
            }

            var settings = await _SettingService.Get();
            if (settings.MinimumDateForClassSession.HasValue && model.StartDate < settings.MinimumDateForClassSession)
            {
                return BadRequest("Sorry you are not able to book a lesson on this date");
            }

            var classsSession = await _ClassSessionService.UpdateMain(Mappings.Mapper.Map<DTO.ClassSession, Models.ClassSession>(model));
            return Ok(Mappings.Mapper.Map<Models.ClassSession, DTO.ClassSession>(classsSession));
        }

        [Authorize(Roles = "Super Admin, Admin")]
        [HttpGet("{id}/rooms")]
        public async Task<IActionResult> GetRooms(Guid id)
        {
            var data = await _ClassSessionVideoRoomService.Get(id);
            return Ok(data);
        }

        [Authorize]
        [HttpGet("getClassroomSubscriptionFeaturesByClassSessionId/{classSessionId}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> GetClassroomSubscriptionFeaturesByClassSessionId(Guid classSessionId)
        {
            var subscriptionFeatureSet = await _ClassSessionSubscriptionFeatureService.GetSubscriptionFeatureSetByClassSessionId(classSessionId);
            var classSessionFeatures = subscriptionFeatureSet.ToClassSessionFeatures();
            return Ok(classSessionFeatures);
        }

        [Authorize]
        [HttpGet("getClassroomSubscriptionFeaturesByTutorId/{tutorId}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> GetClassroomSubscriptionFeaturesByTutorId(Guid tutorId)
        {
            SubscriptionFeatureSet subscriptionFeatureSet;
            var tutor = await tutorService.GetById(tutorId);
            var companyTutor = await tutorService.GetCurrentCompanyTutor(tutor?.TutorId);

            //if (Caller.IsTutor && companyTutor != null)
            //    subscriptionFeatureSet = await companySubscriptionFeatureService.GetSubscriptionFeatureSetByCompanyId(companyTutor.CompanyId);
            //else
            //    subscriptionFeatureSet = await _TutorSubscriptionFeatureService.GetSubscriptionFeatureSetByTutorId(tutorId);

            if (companyTutor != null)
                subscriptionFeatureSet = await companySubscriptionFeatureService.GetSubscriptionFeatureSetByCompanyId(companyTutor.CompanyId);
            else
                subscriptionFeatureSet = await _TutorSubscriptionFeatureService.GetSubscriptionFeatureSetByTutorId(tutorId);

            var classSessionFeatures = subscriptionFeatureSet.ToClassSessionFeatures();
            return Ok(classSessionFeatures);
        }

        //[Authorize]
        [AllowAnonymous]
        [HttpGet("getClassroomSubscriptionFeaturesByTutorId")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> GetClassroomSubscriptionFeaturesByTutorId()
        {
            SubscriptionFeatureSet subscriptionFeatureSet = null;

            if (User.Identity.IsAuthenticated)
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);

                if (user.TutorId.HasValue)
                {
                    var tutor = await tutorService.GetById(Guid.Parse(user.TutorId.ToString()));
                    var companyTutor = await tutorService.GetCurrentCompanyTutor(tutor?.TutorId);

                    if (Caller.IsTutor && companyTutor != null)
                        subscriptionFeatureSet = await companySubscriptionFeatureService.GetSubscriptionFeatureSetByCompanyId(companyTutor.CompanyId);
                    else
                        subscriptionFeatureSet = await _TutorSubscriptionFeatureService.GetSubscriptionFeatureSetByTutorId(tutor.TutorId);

                    var classSessionFeatures = subscriptionFeatureSet.ToClassSessionFeatures();
                    return Ok(classSessionFeatures); 
                }
            }
            return Ok(subscriptionFeatureSet);
        }
    }
}