using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class AdminTutorDetails
    {
        public AdminTutorDetails()
        {
            TutorQualifications ??= new List<TutorQualification>();
            TutorCertificates ??= new List<TutorCertificate>();
        }

        public Guid TutorId { get; set; }

        [StringLength(250)]
        public string StripeCustomerId { get; set; }
        [StringLength(250)]
        public string StripeSubscriptionId { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

        public bool InitialRegistrationComplete { get; set; }
        public int InitialRegistrationStep { get; set; }
        public TutorApprovalStatus ProfileApprovalStatus { get; set; }

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

        [StringLength(2000)]
        public string ProfileTeachingExperiance { get; set; }
        [StringLength(2000)]
        public string ProfileHowITeach { get; set; }
        [StringLength(2000)]
        public string ProfileImageFileLocation { get; set; }
        [StringLength(2000)]
        public string ProfileImageFileName { get; set; }

        public string UserFullName { get; set; }
        public string UserFirstName { get; set; }
        public string UserTitle { get; set; }
        public string UserEmail { get; set; }

        public DateTime? DateOfBirth { get; set; }


        public string DbsCertificateFileName { get; set; }

        public string StripePlanName { get; set; }
        public string StoreProfileImageDownload
        {
            get
            {
                return !string.IsNullOrEmpty(ProfileImageFileLocation) ? $"/Tutor/Home/DownloadTutorProfileImage/{TutorId}?dummy={Guid.NewGuid()}" : "";
            }
        }

        public virtual List<TutorQualification> TutorQualifications { get; set; }
        public virtual List<TutorCertificate> TutorCertificates { get; set; }
      
    }



}
