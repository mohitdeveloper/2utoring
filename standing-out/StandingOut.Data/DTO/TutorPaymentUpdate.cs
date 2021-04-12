using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class TutorPaymentUpdate
    {
        public Guid TutorId { get; set; }
        public Guid StripePlanId { get; set; }
        public Guid StripeCountryId { get; set; }
        [Required]
        [StringLength(250)]
        public string CardName { get; set; }
        [Required]
        [StringLength(250)]
        public string AddressLine1 { get; set; }
        [Required]
        public string PaymentMethodId { get; set; }       
    }
}


