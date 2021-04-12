using StandingOut.Data.Enums;
using System;

namespace StandingOut.Data.DTO
{
    public class Vendor
    {
        public Vendor()
        {
        }

        public Guid VendorId { get; set; } // Could be TutorId or CompanyId
        public VendorType VendorType { get; set; }
        public Guid? StripePlanId { get; set; }

        public string StripeCustomerId { get; set; }
        public string StripeSubscriptionId { get; set; }
        public string StripeConnectAccountId { get; set; }
        public string StripeConnectBankAccountId { get; set; }
        public string UserFullName { get; set; }
        public string UserFirstName { get; set; }
        public string UserTitle { get; set; }
        public string UserEmail { get; set; }
        public string UserId { get; set; }

        public string BankAccountNumber { get; set; }
        public string BankSortCode { get; set; }
        public string AddressLine1 { get; set; }
        public string PostCode { get; set; }
    }
}
