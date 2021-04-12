using System;

namespace StandingOut.Data.DTO
{
    public class StripeSubscription
    {
        public StripeSubscription()
        {
        }

        public decimal Amount { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }

        //User For Hide Select button on front end
        public Guid? StripePlanId { get; set; }
    }
}
