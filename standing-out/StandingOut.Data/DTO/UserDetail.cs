using System;

namespace StandingOut.Data.DTO
{
    public class UserDetail
    {
        public UserDetail()
        {
        }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
        public string TelephoneNumber { get; set; }
        public string MobileNumber { get; set; }
        public bool MarketingAccepted { get; set; }
        public bool TermsAndConditionsAccepted { get; set; }
        public bool IsSetupComplete { get; set; }
        public bool HasGoogleAccountLinked { get; set; }
        public bool LocalLogin { get; set; }
        public StripeCountry StripeCountry { get; set; }
    }
}
