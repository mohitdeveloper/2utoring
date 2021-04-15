using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace StandingOut.Data.Models
{
    public class Tutor : EntityBase
    {
        public Tutor()
        {
            Users = Users ?? new List<User>();
            CompanyTutors = CompanyTutors ?? new List<CompanyTutor>();
            TutorSubscriptions ??= new List<TutorSubscription>();
            TutorAvailabilities ??= new List<TutorAvailability>();
        }

        [Key]
        public Guid TutorId { get; set; }
        [ForeignKey("StripePlan")]
        public Guid? StripePlanId { get; set; }

        [StringLength(250)]
        public string StripeCustomerId { get; set; } // cus_xxxxx
        [StringLength(250)]
        public string StripeSubscriptionId { get; set; } // sub_xxxxx
        public PaymentStatus PaymentStatus { get; set; }
        [StringLength(250)]
        public string SignUpVoucher { get; set; }

        public bool InitialRegistrationComplete { get; set; }
        public int InitialRegistrationStep { get; set; }
        public TutorApprovalStatus ProfileApprovalStatus { get; set; }
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
        public bool HasDbsCheck { get; set; }
        [StringLength(250)]
        public string DbsCertificateNumber { get; set; }
        public TutorApprovalStatus DbsApprovalStatus { get; set; }
        public TutorApprovalStatus IDVerificationtStatus { get; set; }
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

        public int? PlatformUse { get; set; }
        


        [StringLength(250)]
        public string StripeConnectAccountId { get; set; } // acct_xxxxxxx  (Setup on PayoutOauth - AuthenticateStripeConnectResponse only)
        [StringLength(250)]
        public string StripeConnectBankAccountId { get; set; } // ba__xxxxxxx
        public DateTime LastTimeStripeSubscriptionChecked { get; set; }
        public TutorCancelAccountReason? TutorCancelAccountReason { get; set; }
        [StringLength(1000)]
        public string TutorCancelAccountReasonDescription { get; set; }

        [StringLength(500)]
        public string UrlSlug { get; set; }
        public bool LinkAccountMessageRead { get; set; }
        public bool DbsStatusMessageRead { get; set; }
        public bool DbsApprovedMessageRead { get; set; }
        public bool DbsNotApprovedMessageRead { get; set; }
        public bool ProfileMessageRead { get; set; }
        public bool ProfileUpgradeMessageRead { get; set; }
        public bool ProfileSetupStarted { get; set; }
        public bool ProfileFieldsAllComplete { get; set; }

        // Bank details
        [StringLength(20)]
        public string BankAccountNumber { get; set; }
        [StringLength(10)]
        public string BankSortCode { get; set; }
        [StringLength(250)]
        public string AddressLine1 { get; set; }
        [StringLength(10)]
        public string PostCode { get; set; }

        [NotMapped]
        public string Name
        {
            get
            {
                if (Users != null && Users.Count > 0)
                {
                    return Users.Where(x => !x.IsDeleted).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault();
                } else
                {
                    return "";
                }
            }
        }

        public virtual StripePlan StripePlan { get; set; }
        public virtual List<User> Users { get; set; }
        public virtual List<CompanyTutor> CompanyTutors { get; set; }
        public virtual List<TutorQualification> TutorQualifications { get; set; }
        public virtual List<TutorCertificate> TutorCertificates { get; set; }
        public virtual List<TutorSubject> TutorSubjects { get; set; }
        public virtual List<TutorSubscription> TutorSubscriptions { get; set; }
        public virtual List<SubjectStudyLevelSetup> SubjectStudyLevelSetups { get; set; }
        public virtual List<TutorAvailability> TutorAvailabilities { get; set; }
    }

}
