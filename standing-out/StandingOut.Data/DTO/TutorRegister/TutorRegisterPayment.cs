using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO.TutorRegister
{
    public class TutorRegisterPayment
    {
        public string UserId { get; set; }
        public Guid StripePlanId { get; set; }
        public Guid StripeCountryId { get; set; }
        public Guid? TutorId { get; set; }
        [Required]
        [StringLength(250)]
        public string CardName { get; set; }
        [Required]
        [StringLength(250)]
        public string AddressLine1 { get; set; }
        [Required]
        public string PaymentMethodId { get; set; }
        public string IntentId { get; set; }
        public string StripeSubscriptionId { get; set; }
        public string IntentClientSecret { get; set; }
        public string StripeCustomerId { get; set; }
        public bool RequiresAction { get; set; }
        [StringLength(250)]
        public string PromoCode { get; set; }



        public Guid? NewStripePlanId { get; set; }
        public Guid? NewSubscriptionId { get; set; }
        public TutorApprovalStatus DbsApprovalStatus { get; set; }
        public TutorApprovalStatus ProfileApprovalStatus { get; set; }
        public DbsCheckData DbsCheckData { get; set; }

    }

    public class DbsCheckData
    {
        public string DbsCertificateNumber { get; set; }
        public bool HasDbsCheck { get; set; }
    }
}


