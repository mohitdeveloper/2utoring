using System;

namespace StandingOut.Data.DTO
{
    public class Payment 
    {
        public string PaymentMethodId { get; set; }
        public Guid? PromoCode { get; set; }
        public string PaymentIntentId { get; set; }
        public string AddressLine1 { get; set; }
        public string CardName { get; set; }
        public Guid? StripeCountryId { get; set; }
    }
}
