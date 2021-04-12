using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SessionAttendee : EntityBase
    {
        public SessionAttendee()
        {
            ReadMessagesAll = 0;
            ReadMessagesGroup = 0;

            //TutorPaid = TutorPaymentStatus.Pending; // Here on if the ClassSessionId appears in VendorEarning then we know it's been credited to vendor
            RoomJoinEnabled = true;
            VideoEnabled = true;
            AudioEnabled = true;
            ScreenShareEnabled = true;
            CallIndividualsEnabled = true;
            GroupVideoEnabled = true;
            GroupAudioEnabled = true;
            GroupScreenShareEnabled = true;
            GroupRoomJoinEnabled = true;
            ChatActive = true;
            AllWhiteboardActive = true;
            GroupWhiteboardActive = true;
        }

        [Key]
        public Guid SessionAttendeeId { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        [ForeignKey("PromoCode")]
        public Guid? PromoCodeId { get; set; }
        [ForeignKey("SessionGroup")]
        public Guid? SessionGroupId { get; set; }
        [Required]
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }
        // public string PaymentIntentId { get; set; } // TODO now stored in Order
        [ForeignKey("VendorEarning")]
        public Guid? VendorEarningId { get; set; } // An attendee's Tutor fees only forms part of VendorEarnings once.

        [ForeignKey("AttendeeRefund")]
        public Guid? AttendeeRefundId { get; set; }
        [Required]
        [StringLength(250)]
        public string Email { get; set; }
        [Required]
        [StringLength(250)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }
        [Required]
        [StringLength(250)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        [StringLength(500)]
        public string SessionAttendeeDirectoryName { get; set; }

        [StringLength(100)]
        public string SessionAttendeeDirectoryId { get; set; }

        public int ReadMessagesAll { get; set; }
        public int ReadMessagesGroup { get; set; }

        public bool Attended { get; set; }
        public DateTime? JoinDate { get; set; }

        public bool VideoEnabled { get; set; }
        public bool AudioEnabled { get; set; }
        public bool RoomJoinEnabled { get; set; }
        public bool ScreenShareEnabled { get; set; }
        public bool GroupVideoEnabled { get; set; }
        public bool GroupAudioEnabled { get; set; }
        public bool GroupRoomJoinEnabled { get; set; }
        public bool GroupScreenShareEnabled { get; set; }

        public bool CallIndividualsEnabled { get; set; }
        public bool ChatActive { get; set; }

        public bool AllWhiteboardActive { get; set; }
        public bool GroupWhiteboardActive { get; set; }

        public bool HelpRequested { get; set; }

        // All these Refund fields are in OrderRefund now.
        public bool Refunded { get; set; }
        //public DateTime? RefundedDate { get; set; }
        //public string RefundedBy { get; set; }

        //[Column(TypeName = "decimal(13,4)")]
        //public decimal RefundedAmount { get; set; }

        public bool Removed { get; set; }
        public DateTime? RemovedDate { get; set; }
        public string RemovedBy { get; set; }

        //public bool IsRefundStudentInitiated { get; set; } // Now OrderRefund IsRefundUserInitiated

        [Required]
        [Column(TypeName = "decimal(13,4)")]
        public decimal AmountCharged { get; set; } // As per price per lesson less any discount (this is used for refund)
        [Column(TypeName = "decimal(13,4)")]
        public decimal? StandingOutPercentageCut { get; set; } // TODO nullable.. as not known until lesson end
        [Column(TypeName = "decimal(13,4)")]
        public decimal? StandingOutActualCut { get; set; } // TODO nullable.. as not known until lesson end

        public decimal? VendorAmount { get; set; } // TODO New prop - populate and map at session end (used for VendorEarnings)
        // Attendee is created as part of an orderItem/basketItem
        [ForeignKey("OrderItem")]
        public Guid? OrderItemId { get; set; } // TODO New prop (set on Order creation)
        [ForeignKey("Order")]
        public Guid? OrderId { get; set; } // TODO New prop (set on Order creation)

        // TODO - All Stripe Transfer and Payout fields now part of VendorEarnings and VendorPayout
        //public TutorPaymentStatus TutorPaid { get; set; }
        //[StringLength(1000)]
        //public string TutorPaymentFailureNote { get; set; } // Unused..
        //[StringLength(250)]
        //public string TutorStripeTransferId { get; set; }
        //[StringLength(250)]
        //public string TutorStripePayoutId { get; set; }
        //public string StripePayoutError { get; set; }

        public virtual OrderItem OrderItem { get; set; }
        public virtual Order Order { get; set; }
        public virtual OrderRefund AttendeeRefund { get; set; } // Set when a refund is done.
        public virtual User User { get; set; }
        public virtual VendorEarning VendorEarning { get; set; } // An attendee's Tutor fees only forms part of VendorEarnings once.
        public virtual PromoCode PromoCode { get; set; }
        public virtual SessionGroup SessionGroup { get; set; }
        public virtual ClassSession ClassSession { get; set; }
        public virtual List<GoogleFilePermission> GoogleFilePermissions { get; set; }

    }
}
