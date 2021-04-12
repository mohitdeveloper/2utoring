using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DTO = StandingOut.Data.DTO;
using StandingOut.Extensions;
using System.Threading.Tasks;
using System.Linq;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Shared.Mapping;
using Models = StandingOut.Data.Models;
using Twilio.Jwt.AccessToken;
using Token = Twilio.Jwt.AccessToken.Token;
using Microsoft.AspNetCore.Identity;
using ssbsi = StandingOutStore.Business.Services.Interfaces;
using StandingOut.Shared;

namespace StandingOut.Classroom.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/classroom/sessions")]
    public class SessionsController : BaseController
    {
        private readonly ISettingService _SettingService;
        private readonly IUserService _UserService;
        private readonly IClassSessionService _ClassSessionService;
        private readonly UserManager<Models.User> _UserManager;
        private readonly ssbsi.ISubscriptionFeatureService subscriptionFeatureService;

        /// <summary>
        /// No StartRecording and StopRecording methods found here.. Cannot apply Subscription setting SessionRecording = Off
        /// </summary>
        /// <param name="settingService"></param>
        /// <param name="userService"></param>
        /// <param name="classSessionService"></param>
        /// <param name="userManager"></param>
        public SessionsController(ISettingService settingService, IUserService userService, IClassSessionService classSessionService, UserManager<Models.User> userManager,
            ssbsi.ISubscriptionFeatureService subscriptionFeatureService)
        {
            _SettingService = settingService;
            _ClassSessionService = classSessionService;
            _UserService = userService;
            _UserManager = userManager;
            this.subscriptionFeatureService = subscriptionFeatureService;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DTO.ClassSession), 200)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var model = await _ClassSessionService.GetById(id);
            return Ok(Mappings.Mapper.Map<Models.ClassSession, DTO.ClassSession>(model));
        }

        [HttpGet("GetTwilioKey")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> GetTwilioKey()
        {
            throw new ApplicationException("This method is deprecated.. Use GetTwilioKeyByClassSession");
            try
            {
                var settings = await _SettingService.Get();

                // These values are necessary for any access token
                string twilioAccountSid = settings.TwilioAccountSid;
                string twilioApiKey = settings.TwilioApiKey;
                string twilioApiSecret = settings.TwilioApiSecret;

                // These are specific to Video
                var user = await _UserService.GetByEmail(User.Identity.Name);

                string identity = "";
                if (user.TutorId.HasValue)
                {
                    identity = user.FullName + " -" + Guid.NewGuid().ToString().Substring(0, 4);
                }
                else
                {
                    identity = user.FirstName + " " + user.LastName.Substring(0, 1) + " -" + Guid.NewGuid().ToString().Substring(0, 4);
                }

                // Create a Video grant for this token
                var grant = new VideoGrant();

                var grants = new HashSet<IGrant> { grant };

                // Create an Access Token generator
                var token = new Token(
                    twilioAccountSid,
                    twilioApiKey,
                    twilioApiSecret,
                    //identity: identity,
                    identity: user.Id,
                    grants: grants);

                var tokenString = token.ToJwt();

                return Json(new
                {
                    identity,
                    token = token.ToJwt()
                });
            }
            catch (Exception ex)
            {
                var settings = await _SettingService.Get();
                await Utilities.EmailUtilities.SendEmail(settings.SendGridApi, "charlie.b@iostudiso.co.uk", "admin@2utoring.com", "Vidyo_Logging", "Message: " + ex.Message + "<br>Stack: " + ex.StackTrace, null, null, null);
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpGet("GetTwilioKeyByClassSession/{classSessionId}")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> GetTwilioKeyByClassSession(Guid classSessionId)
        {
            try
            {
                var settings = await _SettingService.Get();
                var classSession = await _ClassSessionService.GetById(classSessionId);

                var sessionIsOver18 = classSession.IsUnder16 == false;
                List<Models.SubscriptionFeature> sf = null;
                if (classSession.Course.CompanyId.HasValue)
                    sf = await subscriptionFeatureService.GetSubscriptionFeaturesForCompany(classSession.Course.CompanyId.Value);
                else
                    sf = await subscriptionFeatureService.GetSubscriptionFeaturesForTutor(classSession.Owner.TutorId.Value);
                var csf = new SubscriptionFeatureSet(sf).ToClassSessionFeatures();

                // These values are necessary for any access token

                // Use Twilio account with Recording enabled 
                string twilioAccountSid = settings.TwilioAccountSid;
                string twilioApiKey = settings.TwilioApiKey;
                string twilioApiSecret = settings.TwilioApiSecret;

                // Use Twilio account with NO Recording enabled (for Over 18s) OR Subscription has SessionRecording off
                // Note: Keeping this decision here will allow us to change this later if "criteria" to turn recording on/off changes.. (say a flag on ClassSession, instead of age based)
                if (sessionIsOver18 || csf.Classroom_EnterClass_SessionRecordingEnabled == false)
                {
                    twilioAccountSid = settings.TwilioAccountSid2;
                    twilioApiKey = settings.TwilioApiKey2;
                    twilioApiSecret = settings.TwilioApiSecret2;
                }

                // These are specific to Video
                var user = await _UserService.GetByEmail(User.Identity.Name);

                string identity = "";
                if (user.TutorId.HasValue)
                {
                    identity = user.FullName + " -" + Guid.NewGuid().ToString().Substring(0, 4);
                }
                else
                {
                    identity = user.FirstName + " " + user.LastName.Substring(0, 1) + " -" + Guid.NewGuid().ToString().Substring(0, 4);
                }

                // Create a Video grant for this token
                var grant = new VideoGrant();

                var grants = new HashSet<IGrant> { grant };

                // Create an Access Token generator
                var token = new Token(
                    twilioAccountSid,
                    twilioApiKey,
                    twilioApiSecret,
                    //identity: identity,
                    identity: user.Id,
                    grants: grants);

                var tokenString = token.ToJwt();

                return Json(new
                {
                    identity,
                    token = token.ToJwt(),
                    isRecordingEnabled = (classSession.IsUnder16 == true),
                });
            }
            catch (Exception ex)
            {
                var settings = await _SettingService.Get();
                await Utilities.EmailUtilities.SendEmail(settings.SendGridApi, "charlie.b@iostudiso.co.uk", "admin@2utoring.com", "Vidyo_Logging", "Message: " + ex.Message + "<br>Stack: " + ex.StackTrace, null, null, null);
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpGet("GetUserDetails/{id}")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> GetUserDetails(string id)
        {
            try
            {
                var user = await _UserService.GetById(id);

                string identity = "";
                if (user.TutorId.HasValue)
                {
                    identity = user.FullName + " -" + Guid.NewGuid().ToString().Substring(0, 4);
                }
                else
                {
                    identity = user.FirstName + " " + user.LastName.Substring(0, 1) + " -" + Guid.NewGuid().ToString().Substring(0, 4);
                }

                return Ok(new DTO.SessionUser() { UserId = user.Id, Username = identity, IsTutor = user.TutorId.HasValue, FullName = user.FirstName + " " + user.LastName.Substring(0, 1), GoogleProfilePicture = user.GoogleProfilePicture });
            }
            catch (Exception ex)
            {
                var settings = await _SettingService.Get();
                await Utilities.EmailUtilities.SendEmail(settings.SendGridApi, "charlie.b@iostudiso.co.uk", "admin@2utoring.com", "Vidyo_Logging", "Message: " + ex.Message + "<br>Stack: " + ex.StackTrace, null, null, null);
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpGet("GetAvailableGroups/{classSessionId}")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> GetAvailableGroups(Guid classSessionId)
        {
            try
            {
                var result = new List<DTO.VideoRoomGroup>();
                var user = await _UserService.GetByEmail(User.Identity.Name);
                var classSession = await _ClassSessionService.GetById(classSessionId);

                if (user.TutorId.HasValue)
                {
                    result.Add(new DTO.VideoRoomGroup() { Value = classSessionId.ToString() + "_main", Text = "Whole Class", PermissionType = "All", IsIndividual = false });

                    foreach (var sessionGroup in classSession.SessionGroups)
                    {
                        result.Add(new DTO.VideoRoomGroup() { Value = classSessionId.ToString() + "_" + sessionGroup.SessionGroupId, Text = "Group_" + sessionGroup.Name, PermissionType = "Group", IsIndividual = false });
                    }

                    foreach (var sessionAttendee in classSession.SessionAttendees)
                    {
                        if (sessionAttendee.User != null)
                        {
                            result.Add(new DTO.VideoRoomGroup() { Value = classSessionId.ToString() + "_" + CombineAlpha(classSession.OwnerId, sessionAttendee.UserId), Text = "User_" + sessionAttendee.User.FullName, PermissionType = "All", IsIndividual = true, UserId = sessionAttendee.UserId, HelpRequested = sessionAttendee.HelpRequested });
                        }
                    }
                }
                else
                {
                    result.Add(new DTO.VideoRoomGroup() { Value = classSessionId.ToString() + "_main", Text = "Whole Class", PermissionType = "All", IsIndividual = false });
                    result.Add(new DTO.VideoRoomGroup() { Value = classSessionId.ToString() + "_" + CombineAlpha(classSession.OwnerId, user.Id), Text = "Tutor", PermissionType = "All", IsIndividual = true, UserId = classSession.OwnerId });

                    var userGroups = classSession.SessionGroups.Where(o => o.SessionAttendees.Any(sa => sa.UserId == user.Id)).ToList();

                    foreach (var userGroup in userGroups)
                    {
                        result.Add(new DTO.VideoRoomGroup() { Value = classSessionId.ToString() + "_" + userGroup.SessionGroupId, Text = "Group_" + userGroup.Name, PermissionType = "Group", IsIndividual = false });
                    }


                    if (classSession.SessionAttendees.Where(o => o.UserId == user.Id).First().CallIndividualsEnabled)
                    {
                        var callIndividualAttendees = classSession.SessionAttendees.Where(o => o.UserId != user.Id).ToList();

                        foreach (var callIndividualAttendee in callIndividualAttendees)
                        {
                            result.Add(new DTO.VideoRoomGroup() { Value = classSessionId.ToString() + "_" + CombineAlpha(callIndividualAttendee.UserId, user.Id), Text = "User_" + callIndividualAttendee.FirstName, PermissionType = "All", IsIndividual = true, UserId = callIndividualAttendee.UserId });
                        }
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                var settings = await _SettingService.Get();
                await Utilities.EmailUtilities.SendEmail(settings.SendGridApi, "charlie.b@iostudiso.co.uk", "admin@2utoring.com", "Vidyo_Logging", "Message: " + ex.Message + "<br>Stack: " + ex.StackTrace, null, null, null);
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpGet("StartSession/{classSessionId}")]
        [ProducesResponseType(typeof(DateTime), 200)]
        public async Task<IActionResult> StartSession(Guid classSessionId)
        {
            try
            {
                var user = await _UserService.GetByEmail(User.Identity.Name);

                if (!user.TutorId.HasValue)
                    return BadRequest();

                var classSession = await _ClassSessionService.StartSession(classSessionId, user);
                if (classSession == null || !classSession.DueEndDate.HasValue)
                    return BadRequest();

                return Ok(new { DueEndDate = classSession.DueEndDate.Value });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }
      
        [HttpGet("CancelLesson/{classSessionId}")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> CancelLesson(Guid classSessionId)
        {
            try
            {
                string url = await _ClassSessionService.CancelLesson(classSessionId);
                Dictionary<string, string> redirectUrl = new Dictionary<string, string>();
                redirectUrl.Add("url", url);
                return Ok(redirectUrl);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpGet("EndSession/{classSessionId}")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> EndSession(Guid classSessionId)
        {
            try
            {
                var user = await _UserService.GetByEmail(User.Identity.Name);

                if (!user.TutorId.HasValue)
                    return BadRequest();

                if (!(await _ClassSessionService.EndSession(classSessionId, user)))
                    return BadRequest();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpGet("GetAllChatPermission/{classSessionId}")]
        [ProducesResponseType(typeof(bool), 200)]
        public async Task<IActionResult> GetAllChatPermission(Guid classSessionId)
        {
            try
            {
                var chatActive = await _ClassSessionService.GetAllChatPermission(classSessionId);
                return Ok(new DTO.ChatPermissions { ChatAll = chatActive });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpGet("WebcamGroup/{groupId}")]
        public async Task<IActionResult> WebcamGroup(Guid groupId)
        {
            try
            {
                var videoRoom = await _ClassSessionService.GetWebcamGroup(groupId);
                return Ok(videoRoom);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        public string CombineAlpha(string val1, string val2)
        {
            var result = val1 + val2;
            return String.Concat(result.OrderBy(c => c));
        }

        #region WEBCAM

        [HttpGet("{classSessionId}/webcamGroups")]
        [ProducesResponseType(typeof(List<DTO.WebcamGroup>), 200)]
        public async Task<IActionResult> GetWebcamGroups(Guid classSessionId)
        {
            try
            {
                var user = await _UserManager.FindByNameAsync(User.Identity.Name);
                var result = await _ClassSessionService.GetWebcamGroups(classSessionId, user, User.IsInRole("Tutor"));
                return Ok(new DTO.WebcamGroupResult() { WebcamGroups = result, WebcamGroupsAll = result.SelectMany(o => o.Rooms).ToList() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DTO.ErrorResponse { Code = "500", Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        #endregion WEBCAM
    }
}
