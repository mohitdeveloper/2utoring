using StandingOut.Data.DTO.CompanyRegister;
using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class Company : ICompanyId
    {
        public Company()
        {
        }

        public Guid CompanyId { get; set; }

        [Required]
        [StringLength(250)]
        public string CompanyName { get; set; }
        public string CompanyDescription { get; set; }
        public string CompanyRegistrationNumber { get; set; }
        public string EmailAddress { get; set; }
        public string TelephoneNumber { get; set; }
        public string MobileNumber { get; set; }
        [StringLength(2000)]
        public string WhoWeAre { get; set; }
        [StringLength(2000)]
        public string WhatWeDo { get; set; }
        [StringLength(2000)]
        public string WhyWeDoIt { get; set; }
        [StringLength(2000)]
        public string WhyChooseUs { get; set; }
        [Required]
        [StringLength(250)]
        public string SubHeader { get; set; }
        [StringLength(2000)]
        public string Biography { get; set; }
        public string UrlSlug { get; set; }
        //[StringLength(250)]
        //public string ImageName { get; set; }
        //[StringLength(1000)]
        //public string ImageDirectory { get; set; }
        [StringLength(2000)]
        public string ProfileImageFileLocation { get; set; }
        [StringLength(2000)]
        public string ProfileImageFileName { get; set; }
        public bool InitialRegistrationComplete { get; set; }
        public int InitialRegistrationStep { get; set; }
        public bool LocalLogin { get; set; }
        public bool HasGoogleAccountLinked { get; set; }
        public string UserFullName { get; set; }
        public string UserFirstName { get; set; }
        public string UserTitle { get; set; }
        public string UserEmail { get; set; }
        public string UserId { get; set; }
        public TutorApprovalStatus ProfileApprovalStatus { get; set; }
        public TutorApprovalStatus IDVerificationtStatus { get; set; }
        public Guid? StripePlanId { get; set; }
        //public string StripeCustomerId { get; set; }
        //public string StripeSubscriptionId { get; set; }
        public string StripeConnectAccountId { get; set; }
        public string StripeConnectBankAccountId { get; set; }
        public string SubjectNameList { get; set; }
        public string StoreProfileImageDownload
        {
            get
            {
                return !string.IsNullOrEmpty(ProfileImageFileLocation) ? $"/Company/Home/DownloadCompanyProfileImage/{CompanyId}?dummy={Guid.NewGuid()}" : "";
            }
        }
        public int CompanyCourseCount { get; set; }
        public List<Course> CompanyCourses { get; set; }
    }

    public interface ICompanyId
    {
        Guid CompanyId { get; }
    }
    public class CompanyProfileViewModel
    {
        public Guid CompanyId { get; set; }
        public string EmailAddress { get; set; }
        public string TelephoneNumber { get; set; }
        public string RegistrationNo { get; set; }
        public string Name { get; set; }
        public string UrlSlug { get; set; }
        public string Header { get; set; }
        public string SubHeader { get; set; }
        public string Biography { get; set; }
        public string Description { get; set; }
        public string WhoWeAre { get; set; }
        public string WhatWeDo { get; set; }
        public string WhyWeDoIt { get; set; }
        public string WhyChooseUs { get; set; }
        public string ProfileImageFileLocation { get; set; }
        public string StoreProfileImageDownload
        {
            get
            {
                return !string.IsNullOrEmpty(ProfileImageFileLocation) ? $"/Company/Home/DownloadCompanyProfileImage/{CompanyId}?dummy={Guid.NewGuid()}" : "";
            }
        }
        public decimal OneToOneMinPrice { get; set; }
        public decimal OneToOneMaxPrice { get; set; }
        public decimal GroupMinPrice { get; set; }
        public decimal GroupMaxPrice { get; set; }
        public int OneToOneLessonCount { get; set; }
        public int GroupLessonCount { get; set; }
        public int CompanyCourseCount { get; set; }
        public int CompanyTutorCount { get; set; }
        public List<CompanyRegisterProfileTeam> CompanyTeam { get; set; }
        public List<SubjectStudyLevelSetup> SubjectStudyLevelSetups { get; set; }
        public List<Course> Courses { get; set; }
        public List<Tutor> Tutors { get; set; }

    }
}
