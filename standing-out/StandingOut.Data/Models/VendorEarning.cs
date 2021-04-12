using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    /// <summary>
    /// Vendors earnings per order per lesson. May record Earnings but Stripe Transfer may happen later when they a StripeConnectAccount (register for payout)
    /// Ideally at lesson end they should have registered for Stripe.
    /// </summary>
    public class VendorEarning : EntityBase
    {
        public VendorEarning()
        {
            SessionAttendees ??= new List<SessionAttendee>(); 
        }

        [Key]
        public Guid VendorEarningId { get; set; }

        [ForeignKey("Tutor")]
        public Guid? TutorId { get; set; }

        [ForeignKey("Company")]
        public Guid? CompanyId { get; set; }

        [Required]
        [ForeignKey("Order")]
        public Guid OrderId { get; set; }

        [Required]
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }

        [ForeignKey("PaymentProviderFieldSet")]
        public Guid? PaymentProviderFieldSetId { get; set; }
        
        public PaymentProviderFieldSet PaymentProviderFieldSet { get; set; } // TransferId etc
        [ForeignKey("VendorPayout")]
        public Guid? VendorPayoutId {get; set;}

        [Column(TypeName = "decimal(13,4)")]
        public decimal EarningAmount { get; set; }
        public virtual Tutor Tutor { get; set; }
        public virtual Company Company { get; set; }
        public virtual Order Order { get; set; }
        public virtual ClassSession ClassSession { get; set; }
        
        public virtual VendorPayout VendorPayout { get; set; }
        public virtual List<SessionAttendee> SessionAttendees { get; set; }
    }
}