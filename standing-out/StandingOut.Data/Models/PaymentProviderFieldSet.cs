using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Models
{
    public class PaymentProviderFieldSet : EntityBase
    {
        public PaymentProviderFieldSet()
        {
            PaymentProvider = PaymentProvider.Stripe;
            PaymentProviderFieldSetType = PaymentProviderFieldSetType.CardPayment;
        }

        [Key]
        public Guid PaymentProviderFieldSetId { get; set; }

        [Required]
        public PaymentProvider PaymentProvider { get; set; }
 
        // For now these are STRIPE fields, but could be repurposed for diff providers.
        public string ReceiptId { get; set; } // ReceiptId (in Stripeland PaymentIntentId)
        public string PaymentMethodId { get; set; } // User's Stripe PaymentMethodId

        // Extend to Store any other fields related to say Refunds, Transfer or Payouts
        public string VendorCreditId { get; set; } // Vendor (Tutor/Company)'s Stripe TransferId after Transfer success
        public string CreditLinkBack { get; set; } // TransferGroup value(OrderId) to link back to Order
        public string VendorPayoutId { get; set; } // Vendor (Tutor/Company)'s PayoutId
        public string UserRefundId { get; set; } // RefundId for a User's refund processing
        
        public PaymentProviderFieldSetType PaymentProviderFieldSetType { get; set; }
    }
}
