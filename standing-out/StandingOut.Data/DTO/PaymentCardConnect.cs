using System;

namespace StandingOut.Data.DTO
{
    public class PaymentCardConnect
    {
        public string PaymentMethodId { get; set; }
        public string CardName { get; set; }
        public Guid  stripeCountryId { get; set; }
        public string UserType { get; set; }
    }
}
