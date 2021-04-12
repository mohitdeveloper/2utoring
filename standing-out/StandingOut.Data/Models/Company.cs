using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StandingOut.Data.Enums;
using System.Linq;

namespace StandingOut.Data.Models
{
    public class Company : EntityBase
    {
        public Company()
        {
            CompanyTutors ??= new List<CompanyTutor>();
            CompanyTeam ??= new List<CompanyMember>();
            CompanySubscriptions ??= new List<CompanySubscription>();
            CompanySubjects ??= new List<CompanySubject>();
            CompanySubjectStudyLevels ??= new List<CompanySubjectStudyLevel>();
            SubjectStudyLevelSetups ??= new List<SubjectStudyLevelSetup>();
            Courses ??= new List<Course>();
        }

        [Key]
        public Guid CompanyId { get; set; }

        // ADMIN Details
        [ForeignKey("AdminUser")]
        public string AdminUserId { get; set; }

        // COMPANY Details
        [Required]
        [StringLength(250)]
        public string Name { get; set; }

        [Required]
        [StringLength(250)]
        public string Header { get; set; } = string.Empty;

        [Required]
        [StringLength(250)]
        public string SubHeader { get; set; } = string.Empty;

        [StringLength(2000)]
        public string Biography { get; set; }
        [StringLength(250)]
        public string ImageName { get; set; }
        [StringLength(1000)]
        public string ImageDirectory { get; set; }

        [StringLength(2000)]
        public string Description { get; set; }
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
        public string RegistrationNo { get; set; }
        [StringLength(2000)]
        public string Role { get; set; }

        [StringLength(250)]
        public string AddressLine1 { get; set; }

        [StringLength(250)]
        public string AddressLine2 { get; set; }

        [StringLength(10)]
        public string Postcode { get; set; }

        [StringLength(250)]
        public string Country { get; set; }

        [StringLength(250)]
        public string TelephoneNumber { get; set; }
        [StringLength(250)]
        public string MobileNumber { get; set; }
        [StringLength(250)]
        public string EmailAddress { get; set; }

        [Required]
        public bool TermsAndConditionsAccepted { get; set; }
        public bool MarketingAccepted { get; set; }

        // STRIPE fields (TechDebt - Move to Subscription/Payment provider field set)
        [ForeignKey("StripePlan")]
        public Guid? StripePlanId { get; set; }

        [StringLength(250)]
        public string StripeCustomerId { get; set; }

        [StringLength(250)]
        public string StripeSubscriptionId { get; set; }
        [StringLength(250)]
        public string StripeConnectAccountId { get; set; }
        [StringLength(250)]
        public string StripeConnectBankAccountId { get; set; }
        public DateTime LastTimeStripeSubscriptionChecked { get; set; }
        public CompanyCancelAccountReason? CompanyCancelAccountReason { get; set; }
        [StringLength(1000)]
        public string CompanyCancelAccountReasonDescription { get; set; }

        public PaymentStatus PaymentStatus { get; set; }
        public TutorApprovalStatus ProfileApprovalStatus { get; set; }
        public bool ProfileMessageRead { get; set; }
        public bool ProfileSetupStarted { get; set; }
        public bool ProfileFieldsAllComplete { get; set; }
        public TutorApprovalStatus IDVerificationtStatus { get; set; }
        


        [StringLength(250)]
        public string PromoCode { get; set; }

        // REGISTRATION specific fields
        public bool InitialRegistrationComplete { get; set; }
        public int InitialRegistrationStep { get; set; }

        [StringLength(250)]
        public string PaymentAddressLine1 { get; set; }
        [StringLength(250)]
        public string PaymentPostcode { get; set; }

        public string ProfileImageFileLocation { get; set; }
        [StringLength(2000)]
        public string ProfileImageFileName { get; set; }
        [StringLength(500)]
        public string UrlSlug { get; set; }

        public string StoreProfileImageDownload
        {
            get
            {
                return !string.IsNullOrEmpty(ProfileImageFileLocation) ? $"/Company/Home/DownloadCompanyProfileImage/{CompanyId}?dummy={Guid.NewGuid()}" : "";
            }
        }

        public string AdminName
        {
            get
            {
                if (AdminUser != null && !AdminUser.IsDeleted)
                {
                    return AdminUser.FirstName + " " + AdminUser.LastName;
                }
                else
                {
                    return "";
                }
            }
        }

        //public List<CompanyTutor> ActiveCompanyTutors
        //{
        //    get
        //    {
        //        return CompanyTutors.Any() ?
        //            CompanyTutors.Where(x => 
        //                x.ActualStartDate != null && x.ActualStartDate < DateTime.UtcNow && 
        //                (x.ActualEndDate == null || x.ActualEndDate > DateTime.UtcNow)
        //            ).ToList()
        //            : new List<CompanyTutor>();
        //    }
        //}

        // NAVIGATION Fields
        public virtual User AdminUser { get; set; }
        public virtual StripePlan StripePlan { get; set; }
        public virtual List<CompanyMember> CompanyTeam { get; set; }
        public virtual List<Course> Courses { get; set; }
        public virtual List<CompanyTutor> CompanyTutors { get; set; }
        public virtual List<CompanySubscription> CompanySubscriptions { get; set; }
        public virtual List<CompanySubject> CompanySubjects { get; set; }
        public virtual List<CompanySubjectStudyLevel> CompanySubjectStudyLevels { get; set; }
        public virtual List<SubjectStudyLevelSetup> SubjectStudyLevelSetups { get; set; }
    }
}
