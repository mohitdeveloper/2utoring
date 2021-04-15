using StandingOut.Data.Enums;
using StandingOut.Data.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class Tutor
    {
        public Tutor()
        {
            TutorSubjectNameList = new List<string>();
            TutorPriceLesson = new TutorPriceLesson();
        }

        public Guid TutorId { get; set; }
        public Guid? StripePlanId { get; set; }
        public Guid? StripeCountryID { get; set; }
        [StringLength(250)]
        public string StripeCustomerId { get; set; }
        [StringLength(250)]
        public string StripeSubscriptionId { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

        public bool InitialRegistrationComplete { get; set; }
        public int InitialRegistrationStep { get; set; }
        public TutorApprovalStatus ProfileApprovalStatus { get; set; }
        public TutorApprovalStatus IDVerificationtStatus { get; set; }
        public bool ProfileAuthorizedMessageRead { get; set; }

        [Required]
        [StringLength(500)]
        public int CalendarId { get; set; }

        [StringLength(250)]
        public string Header { get; set; }
        [StringLength(2000)]
        public string SubHeader { get; set; }
        [StringLength(2000)]
        public string Biography { get; set; }
        [StringLength(250)]
        public string ImageName { get; set; }
        [StringLength(1000)]
        public string ImageDirectory { get; set; }

        public bool HasDbsCheck { get; set; }
        [StringLength(250)]
        public string DbsCertificateNumber { get; set; }
        public TutorApprovalStatus DbsApprovalStatus { get; set; }
        public bool DbsAdminApprovedMessageRead { get; set; }
        [StringLength(2000)]
        public string DbsCertificateFileLocation { get; set; }
        [StringLength(2000)]
        public string DbsCertificateFileName { get; set; }

        [StringLength(2000)]
        public string ProfileTeachingExperiance { get; set; }
        [StringLength(2000)]
        public string ProfileHowITeach { get; set; }
        [StringLength(2000)]
        public string ProfileImageFileLocation { get; set; }
        [StringLength(2000)]
        public string ProfileImageFileName { get; set; }
        [StringLength(250)]
        public string StripeConnectAccountId { get; set; }
        [StringLength(250)]
        public string StripeConnectBankAccountId { get; set; }
        [StringLength(500)]
        public string UrlSlug { get; set; }
        public bool LinkAccountMessageRead { get; set; }
        public bool LocalLogin { get; set; }
        public bool HasGoogleAccountLinked { get; set; }
        public string UserFullName { get; set; }
        public string UserFirstName { get; set; }
        public string UserTitle { get; set; }
        public string UserEmail { get; set; }
        public string UserId { get; set; }

        [StringLength(20)]
        public string BankAccountNumber { get; set; }
        [StringLength(10)]
        public string BankSortCode { get; set; }
        [StringLength(250)]
        public string AddressLine1 { get; set; }
        [StringLength(10)]
        public string PostCode { get; set; }
        public string SubjectNameList { get; set; }
        public List<string> TutorSubjectNameList { get; set; }
        public List<string> TutorQualification { get; set; }
        public virtual List<TutorCertificate> TutorCertificates { get; set; }
        public Company CurrentCompany { get; set; } // Points to the active company record if any
        public List<TutorAvailability> TutorAvailabilities { get; set; }
        public List<SubjectStudyLevelSetup> SubjectStudyLevelSetup { get; set; }
        public List<Course> TutorCourseList { get; set; }
        public string StoreProfileImageDownload
        {
            get
            {
                return !string.IsNullOrEmpty(ProfileImageFileLocation) ? $"/Tutor/Home/DownloadTutorProfileImage/{TutorId}?dummy={Guid.NewGuid()}" : "";
            }
        }
        public List<BookedSlot> BookedSlot { get; set; }
        public TutorPriceLesson TutorPriceLesson { get; set; }
        public List<TutorOnDays> TutorOnDays { get; set; }
        public int TotalBookedSlot { get; set; }
        public int TotalSlotCount { get; set; }
        public StripeCountry StripeCountry { get; set; }
    }
    public class BookedSlot
    {
        public Guid CourseId { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
    }
    public class TutorPriceLesson
    {

        public decimal OneToOneMinPrice { get; set; }
        public decimal OneToOneMaxPrice { get; set; }
        public decimal GroupMinPrice { get; set; }
        public decimal GroupMaxPrice { get; set; }
        public int OneToOneLessonCount { get; set; }
        public int GroupLessonCount { get; set; }
    }

    public class SearchPricePerPerson
    {
        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
        public bool IsOneToOne { get; set; }
    }
    public class SearchClassSize
    {
        public int MinClassSize { get; set; }
        public int MaxClassSize { get; set; }
    }
    public class TutorOrCourseModel
    {

        public string SearchType { get; set; }
        public string SortType { get; set; }
        public Guid? SubjectId { get; set; }
        public Guid? StudyLevelId { get; set; }
        public bool IsUnder18 { get; set; }
        public SearchClassSize SearchClassSize { get; set; }
        public int[] SearchDay { get; set; }
        public int NoOfCalling { get; set; }
        public SearchPricePerPerson SearchPricePerPerson { get; set; }
        public string? Time { get; set; }
        public int? AvailabilityRequired { get; set; }
        public SearchCourseDuration SearchCourseDuration { get; set; }

    }
    public class SearchCourseDuration
    {
        public int MinCourseDuration { get; set; }
        public int MaxCourseDuration { get; set; }
    }
    public class AgencyTutor
    {
        public Guid CompanyId { get; set; }
        public string Name { get; set; }
        public int TutorCount { get; set; }
    }
    public class TutorOnDays
    {
        public DayOfWeek DayOfWeek { get; set; }
        public int SlotCount { get; set; }
    }
    public class SearchTutorModel
    {
        public SearchTutorModel()
        {
            TutorList = new List<Tutor>();
            CourseList = new List<Course>();
        }
        public List<Tutor> TutorList { get; set; }
        //public List<AgencyTutor> AgencyTutor { get; set; }
        // public List<TutorOnDays> TutorOnDays { get; set; }
        public List<Course> CourseList { get; set; }
    }

    public class UpdateIdVerification
    {
        public string CompanyId { get; set; }
        public string TutorId { get; set; }
        public bool Status { get; set; }
    }
}
