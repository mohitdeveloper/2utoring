using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOut.Data.Enums;
using StandingOut.Shared;
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

    [Produces("application/json")]
    [Route("api/ParentStudentCourse")]
    public class ParentStudentCourseController : Controller
    {
        private readonly ICourseService _courseService;
        private readonly ITutorService _tutorService;
        private readonly ICompanyTutorService _companyTutorService;
        private readonly ISubjectService _SubjectService;
        private readonly IUserService _UserService;
        private readonly ICompanySubscriptionFeatureService companySubscriptionFeatureService;
        private readonly IClassSessionSubscriptionFeatureService _ClassSessionSubscriptionFeatureService;
        private readonly ITutorSubscriptionFeatureService _TutorSubscriptionFeatureService;
        private readonly IStudyLevelService _StudyLevelService;
        private readonly ISubjectStudyLevelSetupService _SubjectStudyLevelSetupService;

        public ParentStudentCourseController(
            IClassSessionSubscriptionFeatureService classSessionSubscriptionFeatureService,
            ITutorSubscriptionFeatureService tutorSubscriptionFeatureService,
             ICompanySubscriptionFeatureService companySubscriptionFeatureService,
             IStudyLevelService studyLevelService,
             ISubjectStudyLevelSetupService subjectStudyLevelSetupService,
            ISubjectService subjectService, ICourseService courseService, ITutorService tutorService, ICompanyTutorService companyTutorService, UserManager<Models.User> userManager, IUserService userService, IOptions<AppSettings> appSettings, ICompanyService companyService)
        {
            _courseService = courseService;
            _tutorService = tutorService;
            _companyTutorService = companyTutorService;
            _SubjectService = subjectService;
            _StudyLevelService = studyLevelService;
            _UserService = userService;
            this.companySubscriptionFeatureService = companySubscriptionFeatureService;
            _ClassSessionSubscriptionFeatureService = classSessionSubscriptionFeatureService;
            _TutorSubscriptionFeatureService = tutorSubscriptionFeatureService;
            _SubjectStudyLevelSetupService = subjectStudyLevelSetupService;
        }

       
        [AllowAnonymous]
        [HttpGet("getCouresClassSession/{id}")]
        [ProducesResponseType(typeof(DTO.Course), 200)]
        public async Task<IActionResult> GetCouresClassSession(Guid id)
        {
            //var dataModel = await _courseService.GetCouresClassSession(id);
            //var returnModel = Mappings.Mapper.Map<Models.Course, DTO.Course>(dataModel);
            //returnModel.IsLoggedIn = User.Identity.IsAuthenticated;
            //return Ok(returnModel);

            var returnModel = await _courseService.GetCouresClassSession(id);
            return Ok(Mappings.Mapper.Map<Models.Course, DTO.Course>(returnModel));
        }

        

        [HttpGet("getTutorCompanysubjects/{id}")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Subject>), 200)]
        public async Task<IActionResult> GetTutorCompanysubjects(Guid id)
        {
            List<Models.Subject> subjectList = null;
            List<Models.Subject> tutorSubjectList = null;

            var companyTutor = await _tutorService.GetCurrentCompanyTutor(id);

            if (companyTutor != null)
            {
                subjectList = await _SubjectService.GetCompanySubjects(companyTutor.CompanyId);
                subjectList = subjectList.OrderBy(x => x.Name).ToList();
            }
            if (id != Guid.Empty)
            {
                //subjectList = await _SubjectService.GetTutorSubjects(Guid.Parse(Caller.CurrentUser.TutorId.ToString()));

                if (companyTutor != null)
                {
                    subjectList = await _SubjectService.GetCompanySubjects(companyTutor.CompanyId);
                    tutorSubjectList = await _SubjectService.GetTutorSubjects(id);

                    subjectList = subjectList.Intersect(tutorSubjectList).ToList();
                }
                else
                {
                    subjectList = await _SubjectService.GetTutorSubjects(id);
                }
                subjectList = subjectList.OrderBy(x => x.Name).ToList();
            }
            return Ok(Mappings.Mapper.Map<List<Models.Subject>, List<DTO.Subject>>(subjectList));
        }

        [HttpGet("getTutorCompanyLevelsBySubject/{tid}/{sid}")]
        [ProducesResponseType(typeof(IEnumerable<DTO.Subject>), 200)]
        public async Task<IActionResult> getTutorCompanyLevelsBySubject(Guid tid, Guid sid)
        {
            List<Models.StudyLevel> studyLevelList = null;
            var tutor = await _tutorService.GetById(tid);
            var companyTutor = await _tutorService.GetCurrentCompanyTutor(tutor?.TutorId);
            if(companyTutor!=null)
            {
                studyLevelList = await _StudyLevelService.GetCompanyLevelsBySubject(companyTutor.CompanyId, sid);
            }
            else
            {
                studyLevelList = await _StudyLevelService.GetTutorLevelsBySubject(tid, sid);
            }
           
            studyLevelList = studyLevelList.OrderBy(x => x.Name).ToList();
            return Ok(Mappings.Mapper.Map<List<Models.StudyLevel>, List<DTO.StudyLevel>>(studyLevelList));
        }





        [HttpGet("getTutorAvailabilities/{id}")]
        [ProducesResponseType(typeof(DTO.Tutor), 200)]
        public async Task<IActionResult> GetTutorAvailabilities(Guid id)
        {
            var tutor = await _tutorService.GetTutorAvailabilities(id);
            var existingLogins = await _UserService.GetUserLoginInfo(tutor.UserId);
            tutor.HasGoogleAccountLinked = existingLogins.Any(o => o.LoginProvider == "Google");
            return Ok(tutor);
        }

        [HttpGet("getClassroomSubscriptionFeaturesByTutorId/{tutorId}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> GetClassroomSubscriptionFeaturesByTutorId(Guid tutorId)
        {
            SubscriptionFeatureSet subscriptionFeatureSet;
            var tutor = await _tutorService.GetById(tutorId);
            var companyTutor = await _tutorService.GetCurrentCompanyTutor(tutor?.TutorId);

            if (companyTutor != null)
                subscriptionFeatureSet = await companySubscriptionFeatureService.GetSubscriptionFeatureSetByCompanyId(companyTutor.CompanyId);
            else
                subscriptionFeatureSet = await _TutorSubscriptionFeatureService.GetSubscriptionFeatureSetByTutorId(tutorId);

            var classSessionFeatures = subscriptionFeatureSet.ToClassSessionFeatures();
            return Ok(classSessionFeatures);
        }


        [HttpPost("getPricePerPerson")]
        [ProducesResponseType(typeof(DTO.SubjectStudyLevelSetupPrice), 200)]
        public async Task<IActionResult> getPricePerPerson([FromBody] DTO.SubjectStudyLevelSetupPrice model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please select subject and study level to get the price per person!");
            }
            DTO.SubjectStudyLevelSetupPrice returnModel = new DTO.SubjectStudyLevelSetupPrice();
            var companyTutor = await _tutorService.GetCurrentCompanyTutor(model.TutorId);

            if (companyTutor != null)
            {
                model.CompanyId = companyTutor.CompanyId;
            }
            else
            {
                model.TutorId =model.TutorId;
            }

        
            var setupPrice = Mappings.Mapper.Map<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetupPrice>(await _SubjectStudyLevelSetupService.getPricePerPerson(model));
            if (setupPrice == null)
            {
                Dictionary<string, Decimal> dist = new Dictionary<string, Decimal>();
                dist.Add("pricePerPerson", Decimal.Parse("0.0"));
                dist.Add("status", Decimal.Parse("-1"));
                return Ok(dist);
            }
            return Ok(setupPrice);
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

            var getTutorCompany = await _companyTutorService.GetCompanyByTutor((Guid)model.TutorId);
            if (getTutorCompany != null)
            {
                model.CompanyId = getTutorCompany.CompanyId;
            }
           
            if (model.ClassSessions.Count > 0)
            {
                model.StartDate = model.ClassSessions.OrderBy(x => x.StartDate).FirstOrDefault().StartDate;
                model.EndDate = model.ClassSessions.OrderBy(x => x.EndDate).LastOrDefault().EndDate;
            }
            #region Verification Code and User IP
            string iPAddress = HttpContext.Connection.RemoteIpAddress.ToString();
            model.IPAddress = iPAddress;
            Random generator = new Random();
            string code = generator.Next(0, 1000000).ToString("D6");
            model.UniqueNumber = code;
            #endregion

            var newModel = await _courseService.Create(Mappings.Mapper.Map<DTO.Course, Models.Course>(model));
            var returnModel = await _courseService.GetCouresClassSession(newModel.CourseId);
            return Ok(Mappings.Mapper.Map<Models.Course, DTO.Course>(returnModel));

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
            var getTutorCompany = await _companyTutorService.GetCompanyByTutor((Guid)model.TutorId);
            if (getTutorCompany != null)
            {
                model.CompanyId = getTutorCompany.CompanyId;
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
