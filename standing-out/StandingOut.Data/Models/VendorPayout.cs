using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    /// <summary>
    /// Vendors payout is rolled up per lesson (see Vendor sees "Payout for Lesson X of blah Date) on their bank-account"
    /// Earning for a lesson is in small chunks as one or more orders come thru that lesson (enrolment).
    /// Payout is sum of all such earnings for that lesson.
    /// </summary>
    public class VendorPayout : EntityBase
    {
        public VendorPayout()
        {
            VendorEarnings ??= new List<VendorEarning>(); 
        }

        [Key]
        public Guid VendorPayoutId { get; set; }

        [ForeignKey("Tutor")]
        public Guid? TutorId { get; set; }

        [ForeignKey("Company")]
        public Guid? CompanyId { get; set; }

        [Required]
        [Column(TypeName = "decimal(13,4)")]
        public decimal AmountPaid { get; set; }

        [Required]
        public DateTimeOffset PaymentDate { get; set; }

        [ForeignKey("PaymentProviderFieldSet")]
        public Guid? PaymentProviderFieldSetId { get; set; }
        
        public virtual PaymentProviderFieldSet PaymentProviderFieldSet { get; set; }
        
        public virtual Tutor Tutor { get; set; }
        public virtual Company Company { get; set; }
        public virtual List<VendorEarning> VendorEarnings { get; set; }
    }
}