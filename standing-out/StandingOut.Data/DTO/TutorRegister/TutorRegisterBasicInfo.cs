using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO.TutorRegister
{
    public class TutorRegisterBasicInfo
    {
        public string UserId { get; set; }
        public Guid? JoiningCompanyId { get; set; }
        public Guid? StripePlanId { get; set; }
        public Company CurrentCompany { get; set; }
        [Required]
        [StringLength(250)]
        public string Title { get; set; }
        [Required]
        [StringLength(250)]
        public string FirstName { get; set; }
        [Required]
        [StringLength(250)]
        public string LastName { get; set; }
        public string Email { get; set; }
        [StringLength(250)]
        public string TelephoneNumber { get; set; }
        [StringLength(250)]
        public string MobileNumber { get; set; }
        public int? DateOfBirthDay { get; set; }
        public int? DateOfBirthMonth { get; set; }
        public int? DateOfBirthYear { get; set; }
        public DateTime DateOfBirth { get; set; }
        public bool TermsAndConditionsAccepted { get; set; }
        public bool MarketingAccepted { get; set; }

        public int? PlatformUse { get; set; }
        public Guid? StripeCountryID { get; set; }
        public TutorApprovalStatus IDVerificationtStatus { get; set; }


    }
}


