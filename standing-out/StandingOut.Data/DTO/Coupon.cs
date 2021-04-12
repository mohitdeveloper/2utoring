namespace StandingOut.Data.DTO
{
    public class Coupon 
    {
        public Coupon()
        {
        }

        public string Id{ get; set; }
        public long? AmountOff { get; set; }
        public decimal? PercentOff { get; set; }
        public string Currency { get; set; }

        public string Duration { get; set; }
        public long? DurationInMonths { get; set; }


    }
}
