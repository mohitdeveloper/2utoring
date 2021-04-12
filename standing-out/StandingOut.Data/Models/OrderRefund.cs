using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    /// <summary>
    /// When full or part order is being refunded or cancelled
    /// Always Refunded back to original Payer..
    /// </summary>
    public class OrderRefund : EntityBase
    {
        public OrderRefund()
        {
            RefundProcessingStatus = RefundProcessingStatus.Pending;
        }

        [Key]
        public Guid OrderRefundId { get; set; }

        [Required]
        [ForeignKey("Order")]
        public Guid OrderId { get; set; }
        [Required]
        public RefundProcessingStatus RefundProcessingStatus { get; set; }
        [ForeignKey("PaymentProviderFields")]
        public Guid? PaymentProviderFieldSetId { get; set; }

        [StringLength(2000)]
        public string RefundProcessingNote { get; set; }

        [Column(TypeName = "decimal(13,4)")]
        public decimal? Amount { get; set; }

        [Column(TypeName = "decimal(13,4)")]
        public decimal? Deduction { get; set; }
        public bool IsRefundUserInitiated { get; set; }
        public bool IsSystemInitiated { get; set; }

        // What does the refund trace back to.. SessionAttendee, Course, Lesson or something else.
        // For now we only issue refund for a SessionAttendee (normally 1 item)
        public List<SessionAttendee> RefundedAttendees { get; set; }

        public virtual PaymentProviderFieldSet PaymentProviderFields { get; set; }
        public virtual Order Order { get; set; }
    }
}
