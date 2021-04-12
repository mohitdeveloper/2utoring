namespace StandingOut.Data.DTO
{
    public class StripeCard 
    {
        public StripeCard()
        {
        }

        public string PaymentMethodId { get; set; }
        public string Last4 { get; set; }
        public string Address { get; set; }
    }
}
