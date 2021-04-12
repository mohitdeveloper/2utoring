using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class Order : EntityBase
    {
        public Order()
        {
            OrderStatus = OrderStatus.Created;
            OrderPaymentStatus = OrderPaymentStatus.Pending;
            OrderItems ??= new List<OrderItem>();
            OrderRefunds ??= new List<OrderRefund>();
            SessionAttendees ??= new List<SessionAttendee>();
        }

        [Key]
        public Guid OrderId { get; set; }

        [Required]
        public OrderStatus OrderStatus { get; set; }

        [StringLength(2000)]
        public string OrderProcessingNote { get; set; }

        // PAYMENT Fields (only set on payment processed)
        [Required]
        [ForeignKey("PayerUser")]
        public string PayerUserId { get; set; } // User holds their own StripeCustomerId (auto-gend when payment card created)

        [Required]
        public OrderPaymentStatus OrderPaymentStatus { get; set; }

        [Column(TypeName = "decimal(13,4)")]
        public decimal? AmountCharged { get; set; }

        [StringLength(3)]
        public string Currency { get; set; } // CurrencyIso code

        [ForeignKey("PaymentProviderFields")]
        public Guid? PaymentProviderFieldSetId { get; set; }

        // Holds Stripe PaymentIntent and PaymentMethodId, Set once payment succeeds
        public virtual PaymentProviderFieldSet PaymentProviderFields { get; set; }

        // PROMOTION Fields
        [ForeignKey("PromoCode")]
        public Guid? PromoCodeId { get; set; }

        // REFUND/Cancellation Fields
        public virtual User PayerUser { get; set; }
        public virtual PromoCode PromoCode { get; set; }

        // Navigation fields
        public List<OrderItem> OrderItems { get; set; }
        public List<OrderRefund> OrderRefunds { get; set; }
        public List<SessionAttendee> SessionAttendees { get; set; }
    }
}

/* 
 * TODO Windows Service - Unpaid Courses Cleanup job.
 * Any Course created by Student/Parent (ie Website) which has not been paid for within 15 min is to be reverted.
 * ALSO check if this is the only purchase for that lesson, free up the tutor availability all the course lessons.
 * SO Any Order unpaid for 15 mins - 
 *  1) Cleanup User created courses and if this the only Order for the course, free up the enrolments (mark removed) & free up tutor avls TBC
 *  2) Cleanup any enrolments created by this order (mark them removed), nothing to refund.
 * 
 * PaymentmentIntent -> Courses -> Full Amount
 *  Course1   -> 100 -> T1 (70)
 *  Course2   -> 200 -> T2 (70)
 * Assumption - ONLY Full Course purchases allowed.
 *      - If course partway thru, still remaining course purchase allowed (BUT NOT selective lessons of a course)
 */
