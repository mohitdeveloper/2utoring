using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO.CompanyRegister
{
    // Screen 1 DTO
    public class CompanyRegisterBasicInfo
    {
        // #### Company section
        public Guid? CompanyId { get; set; }  // Co Id

        [StringLength(250)]
        public string CompanyName { get; set; }  // Co Name

      
        [StringLength(250)]
        public string CompanyRegistrationNumber { get; set; }
        
        [Required]
        [StringLength(250)]
        public string AddressLine1 { get; set; }
        
        [StringLength(250)]
        public string AddressLine2 { get; set; }

        public string Header { get; set; } = string.Empty;
        public string SubHeader { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        public string CompanyPostcode { get; set; }

        [Required]
        [StringLength(250)]
        public string Country { get; set; }

        [Required]
        public bool TermsAndConditionsAccepted { get; set; }
        public bool MarketingAccepted { get; set; }

        [StringLength(250)]
        public string CompanyEmail { get; set; }

        [StringLength(250)]
        public string CompanyTelephoneNumber { get; set; }
        public string CompanyMobileNumber { get; set; }

        public Guid? StripePlanId { get; set; }

        [StringLength(250)]
        public string StripeCustomerId { get; set; }
        [StringLength(250)]
        public string StripeSubscriptionId { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

        public bool InitialRegistrationComplete { get; set; }
        public int InitialRegistrationStep { get; set; }

        // #### USER Fields (Your Details)
        public string UserId { get; set; }

        [Required]
        [StringLength(250)]
        public string Title { get; set; }

        [Required]
        [StringLength(250)]
        public string FirstName { get; set; }
        
        [Required]
        [StringLength(250)]
        public string LastName { get; set; }

        [Required]
        [StringLength(250)]
        public string Email { get; set; }

        [StringLength(250)]
        public string TelephoneNumber { get; set; }
        public string MobileNumber { get; set; }
        public int? DateOfBirthDay { get; set; }
        public int? DateOfBirthMonth { get; set; }
        public int? DateOfBirthYear { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Guid? StripeCountryID { get; set; }
        // END User Fields
    }
}


