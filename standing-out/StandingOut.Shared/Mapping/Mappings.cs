using AutoMapper;
using Newtonsoft.Json;
using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOut.Shared.Mapping
{
    public static class Mappings
    {
        public static IMapper Mapper { get; private set; }

        static Mappings()
        {
            var config = new MapperConfiguration(cfg =>
            {
                //model to dto

                #region Model To DTO
                cfg.CreateMap<Models.NotificationMessage, DTO.NotificationMessage>();
                cfg.CreateMap<Models.WebsiteContact, DTO.WebsiteContact>();
                cfg.CreateMap<Models.GoogleFilePermission, DTO.GoogleFilePermission>();
                cfg.CreateMap<Models.Company, DTO.CompanyProfileViewModel>()
                .ForMember(o => o.CompanyTeam, src => src.MapFrom(u => u.CompanyTeam))
                .ForMember(o => o.SubjectStudyLevelSetups, src => src.MapFrom(u => u.SubjectStudyLevelSetups.Where(x=>x.IsDeleted==false).ToList()))
                .ForMember(o => o.Courses, src => src.MapFrom(u => u.Courses.Where(x=>!x.IsDeleted && x.ClassSessions.Where(y => !y.IsDeleted && y.StartDate.UtcDateTime >= DateTime.UtcNow && x.Tutor.ProfileApprovalStatus == TutorApprovalStatus.Approved).ToList().Count>0).ToList()))
                .ForMember(o => o.Tutors, src => src.MapFrom(x => x.CompanyTutors.Where(y => !y.IsDeleted && !y.Tutor.IsDeleted && y.Tutor.ProfileApprovalStatus==TutorApprovalStatus.Approved).Select(z => z.Tutor)));

                cfg.CreateMap<Models.Course, DTO.Course>()
                 .ForMember(x => x.TutorName, src => src.MapFrom(u => u.Tutor.Users.FirstOrDefault().Title + ". " + u.Tutor.Users.FirstOrDefault().FirstName + " " + u.Tutor.Users.FirstOrDefault().LastName))
                 .ForMember(x => x.TutorImage, src => src.MapFrom(u => !string.IsNullOrEmpty(u.Tutor.ProfileImageFileLocation) ? "/Tutor/Home/DownloadTutorProfileImage/" + u.Tutor.TutorId + "?dummy=" + Guid.NewGuid() : ""))
                 .ForMember(o => o.StripeConnectAccountId, src => src.MapFrom(u => u.Tutor.StripeConnectAccountId))
                 .ForMember(o => o.CompanyStripeConnectAccountId, src => src.MapFrom(u => u.Company.StripeConnectAccountId))
                 .ForMember(o => o.TutorIDVerificationtStatus, src => src.MapFrom(u => u.Tutor.IDVerificationtStatus))
                 .ForMember(o => o.CompanyIDVerificationtStatus, src => src.MapFrom(u => u.Company.IDVerificationtStatus))
                 .ForMember(o => o.DbsApprovalStatus, src => src.MapFrom(u => u.Tutor.DbsApprovalStatus))
                 .ForMember(o => o.ProfileApprovalStatus, src => src.MapFrom(u => u.Tutor.ProfileApprovalStatus))
                 .ForMember(o => o.SubjectName, src => src.MapFrom(u => u.Subject.Name))
                 .ForMember(o => o.SubjectCategoryName, src => src.MapFrom(u => u.SubjectCategory.Name))
                 .ForMember(o => o.StudyLevelName, src => src.MapFrom(u => u.StudyLevel.Name))
                 //.ForMember(o => o.ClassSessionsCount, src => src.MapFrom(u => u.ClassSessions.Sum(x => x.SessionAttendees.Where(o => o.IsDeleted == false && o.Refunded == false && o.Removed == false).Count())))
                 .ForMember(o => o.ClassSessionsCount, src => src.MapFrom(u => u.ClassSessions.Count(o => o.IsDeleted == false)))
                 .ForMember(o => o.ClassSessionsTotalAmount, src => src.MapFrom(u => u.ClassSessions.Sum(y => y.PricePerPerson)))
                .ForMember(o => o.CourseAttendeesCount, src => src.MapFrom(u =>u.OrderItems!=null?u.OrderItems.Count(x => x.SessionAttendees.Any(o => o.IsDeleted == false && o.Refunded == false && o.Removed == false)):0));
                //.ForMember(o => o.CourseAttendeesCount, src => src.MapFrom(u => u.ClassSessions.Sum(x => x.SessionAttendees.Count(o => o.IsDeleted == false && o.Refunded == false && o.Removed == false)))); 

                //.ForMember(o => o.ClassSessions, src => src.MapFrom(u => u.ClassSessions.Where(o=>o.IsDeleted==false).OrderBy(x=>x.StartDate).ToList()))


                cfg.CreateMap<Models.TutorCertificate, DTO.TutorCertificate>();
                //.ForMember(x => x.CertificateFileLocation, src => src.MapFrom(u => !string.IsNullOrEmpty(u.CertificateFileLocation) ? "/admin/tutors/downloadCertificate/" + u.TutorId + "?dummy=" + Guid.NewGuid() : ""));

                cfg.CreateMap<Models.CompanyTutor, DTO.CompanyTutor>();
                cfg.CreateMap<Models.TutorAvailability, DTO.TutorAvailability>();
                cfg.CreateMap<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetupPrice>()
                    .ForMember(o => o.SubjectName, src => src.MapFrom(u => u.Subject.Name))
                    .ForMember(o => o.StudyLevelName, src => src.MapFrom(u => u.StudyLevel.Name));


                cfg.CreateMap<Models.ClassSession, DTO.ClassSession>()
                                .ForMember(o => o.SessionAttendeesCount, src => src.MapFrom(u => u.SessionAttendees.Count(o => o.IsDeleted == false && o.Refunded == false && o.Removed == false)))
                    .ForMember(o => o.Duration, src => src.MapFrom(u => Convert.ToInt32(u.EndDate.Subtract(u.StartDate).TotalMinutes)))
                    .ForMember(o => o.DetailsDuration, src => src.MapFrom(u => Convert.ToInt32(u.EndDate.Subtract(u.StartDate).TotalMinutes)))
                    .ForMember(o => o.CourseName, src => src.MapFrom(u => u.Course.Name))
                    .ForMember(x => x.TutorName, src => src.MapFrom(x => x.Owner == null || x.Owner.IsDeleted ? null : x.Owner.Title + ". " + x.Owner.FirstName + " " + x.Owner.LastName))
                    .ForMember(o => o.SubjectName, src => src.MapFrom(u => u.Subject.Name))
                    .ForMember(o => o.StudyLevelName, src => src.MapFrom(u => u.StudyLevel.Name))
                    .ForMember(o => o.StudentFees, src => src.MapFrom(u => u.SessionAttendees != null ? u.SessionAttendees.Where(y => y.Refunded == false).Sum(x => x.AmountCharged) : 0.00M))
                    .ForMember(o => o.StandingOutFees, src => src.MapFrom(u => u.SessionAttendees != null ? u.SessionAttendees.Where(y => y.Refunded == false).Sum(x => x.StandingOutActualCut) : 0.00M))
                    .ForMember(o => o.VendorEarningAmount, src => src.MapFrom(u => u.SessionAttendees != null ? u.SessionAttendees.Where(y => y.Refunded == false).Sum(x => x.VendorAmount) : 0.00M))
                    //.ForMember(o => o.VendorEarningAmount, src => src.MapFrom(u => u.VendorEarnings.Sum(x => x.EarningAmount)))

                    .ForMember(o => o.SessionMediaCount, src => src.MapFrom(u => u.SessionMedia.Count(o => o.IsDeleted == false)))
                     //.ForMember(o => o.EarningsPaid, src => src.MapFrom(u => u.SessionAttendees != null ? u.SessionAttendees.Where(o => o.Refunded == false && o.TutorPaid == TutorPaymentStatus.Paid).Count() >= 0 : false)); // We will no longer payout per attendee but per lesson
                     .ForMember(o => o.EarningsPaid, src => src.MapFrom(u => u.VendorEarnings.All(x => x.VendorPayoutId.HasValue)))
                     .ForMember(o => o.EarningsPaid, src => src.MapFrom(u => u.PaymentStatus == "Paid Out"));

                //old one
                  //.ForMember(o => o.EarningsPaid, src => src.MapFrom(u => u.SessionAttendees != null ? u.SessionAttendees.Where(o => o.Refunded == false && o.TutorPaid == TutorPaymentStatus.Paid).Count() >= 0 : false)); // We will no longer payout per attendee but per lesson
                    //.ForMember(o => o.EarningsPaid, src => src.MapFrom(u => u.VendorEarnings.All(x => x.VendorPayoutId.HasValue)));
                    //.ForMember(o => o.EarningsPaid, src => src.MapFrom(u => u.PaymentStatus == "Paid Out"));

                cfg.CreateMap<Models.ClassSession, DTO.ClassSessionIndex>()
                    .ForMember(x => x.TutorName, src => src.MapFrom(x => x.Owner == null || x.Owner.IsDeleted ? null : x.Owner.FirstName + " " + x.Owner.LastName))
                    .ForMember(x => x.TutorId, src => src.MapFrom(x => x.Owner == null || x.Owner.IsDeleted ? null : x.Owner.TutorId));
                cfg.CreateMap<Models.ClassSessionVideoRoom, DTO.ClassSessionVideoRoom>();
                cfg.CreateMap<Models.SafeguardReport, DTO.SafeguardReport>();
                cfg.CreateMap<Models.SessionAttendee, DTO.SessionAttendee>();
                cfg.CreateMap<Models.SessionGroup, DTO.SessionGroup>();
                cfg.CreateMap<Models.SessionGroup, DTO.SessionGroupDraggable>()
                .ForMember(o => o.SessionAttendees, src => src.MapFrom(o => o.SessionAttendees.Where(o => o.IsDeleted == false && o.Removed == false)));

                cfg.CreateMap<Models.SessionMedia, DTO.SessionMedia>();
                cfg.CreateMap<Models.SessionInvite, DTO.SessionInvite>()
                        .ForMember(o => o.UserFullName, src => src.MapFrom(u => u.User.FullName));
                cfg.CreateMap<Models.SessionMessage, DTO.SessionMessage>()
                    .ForMember(o => o.FromUserDisplayName, src => src.MapFrom(u => $"{u.FromUser.FirstName} {u.FromUser.LastName.Substring(0, 1)}"))
                    .ForMember(o => o.FromUserGoogleProfilePicture, src => src.MapFrom(u => u.FromUser.GoogleProfilePicture));
                cfg.CreateMap<Models.SessionWhiteBoard, DTO.SessionWhiteBoard>()
                .ForMember(o => o.History, src => src.Ignore())
                .ForMember(o => o.AppendName, src => src.MapFrom(u => u.User != null ? u.User.FirstName : null));
                cfg.CreateMap<Models.SessionWhiteBoardHistory, DTO.SessionWhiteBoardHistory>()
                .ForMember(o => o.CanvasData, src => src.MapFrom(u => GetWhiteBoardDataJson(u)));

                cfg.CreateMap<Models.Company, DTO.Company>()
                    .ForMember(o => o.UserFullName, src => src.MapFrom(u => u.AdminUser.FullName))
                    .ForMember(o => o.UserFirstName, src => src.MapFrom(u => u.AdminUser.FirstName))
                    .ForMember(o => o.UserEmail, src => src.MapFrom(u => u.AdminUser.Email))
                    .ForMember(o => o.UserTitle, src => src.MapFrom(u => u.AdminUser.Title))
                    .ForMember(o => o.CompanyName, src => src.MapFrom(u => u.Name))
                    .ForMember(o => o.CompanyRegistrationNumber, src => src.MapFrom(u => u.RegistrationNo))
                    .ForMember(o => o.CompanyDescription, src => src.MapFrom(u => u.Description))
                    .ForMember(o => o.UserId, src => src.MapFrom(u => u.AdminUser.Id))
                    .ForMember(o => o.StripeCountryID, src => src.MapFrom(u => u.AdminUser.StripeCountryID));

                cfg.CreateMap<Models.Tutor, DTO.Tutor>()
                    .ForMember(o => o.UserFullName, src => src.MapFrom(u => u.Users.FirstOrDefault().FullName))
                    .ForMember(o => o.UserFirstName, src => src.MapFrom(u => u.Users.FirstOrDefault().FirstName))
                    .ForMember(o => o.UserEmail, src => src.MapFrom(u => u.Users.FirstOrDefault().Email))
                    .ForMember(o => o.UserTitle, src => src.MapFrom(u => u.Users.FirstOrDefault().Title))
                    .ForMember(o => o.UserId, src => src.MapFrom(u => u.Users.FirstOrDefault().Id))
                    .ForMember(o => o.StripeCountryID, src => src.MapFrom(u => u.Users.FirstOrDefault().StripeCountryID));


                cfg.CreateMap<Models.Tutor, DTO.AdminTutorDetails>()
                    .ForMember(o => o.UserFullName, src => src.MapFrom(u => u.Users.FirstOrDefault().FullName))
                    .ForMember(o => o.UserFirstName, src => src.MapFrom(u => u.Users.FirstOrDefault().FirstName))
                    .ForMember(o => o.UserEmail, src => src.MapFrom(u => u.Users.FirstOrDefault().Email))
                    .ForMember(o => o.UserTitle, src => src.MapFrom(u => u.Users.FirstOrDefault().Title))
                    .ForMember(o => o.StripePlanName, src => src.MapFrom(u => u.StripePlan.StripeProductId))
                    .ForMember(o => o.DateOfBirth, src => src.MapFrom(u => u.Users.FirstOrDefault().DateOfBirth))
                    .ForMember(o => o.TutorCertificates, src => src.MapFrom(u => u.TutorCertificates.Where(o => o.IsDeleted == false)))
                    .ForMember(o => o.TutorQualifications, src => src.MapFrom(u => u.TutorQualifications.Where(o => o.IsDeleted == false)));

                cfg.CreateMap<Models.Tutor, DTO.EditTutor>();
                cfg.CreateMap<Models.User, DTO.EditUser>();
                cfg.CreateMap<Models.SystemTool, DTO.SystemTool>();
                cfg.CreateMap<Models.SessionAttendee, DTO.StudentSession>()
                    .ForMember(x => x.TutorId, src => src.MapFrom(x => x.ClassSession.OwnerId))
                    .ForMember(x => x.SessionName, src => src.MapFrom(x => x.ClassSession.Name))
                    .ForMember(x => x.StartDate, src => src.MapFrom(x => x.ClassSession.StartDate))
                    .ForMember(x => x.EndDate, src => src.MapFrom(x => x.ClassSession.EndDate))
                    .ForMember(x => x.SessionStarted, src => src.MapFrom(x => x.ClassSession.Started))
                    .ForMember(x => x.SessionCancelled, src => src.MapFrom(x => x.ClassSession.Cancel))
                    .ForMember(x => x.SessionEnded, src => src.MapFrom(x => x.ClassSession.Ended))
                    .ForMember(x => x.SessionCompleted, src => src.MapFrom(x => x.ClassSession.Complete))
                    .ForMember(x => x.TutorName, src => src.MapFrom(x => x.ClassSession.Owner.FullName))
                    .ForMember(x => x.TotalAttendees, src => src.MapFrom(x => x.ClassSession.SessionAttendees.Count));
                cfg.CreateMap<Models.SessionAttendee, DTO.SessionAttendeeFileUploader>()
                    .ForMember(x => x.Name, src => src.MapFrom(x => x.FirstName + " " + x.LastName))
                    .ForMember(x => x.Email, src => src.MapFrom(x => x.User.GoogleEmail));
                    
                cfg.CreateMap<Models.SessionWhiteBoardSave, DTO.SessionWhiteBoardSaveResult>()
                    .ForMember(x => x.CreatedAt, src => src.MapFrom(x => x.CreatedDate ?? DateTime.Now));

                cfg.CreateMap<Models.Tutor, DTO.CompanyProfileTutor>()
                    .ForMember(x => x.Name, src => src.MapFrom(y => y.Users.Where(x => !x.IsDeleted).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault()));
                cfg.CreateMap<Models.Tutor, DTO.TutorProfile>()
                    .ForMember(x => x.Name, src => src.MapFrom(y => y.Users.Where(x => !x.IsDeleted).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault()))
                    .ForMember(x => x.Companies, src => src.MapFrom(y => y.CompanyTutors.Where(z => !z.IsDeleted && !z.Company.IsDeleted).Select(z => z.Company)));
                cfg.CreateMap<Models.Company, DTO.TutorProfileCompany>();
                cfg.CreateMap<Models.Company, DTO.CompanyProfile>()
                    .ForMember(x => x.Tutors, src => src.MapFrom(y => y.CompanyTutors.Where(z => !z.IsDeleted && !z.Tutor.IsDeleted).Select(z => z.Tutor)));

                cfg.CreateMap<Models.CompanyTutor, DTO.CompanyTutor>();

                cfg.CreateMap<Models.CompanyTutor, DTO.PagedTutorBankDetails>()
                    .ForMember(x => x.TutorId, src => src.MapFrom(y => y.Tutor.TutorId))
                    .ForMember(x => x.BankAccountNumber, src => src.MapFrom(y => y.Tutor.BankAccountNumber))
                    .ForMember(x => x.BankSortCode, src => src.MapFrom(y => y.Tutor.BankSortCode))
                    .ForMember(x => x.FirstName, src => src.MapFrom(y => y.Tutor.Users.FirstOrDefault().FirstName))
                    .ForMember(x => x.LastName, src => src.MapFrom(y => y.Tutor.Users.FirstOrDefault().LastName))
                    .ForMember(x => x.Email, src => src.MapFrom(y => y.Tutor.Users.FirstOrDefault().Email))
                    .ForMember(x => x.UserId, src => src.MapFrom(y => y.Tutor.Users.FirstOrDefault().Id))
                ;

                cfg.CreateMap<Models.Tutor, DTO.GlobalSearchResult>()
                    .ForMember(x => x.Id, src => src.MapFrom(y => y.TutorId))
                    //.ForMember(x => x.Name, src => src.MapFrom(y => y.Users.Where(x => !x.IsDeleted).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault()))
                    .ForMember(x => x.GlobalSearchType, src => src.MapFrom(y => GlobalSearchType.Tutor));
                cfg.CreateMap<Models.Company, DTO.GlobalSearchResult>()
                    .ForMember(x => x.Id, src => src.MapFrom(y => y.CompanyId))
                    .ForMember(x => x.GlobalSearchType, src => src.MapFrom(y => GlobalSearchType.Company));

                cfg.CreateMap<Models.User, DTO.UserProfileComponent>()
                    .ForMember(x => x.Initials, src => src.MapFrom(y => y.FirstName.Substring(0, 1) + y.LastName.Substring(0, 1)));

                cfg.CreateMap<Models.SessionAttendee, DTO.UserBasicCallInfo>()
                    .ForMember(x => x.FullName, src => src.MapFrom(x => x.User.FullName));

                cfg.CreateMap<Models.User, DTO.Intercom.IntercomUser>()
                    .ForMember(x => x.Name, src => src.MapFrom(x => x.FirstName + " " + x.LastName))
                    .ForMember(x => x.CreatedAt, src => src.MapFrom(x => (x.CreatedDate ?? DateTime.Now).Ticks.ToString()));

                cfg.CreateMap<Models.User, DTO.UserProfile>();


                cfg.CreateMap<Models.CompanyMember, DTO.CompanyRegister.CompanyRegisterProfileTeam>()
                    .ForMember(x => x.TeamName, src => src.MapFrom(x => x.Name))
                    .ForMember(x => x.TeamRole, src => src.MapFrom(x => x.Role))
                    .ForMember(x => x.TeamDescription, src => src.MapFrom(x => x.Description))
                ;
                cfg.CreateMap<DTO.CompanyRegister.CompanyRegisterProfileTeam, Models.CompanyMember>()
                    .ForMember(x => x.Name, src => src.MapFrom(x => x.TeamName))
                    .ForMember(x => x.Role, src => src.MapFrom(x => x.TeamRole))
                    .ForMember(x => x.Description, src => src.MapFrom(x => x.TeamDescription));

                cfg.CreateMap<DTO.CompanyRegister.CompanyRegisterBasicInfo, Models.Company>()
                    .ForMember(o => o.AdminUserId, src => src.MapFrom(u => u.UserId))
                    .ForMember(o => o.Name, src => src.MapFrom(u => u.CompanyName))
                    .ForMember(o => o.RegistrationNo, src => src.MapFrom(u => u.CompanyRegistrationNumber!=null? u.CompanyRegistrationNumber:""))
                    .ForMember(o => o.Postcode, src => src.MapFrom(u => u.CompanyPostcode))
                    .ForMember(o => o.EmailAddress, src => src.MapFrom(u => u.CompanyEmail))
                    .ForMember(o => o.TelephoneNumber, src => src.MapFrom(u => u.CompanyTelephoneNumber))
                    .ForMember(o => o.MobileNumber, src => src.MapFrom(u => u.CompanyMobileNumber))
                    .ForMember(o => o.Header, src => src.MapFrom(u => u.Header))
                    .ForMember(o => o.SubHeader, src => src.MapFrom(u => u.SubHeader));

                cfg.CreateMap<Models.Company, DTO.CompanyRegister.CompanyRegisterBasicInfo>()
                    .ForMember(o => o.UserId, src => src.MapFrom(u => u.AdminUser != null ? u.AdminUserId : null))
                    .ForMember(o => o.Title, src => src.MapFrom(u => u.AdminUser != null ? u.AdminUser.Title : null))
                    .ForMember(o => o.FirstName, src => src.MapFrom(u => u.AdminUser != null ? u.AdminUser.FirstName : null))
                    .ForMember(o => o.LastName, src => src.MapFrom(u => u.AdminUser != null ? u.AdminUser.LastName : null))
                    .ForMember(o => o.Email, src => src.MapFrom(u => u.AdminUser != null ? u.AdminUser.Email : null))
                    .ForMember(o => o.TelephoneNumber, src => src.MapFrom(u => u.AdminUser != null ? u.AdminUser.TelephoneNumber : null))
                    .ForMember(o => o.MobileNumber, src => src.MapFrom(u => u.AdminUser != null ? u.AdminUser.MobileNumber : null))
                    .ForMember(o => o.CompanyName, src => src.MapFrom(u => u.Name))
                    .ForMember(o => o.CompanyRegistrationNumber, src => src.MapFrom(u => u.RegistrationNo))
                    .ForMember(o => o.CompanyPostcode, src => src.MapFrom(u => u.Postcode))
                    .ForMember(o => o.CompanyMobileNumber, src => src.MapFrom(u => u.MobileNumber))
                    .ForMember(o => o.CompanyTelephoneNumber, src => src.MapFrom(u => u.TelephoneNumber))
                    .ForMember(o => o.CompanyEmail, src => src.MapFrom(u => u.EmailAddress));

                cfg.CreateMap<Models.User, DTO.CompanyRegister.CompanyRegisterBasicInfo>()
                    .ForMember(o => o.Email, src => src.MapFrom(u => u.Email))
                    .ForMember(o => o.UserId, src => src.MapFrom(u => u.Id))
                    .ForMember(o => o.DateOfBirthDay, src => src.MapFrom(u => u.DateOfBirth != null ? u.DateOfBirth.Value.Day : (int?)null))
                    .ForMember(o => o.DateOfBirthMonth, src => src.MapFrom(u => u.DateOfBirth != null ? u.DateOfBirth.Value.Month : (int?)null))
                    .ForMember(o => o.DateOfBirthYear, src => src.MapFrom(u => u.DateOfBirth != null ? u.DateOfBirth.Value.Year : (int?)null));

                cfg.CreateMap<Models.User, DTO.TutorRegister.TutorRegisterBasicInfo>()
                                 .ForMember(o => o.UserId, src => src.MapFrom(u => u.Id))
                                 .ForMember(o => o.DateOfBirthDay, src => src.MapFrom(u => u.DateOfBirth != null ? u.DateOfBirth.Value.Day : (int?)null))
                               .ForMember(o => o.DateOfBirthMonth, src => src.MapFrom(u => u.DateOfBirth != null ? u.DateOfBirth.Value.Month : (int?)null))
                               .ForMember(o => o.DateOfBirthYear, src => src.MapFrom(u => u.DateOfBirth != null ? u.DateOfBirth.Value.Year : (int?)null));
                cfg.CreateMap<Models.StripePlan, DTO.StripePlan>();
                cfg.CreateMap<Models.StripeCountry, DTO.StripeCountry>();
                cfg.CreateMap<Models.TutorCertificate, DTO.TutorCertificate>();
                cfg.CreateMap<Models.TutorQualification, DTO.TutorQualification>();
                cfg.CreateMap<Models.TutorSubject, DTO.TutorSubject>()
                             .ForMember(o => o.SubjectName, src => src.MapFrom(u => u.Subject.Name))
                             .ForMember(o => o.SubjectCategoryName, src => src.MapFrom(u => u.SubjectCategory.Name))
                             .ForMember(o => o.TutorSubjectStudyLevelsString, src => src.MapFrom(x => string.Join(", ", x.TutorSubjectStudyLevels.Select(y => y.StudyLevel.Name))))
                             .ForMember(o => o.TutorSubjectStudyLevels, src => src.Ignore());

                cfg.CreateMap<Models.CompanySubject, DTO.CompanySubject>()
                             .ForMember(o => o.SubjectName, src => src.MapFrom(u => u.Subject.Name))
                             .ForMember(o => o.SubjectCategoryName, src => src.MapFrom(u => u.SubjectCategory.Name))
                             .ForMember(o => o.CompanySubjectStudyLevelsString, src => src.MapFrom(x => string.Join(", ", x.CompanySubjectStudyLevels.Select(y => y.StudyLevel.Name))))
                             .ForMember(o => o.CompanySubjectStudyLevels, src => src.Ignore());

                cfg.CreateMap<Models.TutorSubjectStudyLevel, DTO.TutorSubjectStudyLevel>()
                         .ForMember(o => o.StudyLevelName, src => src.MapFrom(u => u.StudyLevel.Name));
                cfg.CreateMap<Models.CompanySubjectStudyLevel, DTO.CompanySubjectStudyLevel>()
                         .ForMember(o => o.StudyLevelName, src => src.MapFrom(u => u.StudyLevel.Name));


                cfg.CreateMap<Models.ClassSession, DTO.LessonCard>()
                    .ForMember(x => x.SubjectName, src => src.MapFrom(x => x.Subject.Name))
                    .ForMember(x => x.SubjectCategoryName, src => src.MapFrom(x => x.SubjectCategoryId.HasValue ? x.SubjectCategory.Name : null))
                    .ForMember(x => x.SessionName, src => src.MapFrom(x => x.Name))
                    .ForMember(x => x.StudyLevelName, src => src.MapFrom(x => x.StudyLevel.Name))
                    .ForMember(x => x.TutorId, src => src.MapFrom(x => x.Owner.TutorId))
                    .ForMember(x => x.TutorSalutation, src => src.MapFrom(x => x.Owner.Title))
                    .ForMember(x => x.TutorFirstName, src => src.MapFrom(x => x.Owner.FirstName))
                    .ForMember(x => x.TutorLastName, src => src.MapFrom(x => x.Owner.LastName))
                    .ForMember(x => x.TutorProfileImageFileLocation, src => src.MapFrom(x => x.Owner.Tutor.ProfileImageFileLocation))
                    .ForMember(x => x.IsApproved, 
                            src => src.MapFrom(x => 
                                x.Owner.Tutor.DbsApprovalStatus == TutorApprovalStatus.Approved 
                                ||
                                x.Owner.Tutor.DbsApprovalStatus == TutorApprovalStatus.NotRequired
                                ))
                    .ForMember(x => x.SessionDuration, src => src.MapFrom(x => x.Duration))
                    .ForMember(x => x.SessionRemainingSpaces, src => src.MapFrom(x => x.MaxPersons - x.SessionAttendees.Where(x => !x.IsDeleted).Count()))
                    .ForMember(x => x.SessionDate, src => src.MapFrom(x => x.StartDate))
                    .ForMember(x => x.SessionDescriptionBody, src => src.MapFrom(x => x.LessonDescriptionBody))
                    .ForMember(x => x.SessionPrice, src => src.MapFrom(x => x.PricePerPerson))
                    .ForMember(x => x.SessionCurrency, src => src.MapFrom(x => "GBP"))
                    .ForMember(x => x.TutorSubjects, src => src.MapFrom(x => x.Owner.Tutor.TutorSubjects.Where(o => o.IsDeleted == false).GroupBy(y => y.SubjectId).Select(y => y.First().Subject.Name)))
                       .ForMember(x => x.TutorHeadline, src => src.MapFrom(x => x.Owner.Tutor.Header));

                cfg.CreateMap<Models.User, DTO.TutorCard>()
                    .ForMember(x => x.TutorId, src => src.MapFrom(x => x.TutorId))
                    .ForMember(x => x.UrlSlug, src => src.MapFrom(x => x.Tutor.UrlSlug))
                    .ForMember(x => x.Salutation, src => src.MapFrom(x => x.Title))
                    .ForMember(x => x.IsApproved, src => src.MapFrom(x => 
                                x.Tutor.DbsApprovalStatus == TutorApprovalStatus.Approved
                                ||
                                x.Tutor.DbsApprovalStatus == TutorApprovalStatus.NotRequired
                                ))
                    .ForMember(x => x.Biography, src => src.MapFrom(x => x.Tutor.SubHeader))
                    .ForMember(x => x.Header, src => src.MapFrom(x => x.Tutor.Header))
                    .ForMember(x => x.ProfileImageFileLocation, src => src.MapFrom(x => x.Tutor.ProfileImageFileLocation))
                    .ForMember(x => x.Qualifications, src => src.MapFrom(x => x.Tutor.TutorQualifications.Where(o => o.IsDeleted == false).Select(y => y.Name)))
                    .ForMember(x => x.Subjects, src => src.MapFrom(x => x.Tutor.TutorSubjects.Where(o => o.IsDeleted == false).GroupBy(y => y.SubjectId).Select(y => y.First().Subject.Name)));

                cfg.CreateMap<Models.StudyLevel, DTO.StudyLevel>();
                cfg.CreateMap<Models.Subject, DTO.Subject>();
                cfg.CreateMap<Models.SubjectCategory, DTO.SubjectCategory>()
                    .ForMember(x => x.SubjectName, src => src.MapFrom(x => x.Subject.Name));

                cfg.CreateMap<Models.Tutor, DTO.PagedTutor>()

                    .ForMember(o => o.UserFullName, src => src.MapFrom(u => u.Users != null && u.Users.Count > 0 ? u.Users.FirstOrDefault().FullName : ""))
                    .ForMember(o => o.UserFirstName, src => src.MapFrom(u => u.Users != null && u.Users.Count > 0 ? u.Users.FirstOrDefault().FirstName : ""))
                    .ForMember(o => o.UserEmail, src => src.MapFrom(u => u.Users != null && u.Users.Count > 0 ? u.Users.FirstOrDefault().Email : ""))
                    .ForMember(o => o.UserTitle, src => src.MapFrom(u => u.Users != null && u.Users.Count > 0 ? u.Users.FirstOrDefault().Title : ""))
                    .ForMember(o => o.GoogleEmail, src => src.MapFrom(u => u.Users != null && u.Users.Count > 0 ? u.Users.FirstOrDefault().GoogleEmail : ""))
                    .ForMember(o => o.DateOfBirth, src => src.MapFrom(u => u.Users != null && u.Users.Count > 0 ? u.Users.FirstOrDefault().DateOfBirth : null))
                    .ForMember(o => o.DbsCertificateNumber, src => src.MapFrom(u => u.DbsCertificateNumber))
                    .ForMember(o => o.StartDate, src => src.MapFrom(u => u.CreatedDate));

                cfg.CreateMap<Models.User, DTO.UserDetail>();
                cfg.CreateMap<Models.User, DTO.UserGuardianDetail>()
                    .ForMember(x => x.ChildFirstName, src => src.MapFrom(x => x.FirstName))
                    .ForMember(x => x.ChildLastName, src => src.MapFrom(x => x.LastName))
                    .ForMember(x => x.FirstName, src => src.MapFrom(x => x.ParentFirstName))
                    .ForMember(x => x.LastName, src => src.MapFrom(x => x.ParentLastName))
                    .ForMember(x => x.ChildDateOfBirth, src => src.MapFrom(x => x.DateOfBirth));

                cfg.CreateMap<Models.PromoCode, DTO.PromoCode>();

                cfg.CreateMap<Models.ClassSession, DTO.LessonTimetableLesson>()
                    .ForMember(x => x.AttendeeCount, src => src.MapFrom(x => x.SessionAttendees.Count(o => o.IsDeleted == false)));
                cfg.CreateMap<Models.SessionAttendee, DTO.LessonTimetableLesson>()
                    .ForMember(x => x.StartDate, src => src.MapFrom(x => x.ClassSession.StartDate))
                    .ForMember(x => x.EndDate, src => src.MapFrom(x => x.ClassSession.EndDate))
                    .ForMember(x => x.Duration, src => src.MapFrom(x => x.ClassSession.Duration))
                    .ForMember(x => x.Started, src => src.MapFrom(x => x.ClassSession.Started))
                    .ForMember(x => x.Ended, src => src.MapFrom(x => x.ClassSession.Ended))
                    .ForMember(x => x.Cancel, src => src.MapFrom(x => x.ClassSession.Cancel))
                    .ForMember(x => x.Complete, src => src.MapFrom(x => x.ClassSession.Complete))
                    .ForMember(x => x.Name, src => src.MapFrom(x => x.ClassSession.Name))
                    .ForMember(x => x.Type, src => src.MapFrom(x => x.ClassSession.Type))
                    .ForMember(x => x.RequiresGoogleAccount, src => src.MapFrom(x => x.ClassSession.RequiresGoogleAccount))
                    .ForMember(x => x.AttendeeCount, src => src.MapFrom(x => x.ClassSession.SessionAttendees.Count(o => o.IsDeleted == false)));

                cfg.CreateMap<Models.SessionAttendee, DTO.SafeguardingClassSessionOption>()
                    .ForMember(x => x.StartDate, src => src.MapFrom(x => x.ClassSession.StartDate))
                    .ForMember(x => x.Name, src => src.MapFrom(x => x.ClassSession.Name));

                cfg.CreateMap<Models.SubjectStudyLevelSetup, DTO.SubjectStudyLevelSetup>()
                    .ForMember(x => x.OwningEntityId, src => src.MapFrom(x => x.CompanyId.HasValue ? x.CompanyId.Value : x.TutorId.Value))
                    .ForMember(x => x.SubjectStudyLevelSetupType, src => src.MapFrom(x => x.CompanyId.HasValue ? SubjectStudyLevelSetupType.Company : SubjectStudyLevelSetupType.Tutor))
                    .ForMember(x => x.SubjectName, src => src.MapFrom(x => x.Subject != null ? x.Subject.Name : ""))
                    .ForMember(x => x.StudyLevelName, src => src.MapFrom(x => x.StudyLevel != null ? x.StudyLevel.Name : ""));
                #endregion


                // ##########
                // DTO to model
                // ##########
                #region DTO to Model
                cfg.CreateMap<DTO.WebsiteContact, Models.WebsiteContact>();
                cfg.CreateMap<DTO.GoogleFilePermission, Models.GoogleFilePermission>();
                cfg.CreateMap<DTO.Course, Models.Course>();
                cfg.CreateMap<DTO.CompanyTutor, Models.CompanyTutor>();
                cfg.CreateMap<DTO.TutorAvailability, Models.TutorAvailability>();
                cfg.CreateMap<DTO.SubjectStudyLevelSetupPrice, Models.SubjectStudyLevelSetup>();

                cfg.CreateMap<DTO.ClassSession, Models.ClassSession>()
                    .ForMember(o => o.EndDate, src => src.MapFrom(u => u.StartDate.AddMinutes(u.DetailsDuration)))
                    .ForMember(o => o.VendorEarnings, src => src.Ignore());

                cfg.CreateMap<DTO.ClassSessionVideoRoom, Models.ClassSessionVideoRoom>();
                cfg.CreateMap<DTO.SafeguardReport, Models.SafeguardReport>();
                cfg.CreateMap<DTO.SessionAttendee, Models.SessionAttendee>();
                cfg.CreateMap<DTO.SessionGroup, Models.SessionGroup>();
                cfg.CreateMap<DTO.SessionMedia, Models.SessionMedia>();
                cfg.CreateMap<DTO.SessionInvite, Models.SessionInvite>();
                cfg.CreateMap<DTO.SessionMessage, Models.SessionMessage>();
                cfg.CreateMap<DTO.SessionWhiteBoard, Models.SessionWhiteBoard>();
                cfg.CreateMap<DTO.SessionWhiteBoardOpen, Models.SessionWhiteBoard>();
                cfg.CreateMap<DTO.SessionWhiteBoardHistory, Models.SessionWhiteBoardHistory>();
                cfg.CreateMap<DTO.Tutor, Models.Tutor>();
                cfg.CreateMap<DTO.SystemTool, Models.SystemTool>();
                cfg.CreateMap<DTO.SessionWhiteBoardSave, Models.SessionWhiteBoardSave>();

                cfg.CreateMap<DTO.CompanyProfile, Models.Company>();
                cfg.CreateMap<DTO.CreateCompany, Models.Company>();
                cfg.CreateMap<DTO.EditCompany, Models.Company>();
                cfg.CreateMap<DTO.CompanyTutor, Models.CompanyTutor>();

                cfg.CreateMap<DTO.TutorQualification, Models.TutorQualification>();
                cfg.CreateMap<DTO.TutorSubject, Models.TutorSubject>()
                     .ForMember(o => o.TutorSubjectStudyLevels, src => src.MapFrom(u => u.TutorSubjectStudyLevels.Where(x => x.Checked == true)));
                cfg.CreateMap<DTO.TutorSubjectStudyLevel, Models.TutorSubjectStudyLevel>()
                      .ForMember(o => o.TutorSubject, src => src.Ignore())
                      .ForMember(o => o.StudyLevel, src => src.Ignore());

                cfg.CreateMap<DTO.CompanySubject, Models.CompanySubject>()
                     .ForMember(o => o.CompanySubjectStudyLevels, src => src.MapFrom(u => u.CompanySubjectStudyLevels.Where(x => x.Checked == true)));
                cfg.CreateMap<DTO.CompanySubjectStudyLevel, Models.CompanySubjectStudyLevel>()
                      .ForMember(o => o.CompanySubject, src => src.Ignore())
                      .ForMember(o => o.StudyLevel, src => src.Ignore());

                cfg.CreateMap<DTO.StudyLevel, Models.StudyLevel>();
                cfg.CreateMap<DTO.Subject, Models.Subject>();
                cfg.CreateMap<DTO.SubjectCategory, Models.SubjectCategory>();

                cfg.CreateMap<DTO.SubjectStudyLevelSetup, Models.SubjectStudyLevelSetup>()
                    .ForMember(x => x.CompanyId,
                        src => src.MapFrom(x => (x.SubjectStudyLevelSetupType == SubjectStudyLevelSetupType.Company) ? x.OwningEntityId : (Guid?)null))
                    .ForMember(x => x.TutorId,
                        src => src.MapFrom(x => (x.SubjectStudyLevelSetupType == SubjectStudyLevelSetupType.Tutor) ? x.OwningEntityId : (Guid?)null))
                    ;

                cfg.CreateMap<DTO.SessionGroupDraggable, Models.SessionGroup>();

                //enum mapping
                //cfg.CreateMap<AccessLevel, string>().ConvertUsing(src => src.ToString());

                // Stripe to DTO
                cfg.CreateMap<Stripe.PaymentMethod, DTO.StripeCard>()
                    .ForMember(x => x.PaymentMethodId, src => src.MapFrom(x => x.Id))
                    .ForMember(x => x.Last4, src => src.MapFrom(x => x.Card.Last4))
                    .ForMember(x => x.Address, src => src.MapFrom(x => x.BillingDetails.Address.Line1 + ", " + x.BillingDetails.Address.PostalCode));

                cfg.CreateMap<Models.ClassSession, Models.ClassSession>()
                  .ForMember(o => o.ClassSessionId, src => src.Ignore())
                    .ForMember(o => o.ScheduleType, src => src.Ignore())
                      .ForMember(o => o.ScheduleEndDate, src => src.Ignore());

                cfg.CreateMap<Stripe.Subscription, DTO.StripeSubscription>()
                  .ForMember(o => o.Amount, src => src.MapFrom(u => u.Plan.Amount > 0 ? (decimal)u.Plan.Amount / 100m : 0))
                  .ForMember(o => o.Name, src => src.MapFrom(u => u.Plan.Nickname))
                  .ForMember(o => o.Status, src => src.MapFrom(u => u.Status));

                cfg.CreateMap<Stripe.IExternalAccount, Stripe.BankAccount>();
                cfg.CreateMap<Stripe.BankAccount, DTO.StripeBankAccount>()
                    .ForMember(o => o.Id, src => src.MapFrom(o => o.Id))
                    .ForMember(o => o.LastDigits, src => src.MapFrom(o => o.Last4))
                    .ForMember(o => o.SortCode, src => src.MapFrom(o => o.RoutingNumber))
                    .ForMember(o => o.BankName, src => src.MapFrom(o => o.BankName))
                    .ForMember(o => o.AccountHolderName, src => src.MapFrom(o => o.AccountHolderName));

                //cfg.CreateMap<Stripe.PaymentIntent, DTO.ReceiptIndex>()
                //    .ForMember(x => x.AmountRefunded, src => src.MapFrom(x => x.Charges == null ? 0 : x.Charges.Sum(y => y.AmountRefunded)))
                //    .ForMember(x => x.ClassSessionName, src => src.MapFrom(x => GetValueFromMetadata(x.Metadata, "classSessionName")));

                cfg.CreateMap<Models.SessionAttendee, DTO.ReceiptIndex>()
                    //.ForMember(x => x.Created, src => src.MapFrom(x => x.Order.CreatedDate.HasValue ? x.Order.CreatedDate.Value.ToLocalTime(): DateTime.MinValue))
                    .ForMember(x => x.LessonStartDate, src => src.MapFrom(x => x.ClassSession.StartDate.ToLocalTime()))
                    .ForMember(x => x.Amount, src => src.MapFrom(x => x.AmountCharged * 100))
                    .ForMember(x => x.Id,
                            src => src.MapFrom(x =>
                            (x.OrderItem != null && x.OrderItem.Order != null && x.OrderItem.Order.PaymentProviderFields != null)
                            ? x.OrderItem.Order.PaymentProviderFields.ReceiptId : "Unknown"))
                    .ForMember(x => x.AmountRefunded, src => src.MapFrom(x => (x.Refunded && x.AttendeeRefundId != null) ? x.AttendeeRefund.Amount * 100 : 0m))
                    .ForMember(x => x.ClassSessionName, src => src.MapFrom(x => x.ClassSession.Name))
                    .ForMember(x => x.StripeCountry, src => src.MapFrom(x => x.ClassSession.Owner.StripeCountry));//Add StripeCountry for Currency Symbol by wizcraft

                cfg.CreateMap<Models.SafeguardReport, DTO.SafeguardReportIndex>()
                    .ForMember(x => x.SessionName, src => src.MapFrom(x => x.ClassSessionId.HasValue ? x.ClassSession.Name : null))
                    .ForMember(x => x.TutorName, src => src.MapFrom(x => x.ClassSessionId.HasValue ? x.ClassSession.Owner.FirstName + " " + x.ClassSession.Owner.LastName : null))
                    .ForMember(x => x.UserName, src => src.MapFrom(x => x.User.FirstName + " " + x.User.LastName));
            });

            #endregion
            Mapper = config.CreateMapper();
        }

        private static string GetValueFromMetadata(Dictionary<string, string> metadata, string key)
        {
            if (metadata.TryGetValue(key, out string keyValue))
                return keyValue;
            else
                return null;
        }

        public static List<DTO.SessionWhiteBoard> MapWhiteBoard(IEnumerable<Models.SessionWhiteBoard> model)
        {
            return model.Select(x => MapWhiteBoard(x)).ToList();
        }

        public static DTO.SessionWhiteBoard MapWhiteBoard(Models.SessionWhiteBoard model)
        {
            var dto = Mapper.Map<Models.SessionWhiteBoard, DTO.SessionWhiteBoard>(model);

            var historySet = model.History.Where(x => !x.UnDone).ToList();

            var lastLoadIndex = historySet.FindLastIndex(x => x.HistoryType == "load");

            // If there was a load (import), and the last one (we'll see if we can cut down the amount of data needed - note if 0/1 we can't cut down the data)
            if (lastLoadIndex > 1 && historySet[lastLoadIndex - 1].HistoryType == "resize")
                historySet = historySet.Skip(lastLoadIndex).ToList();

            for (var i = 0; i < historySet.Count; i++)
            {
                dto.CanvasData.Add(JsonConvert.DeserializeObject<DTO.WhiteboardData>(historySet[i].JsonData));
                dto.CanvasData[i].SessionWhiteBoardHistoryId = historySet[i].SessionWhiteBoardHistoryId;
            }

            dto.UndoStore = (dto.CanvasData.Count > 10 ? dto.CanvasData.Skip(dto.CanvasData.Count - 10) : dto.CanvasData).Select(x => x.SessionWhiteBoardHistoryId).ToList();

            return dto;
        }

        public static DTO.WhiteboardData GetWhiteBoardDataJson(Models.SessionWhiteBoardHistory input)
        {
            var toAdd = JsonConvert.DeserializeObject<DTO.WhiteboardData>(input.JsonData);
            toAdd.SessionWhiteBoardHistoryId = input.SessionWhiteBoardHistoryId;
            return toAdd;
        }

    }
}
