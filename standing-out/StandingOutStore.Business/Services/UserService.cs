using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Linq.Dynamic.Core;
using Mapping = StandingOut.Shared.Mapping;
using System.Text.RegularExpressions;

namespace StandingOutStore.Business.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public UserService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public UserService(IUnitOfWork unitOfWork, AppSettings appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }


        public async Task<Models.User> GetByEmail(string name)
        {
            var user = await _UserManager.Users.Include("Tutor").FirstOrDefaultAsync(o => o.Email.ToLower().Trim() == name.ToLower().Trim() && o.IsDeleted == false);

            if (user != null && user.IsDeleted == true)
                return null;

            return user;
        }

        public async Task<Models.User> GetById(string id)
        {
            var user = await _UserManager.FindByIdAsync(id);

            if (user.IsDeleted == true)
                return null;

            return user;
        }

        public async Task<List<UserLoginInfo>> GetUserLoginInfo(string id)
        {
            var data = await _UserManager.GetLoginsAsync(await _UnitOfWork.GetContext().Users.Include("Tutor").FirstOrDefaultAsync(o => o.Id == id));
            return data.ToList();
        }

        public async Task<IList<Models.User>> GetStudents()
        {
            return await _UserManager.Users.Where(x => x.SessionAttendees.Any(o => o.IsDeleted == false)).ToListAsync();
        }

        public async Task<DTO.PagedList<DTO.UserProfile>> GetStudentsPaged(DTO.SearchModel model, string tutorUserId, Guid? companyId = null)
        {
            IQueryable<Models.User> data;

            //var user = _UserManager.Users.FirstOrDefault(o => o.Email == "jg12345test@gmail.com");

            if (!string.IsNullOrEmpty(tutorUserId))
            {
                data = _UserManager.Users.Include("SessionAttendees")
                    .Where(x => x.IsDeleted == false && x.SessionAttendees.Any(o => o.IsDeleted == false && o.ClassSession.OwnerId == tutorUserId));
            }
            else if (companyId != Guid.Empty && companyId != null)
            {
                data = _UserManager.Users.Include("SessionAttendees")
                    .Where(x => x.IsDeleted == false && x.SessionAttendees.Any(o => o.IsDeleted == false && o.ClassSession.Course.CompanyId == companyId));
            }
            else
            {
                data = _UserManager.Users.Include("SessionAttendees")
                    .Where(x => x.SessionAttendees.Any(o => o.IsDeleted == false));
            }

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => (o.FirstName != null && o.FirstName.ToLower().Contains(search)) ||
                    (o.LastName != null && o.LastName.ToLower().Contains(search)) ||
                    (o.Email != null && o.Email.ToLower().Contains(search))
                );
            }

            var result = new DTO.PagedList<DTO.UserProfile>();

            System.Reflection.PropertyInfo prop = typeof(Models.User).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {
                //perform some manual sorting (if required, this should only be for sub-objects).
            }

            result.Data = Mapping.Mappings.Mapper.Map<List<Models.User>, List<DTO.UserProfile>>(await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;



            return result;
        }

        public async Task<DTO.PagedList<DTO.UserProfile>> GetAdminsPaged(DTO.SearchModel model)
        {
            var users = await _UserManager.GetUsersInRoleAsync("Admin");
            List<Models.User> data = users.ToList();

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => (o.FirstName != null && o.FirstName.ToLower().Contains(search)) ||
                    (o.LastName != null && o.LastName.ToLower().Contains(search)) ||
                    (o.Email != null && o.Email.ToLower().Contains(search))
                ).ToList();
            }

            var result = new DTO.PagedList<DTO.UserProfile>();

            System.Reflection.PropertyInfo prop = typeof(Models.User).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                //data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {
                //perform some manual sorting (if required, this should only be for sub-objects).
            }

            result.Data = Mapping.Mappings.Mapper.Map<List<Models.User>, List<DTO.UserProfile>>(data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToList());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;



            return result;
        }

        public async Task<Models.User> CompleteSetup(Models.User user, DTO.UserDetail model)
        {
            user.Title = model.Title;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.DateOfBirth = model.DateOfBirth;
            user.TelephoneNumber = model.TelephoneNumber;
            user.MobileNumber = model.MobileNumber;
            user.MarketingAccepted = model.MarketingAccepted;
            user.TermsAndConditionsAccepted = model.TermsAndConditionsAccepted;
            user.IsSetupComplete = true;
            await _UserManager.UpdateAsync(user);

            await CompleteSetupEmail(user);
            return user;
        }
        public async Task<Models.User> CompleteSetup(Models.User user, DTO.UserGuardianDetail model)
        {
            user.Title = model.ChildTitle;
            user.FirstName = model.ChildFirstName;
            user.LastName = model.ChildLastName;
            user.DateOfBirth = model.ChildDateOfBirth;

            user.ParentTitle = model.ParentTitle;
            user.ParentFirstName = model.FirstName;
            user.ParentLastName = model.LastName;
            user.TelephoneNumber = model.TelephoneNumber;
            user.MobileNumber = model.MobileNumber;
            user.MarketingAccepted = model.MarketingAccepted;
            user.TermsAndConditionsAccepted = model.TermsAndConditionsAccepted;
            user.IsSetupComplete = true;
            user.IsParent = true;
            await _UserManager.UpdateAsync(user);

            await CompleteSetupEmail(user);
            return user;
        }

        private async Task CompleteSetupEmail(Models.User user)
        {
            try
            {
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                        System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\StudentParentSignUp.html"),
                        new Dictionary<string, string>()
                        {
                        { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                        { "{{userFullName}}", user.IsParent ? (user.ParentFirstName + " " + user.ParentLastName) : (user.FirstName + " " + user.LastName) },
                        { "{{findALessonQuery}}", user.DateOfBirth.HasValue && user.DateOfBirth.Value.AddYears(18) <= DateTime.UtcNow ? "" : "?under=false" },
                        }, user.ContactEmail, settings.SendGridFromEmail, $"Thank you for registering with 2utoring");
            }
            catch { }
        }

        public async Task<bool> ChangePassword(string userId, string oldpassword, string newpassword)
        {
            var user = await GetById(userId);

            var result = await _UserManager.ChangePasswordAsync(user, oldpassword, newpassword);

            user.LastPasswordChange = DateTimeOffset.Now;

            await _UserManager.UpdateAsync(user);

            return result.Succeeded;
        }

        public async Task<Models.User> Update(Models.User user)
        {
            await _UserManager.UpdateAsync(user);
            return await GetById(user.Id);
        }

        public async Task<Models.User> GenerateLinkAccountTokens(string email)
        {
            var user = await GetByEmail(email);
            var tokenOne = Guid.NewGuid().ToString();
            tokenOne = Regex.Replace(tokenOne, @"[^0-9a-zA-Z]+", "");
            var tokenTwo = Guid.NewGuid().ToString();
            tokenTwo = Regex.Replace(tokenTwo, @"[^0-9a-zA-Z]+", "");

            user.LinkAccountKeyOne = tokenOne;
            user.LinkAccountKeyTwo = tokenTwo;
            user.LinkAccountRequestDate = DateTimeOffset.UtcNow;

            user = await Update(user);
            return user;
        }
        public async Task<DTO.UserAlertViewModel> UserAlert(Models.User user, string userType)
        {
            DTO.UserAlertViewModel model = new DTO.UserAlertViewModel();
            model.UserType = userType;
            var existingLogins = await GetUserLoginInfo(user.Id);
            #region If user is Company
            if (userType == "Company")
            {
                var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstAsync();
                var company = await _UnitOfWork.Repository<Models.Company>().GetSingle(x => x.AdminUserId == user.Id, includeProperties: "CompanyTutors,SubjectStudyLevelSetups");
                if (company != null)
                {
                    model.Id = company.CompanyId;
                    model.IDVerificationStatus = company.IDVerificationtStatus;
                    model.HasStripeConnectAccount = company.StripeConnectAccountId != null ? true : false;
                    model.HasSubjectPrice = company.SubjectStudyLevelSetups.Any(x => x.CompanyId == company.CompanyId && x.IsDeleted == false);
                    model.ProfileApprovalStatus = company.ProfileApprovalStatus;
                    model.ProfileMessageRead = company.ProfileMessageRead;
                    model.CompanyHasTutors = company.CompanyTutors.Count > 0 ? true : false;
                    model.InitialRegistrationComplete = company.InitialRegistrationComplete;
                }
            }
            #endregion
            #region If user is Company Tutor
            if (userType == "CompanyTutor")
            {
                var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == user.TutorId, includeProperties: "SubjectStudyLevelSetups,TutorQualifications,TutorCertificates,TutorAvailabilities");
                if (tutor != null)
                {
                    model.Id = tutor.TutorId;
                    model.HasSubjectPrice = tutor.SubjectStudyLevelSetups.Any(x => x.TutorId == tutor.TutorId && x.IsDeleted == false);
                    model.ProfileApprovalStatus = tutor.ProfileApprovalStatus;
                    model.DBSApprovalStatus = tutor.DbsApprovalStatus;
                    model.HasGoogleAccount = existingLogins.Any(o => o.LoginProvider == "Google");
                    model.TutorDBSCertificateFileName = tutor.DbsCertificateFileName;
                    model.TutorDBSCertificateNo = tutor.DbsCertificateNumber;
                    model.TutorHasQualifications = tutor.TutorQualifications.Any(x => x.IsDeleted == false);
                    model.TutorHasQualificationCertifications = tutor.TutorCertificates.Any(x => x.IsDeleted == false);
                    model.TutorHasAvailabilitySlots = tutor.TutorAvailabilities.Any(x => x.IsDeleted == false && x.StartTime.ToUniversalTime() > DateTime.Now.ToUniversalTime());
                    model.InitialRegistrationComplete = tutor.InitialRegistrationComplete;
                    model.DbsStatusMessageRead = tutor.DbsStatusMessageRead;
                    model.DbsApprovedMessageRead= tutor.DbsApprovedMessageRead;
                    model.DbsNotApprovedMessageRead= tutor.DbsNotApprovedMessageRead;
                    model.ProfileMessageRead= tutor.ProfileMessageRead;
                    model.ProfileUpgradeMessageRead = tutor.ProfileUpgradeMessageRead;
                }
            }
            #endregion
            #region If user is Non-Company Tutor
            if (userType == "Tutor")
            {
                var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == user.TutorId, includeProperties: "SubjectStudyLevelSetups,TutorQualifications,TutorAvailabilities,TutorCertificates");
                if (tutor != null)
                {
                    model.Id = tutor.TutorId;
                    model.IDVerificationStatus = tutor.IDVerificationtStatus;
                    model.HasStripeConnectAccount = tutor.StripeConnectAccountId != null ? true : false;
                    model.HasStripeSubscription = tutor.StripeSubscriptionId != null ? true : false;
                    model.HasSubjectPrice = tutor.SubjectStudyLevelSetups.Any(x => x.TutorId == tutor.TutorId && x.IsDeleted == false);
                    model.ProfileApprovalStatus = tutor.ProfileApprovalStatus;
                    model.DBSApprovalStatus = tutor.DbsApprovalStatus;
                    model.HasGoogleAccount = existingLogins.Any(o => o.LoginProvider == "Google");
                    model.TutorDBSCertificateFileName = tutor.DbsCertificateFileName;
                    model.TutorDBSCertificateNo = tutor.DbsCertificateNumber;
                    model.TutorHasQualifications = tutor.TutorQualifications.Any(x => x.IsDeleted == false);
                    model.TutorHasQualificationCertifications = tutor.TutorCertificates.Any(x => x.IsDeleted == false);
                    model.TutorHasAvailabilitySlots = tutor.TutorAvailabilities.Any(x => x.IsDeleted == false);
                    model.InitialRegistrationComplete = tutor.InitialRegistrationComplete;
                    model.DbsStatusMessageRead = tutor.DbsStatusMessageRead;
                    model.DbsApprovedMessageRead = tutor.DbsApprovedMessageRead;
                    model.DbsNotApprovedMessageRead = tutor.DbsNotApprovedMessageRead;
                    model.ProfileMessageRead = tutor.ProfileMessageRead;
                    model.ProfileUpgradeMessageRead = tutor.ProfileUpgradeMessageRead;
                }
            }
            #endregion
            #region If user is Parent
            if (userType == "Parent")
            {
                model.Id = Guid.Parse(user.Id);
                model.HasGoogleAccount = existingLogins.Any(o => o.LoginProvider == "Google");
            }
            #endregion
            #region If user is Student
            if (userType == "Student")
            {
                model.Id = Guid.Parse(user.Id);
                model.HasGoogleAccount = existingLogins.Any(o => o.LoginProvider == "Google");
            }
            #endregion
            return model;
        }

        public async Task<bool> MessageStatusUpdate(DTO.UserMessageUpdateModel model)
        {
            if (model.ReferenceId!=Guid.Empty)
            {
                if (!string.IsNullOrEmpty(model.UserType) && model.UserType == "Company" && model.ReferenceId!=Guid.Empty)
                {
                    var company = await _UnitOfWork.Repository<Models.Company>().GetSingle(x => x.CompanyId == model.ReferenceId);
                    if (company!=null)
                    {
                        company.ProfileMessageRead = model.MessageStatus;
                        int updateCount = await _UnitOfWork.Repository<Models.Company>().Update(company);
                        return updateCount > 0 ? true : false; 
                    }
                }
                else 
                {
                    var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == model.ReferenceId);
                    if (tutor != null)
                    {
                        switch (model.MessageColumnName)
                        {
                            case "DbsStatusMessageRead":
                                tutor.DbsStatusMessageRead = model.MessageStatus;
                                break;
                            case "DbsApprovedMessageRead":
                                tutor.DbsApprovedMessageRead = model.MessageStatus;
                                break;
                            case "DbsNotApprovedMessageRead":
                                tutor.DbsNotApprovedMessageRead = model.MessageStatus;
                                break;
                            case "ProfileMessageRead":
                                tutor.ProfileMessageRead = model.MessageStatus;
                                break;
                            case "ProfileUpgradeMessageRead":
                                tutor.ProfileUpgradeMessageRead = model.MessageStatus;
                                break;
                        }
                        int updateCount = await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
                        return updateCount > 0 ? true : false;
                    }
                }
            }
            return false;
        }

        public async Task<bool> ReadMessage(Guid msgId, Guid refId)
        {
            Models.UserNotificationMessage model = new Models.UserNotificationMessage();
            model.NotificationMessageId = msgId;
            model.UserId = refId;
            model.Show = false;
            model.IsClosed = true;
            int insertCount= await _UnitOfWork.Repository<Models.UserNotificationMessage>().Insert(model);
            return insertCount > 0 ? true : false;
        }
    }
}
