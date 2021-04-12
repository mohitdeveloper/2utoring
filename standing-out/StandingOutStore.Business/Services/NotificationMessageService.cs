using StandingOut.Data;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using StandingOut.Shared.Mapping;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.Extensions.Options;
using StandingOut.Data.Enums;

namespace StandingOutStore.Business.Services
{
    public class NotificationMessageService : INotificationMessageService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;
        private readonly AppSettings _AppSettings;
        public NotificationMessageService(IUnitOfWork unitOfWork, UserManager<Models.User> userManager, IOptions<AppSettings> appSettings)
        {
            _UnitOfWork = unitOfWork;
            _UserManager = userManager;
            _AppSettings = appSettings.Value;
        }
        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }
        public async Task<DTO.NotificationModel> GetNotificationMessages(Models.User user, string PageName, string UserType)
        {
            DTO.NotificationModel model = new DTO.NotificationModel();

            var alertMessage = await UserAlert(user, UserType);
            if (UserType == "Student")
            {
                var messageData = await _UnitOfWork.Repository<Models.NotificationMessage>().Get(
                   x => x.PageNotificationMessage.PageName == PageName && x.RoleTypeNotificationMessage.RoleType == UserType);
                var messages = Mappings.Mapper.Map<List<Models.NotificationMessage>, List<DTO.NotificationMessage>>(messageData);
                model.MessageList = messages.OrderBy(x => x.SetNo).ThenBy(y => y.SequenceNo).ToList();
                model.UserAlertModel = alertMessage;
            }
            else
            {
                var messageData = await _UnitOfWork.Repository<Models.NotificationMessage>().Get(
                   x => x.PageNotificationMessage.PageName == PageName && x.RoleTypeNotificationMessage.RoleType == UserType
                   && x.SubscriptionNotificationMessage.SubscriptionId == alertMessage.SubscriptionId
                   && !x.UserNotificationMessages.Any(y => y.NotificationMessageId == x.NotificationMessageId && y.UserId == alertMessage.Id)
                   );
                var messages = Mappings.Mapper.Map<List<Models.NotificationMessage>, List<DTO.NotificationMessage>>(messageData);
                model.MessageList = messages.OrderBy(x => x.SetNo).ThenBy(y => y.SequenceNo).ToList();
                model.UserAlertModel = alertMessage;
            }

            return model;
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
                var company = await _UnitOfWork.Repository<Models.Company>().GetSingle(x => x.AdminUserId == user.Id, includeProperties: "CompanyTutors,SubjectStudyLevelSetups,CompanySubscriptions,StripePlan");
                if (company != null)
                {
                    model.Id = company.CompanyId;
                    model.SiteUrl = _AppSettings.MainSiteUrl;
                    model.IDVerificationStatus = company.IDVerificationtStatus;
                    model.HasStripeConnectAccount = company.StripeConnectAccountId != null ? true : false;
                    model.HasSubjectPrice = company.SubjectStudyLevelSetups.Any(x => x.CompanyId == company.CompanyId && x.IsDeleted == false);
                    model.ProfileApprovalStatus = company.ProfileApprovalStatus;
                    model.ProfileMessageRead = company.ProfileMessageRead;
                    model.CompanyHasTutors = company.CompanyTutors.Count > 0 ? true : false;
                    model.InitialRegistrationComplete = company.InitialRegistrationComplete;
                    model.SubscriptionId = company.CompanySubscriptions.Where(x => x.IsDeleted == false).FirstOrDefault().SubscriptionId;
                    model.ProfileSetupStarted = company.ProfileSetupStarted;
                    model.ProfileFieldsAllComplete = company.ProfileFieldsAllComplete;
                    int totalDay = (int)(DateTime.Now - Convert.ToDateTime(company.CreatedDate)).TotalDays;
                    model.FreeDaysLeft = Convert.ToInt32(company.StripePlan.FreeDays) - totalDay;
                    model.PaymentStatus = company.PaymentStatus;


                }
            }
            #endregion
            #region If user is Company Tutor
            if (userType == "CompanyTutor")
            {
                var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == user.TutorId, includeProperties: "SubjectStudyLevelSetups,TutorQualifications,TutorCertificates,TutorAvailabilities,CompanyTutors.Company.CompanySubscriptions");
                if (tutor != null)
                {
                    #region Get Company Subscription
                    Guid SubscriptionId = Guid.Empty;
                    if (tutor.CompanyTutors.Where(x => x.IsDeleted == false).FirstOrDefault().Company != null)
                    {
                        var company = tutor.CompanyTutors.Where(x => x.IsDeleted == false).FirstOrDefault().Company;
                        if (company.CompanySubscriptions.FirstOrDefault().SubscriptionId != null)
                        {
                            SubscriptionId = company.CompanySubscriptions.FirstOrDefault().SubscriptionId;
                        }
                    }
                    #endregion

                    model.Id = tutor.TutorId;
                    model.SiteUrl = _AppSettings.MainSiteUrl;
                    model.HasSubjectPrice = tutor.SubjectStudyLevelSetups.Any(x => x.TutorId == tutor.TutorId && x.IsDeleted == false);
                    model.ProfileApprovalStatus = tutor.ProfileApprovalStatus;
                    model.DBSApprovalStatus = tutor.DbsApprovalStatus;
                    model.HasGoogleAccount = existingLogins.Any(o => o.LoginProvider == "Google");
                    if (tutor.TutorCertificates.FirstOrDefault(x => x.IsDeleted == false && x.CertificateType == TutorCertificateType.DBS) != null)
                    {
                        model.TutorDBSCertificateFileName = tutor.TutorCertificates.FirstOrDefault(x => x.IsDeleted == false && x.CertificateType == TutorCertificateType.DBS).CertificateFileName;
                    }
                    //model.TutorDBSCertificateFileName = tutor.DbsCertificateFileName;
                    model.TutorDBSCertificateNo = tutor.DbsCertificateNumber;
                    model.TutorHasQualifications = tutor.TutorQualifications.Any(x => x.IsDeleted == false);
                    model.TutorHasQualificationCertifications = tutor.TutorCertificates.Any(x => x.IsDeleted == false);
                    model.TutorHasAvailabilitySlots = tutor.TutorAvailabilities.Any(x => x.IsDeleted == false && x.StartTime.ToUniversalTime() > DateTime.Now.ToUniversalTime());
                    model.InitialRegistrationComplete = tutor.InitialRegistrationComplete;
                    model.DbsStatusMessageRead = tutor.DbsStatusMessageRead;
                    model.DbsApprovedMessageRead = tutor.DbsApprovedMessageRead;
                    model.DbsNotApprovedMessageRead = tutor.DbsNotApprovedMessageRead;
                    model.ProfileMessageRead = tutor.ProfileMessageRead;
                    model.ProfileUpgradeMessageRead = tutor.ProfileUpgradeMessageRead;
                    model.SubscriptionId = SubscriptionId;
                    model.ProfileSetupStarted = tutor.ProfileSetupStarted;
                    model.ProfileFieldsAllComplete = tutor.ProfileFieldsAllComplete;
                    
                }
            }
            #endregion
            #region If user is Non-Company Tutor
            if (userType == "Tutor")
            {
                var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(x => x.TutorId == user.TutorId, includeProperties: "SubjectStudyLevelSetups,TutorQualifications,TutorAvailabilities,TutorCertificates,TutorSubscriptions,StripePlan");
                if (tutor != null)
                {
                    model.Id = tutor.TutorId;
                    model.SiteUrl = _AppSettings.MainSiteUrl;
                    model.IDVerificationStatus = tutor.IDVerificationtStatus;
                    model.HasStripeConnectAccount = tutor.StripeConnectAccountId != null ? true : false;
                    model.HasStripeSubscription = tutor.StripeSubscriptionId != null ? true : false;
                    model.HasSubjectPrice = tutor.SubjectStudyLevelSetups.Any(x => x.TutorId == tutor.TutorId && x.IsDeleted == false);
                    model.ProfileApprovalStatus = tutor.ProfileApprovalStatus;
                    model.DBSApprovalStatus = tutor.DbsApprovalStatus;
                    model.HasGoogleAccount = existingLogins.Any(o => o.LoginProvider == "Google");
                    //model.TutorDBSCertificateFileName = tutor.DbsCertificateFileName;
                    if (tutor.TutorCertificates.FirstOrDefault(x => x.IsDeleted == false && x.CertificateType == TutorCertificateType.DBS) != null)
                    {
                        model.TutorDBSCertificateFileName = tutor.TutorCertificates.FirstOrDefault(x => x.IsDeleted == false && x.CertificateType == TutorCertificateType.DBS).CertificateFileName;
                    }
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
                    model.SubscriptionId = tutor.TutorSubscriptions.Where(x => x.IsDeleted == false).FirstOrDefault().SubscriptionId;
                    model.ProfileSetupStarted = tutor.ProfileSetupStarted;
                    model.ProfileFieldsAllComplete = tutor.ProfileFieldsAllComplete;
                    int totalDay= (int)(DateTime.Now - Convert.ToDateTime(tutor.CreatedDate)).TotalDays;
                    model.FreeDaysLeft = Convert.ToInt32(tutor.StripePlan.FreeDays) - totalDay;
                    model.PaymentStatus = tutor.PaymentStatus;
                }
            }
            #endregion
            #region If user is Parent
            if (userType == "Parent")
            {
                model.Id = Guid.Parse(user.Id);
                model.SiteUrl = _AppSettings.MainSiteUrl;
                model.HasGoogleAccount = existingLogins.Any(o => o.LoginProvider == "Google");
            }
            #endregion
            #region If user is Student
            if (userType == "Student")
            {
                model.Id = Guid.Parse(user.Id);
                model.SiteUrl = _AppSettings.MainSiteUrl;
                model.HasGoogleAccount = existingLogins.Any(o => o.LoginProvider == "Google");
            }
            #endregion
            return model;
        }

        public async Task<List<UserLoginInfo>> GetUserLoginInfo(string id)
        {
            var data = await _UserManager.GetLoginsAsync(await _UnitOfWork.GetContext().Users.Include("Tutor").FirstOrDefaultAsync(o => o.Id == id));
            return data.ToList();
        }
    }
}
