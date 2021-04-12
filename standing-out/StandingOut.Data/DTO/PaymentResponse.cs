using System;

namespace StandingOut.Data.DTO
{
    public class PaymentResponse
    {
        public Guid? OrderId { get; set; }
        public Guid? PromoCodeId { get; set; }
        public string PaymentIntentId { get; set; }
        public string PaymentMethodId { get; set; }
        public string IntentClientSecret { get; set; }
        public bool RequiresAction { get; set; }
        public bool PaymentSucceeded { get; set; }
    }
}
