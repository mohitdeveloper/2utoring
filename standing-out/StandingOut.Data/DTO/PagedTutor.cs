using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class PagedTutor
    {
        public Guid TutorId { get; set; }

        [StringLength(250)]
        public string StripeCustomerId { get; set; }
        [StringLength(250)]
        public string StripeSubscriptionId { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

        public TutorApprovalStatus DbsApprovalStatus { get; set; }
        public TutorApprovalStatus ProfileApprovalStatus { get; set; }
        public string DbsCertificateNumber { get; set; }
        public string UserFullName { get; set; }
        public string UserFirstName { get; set; }
        public string UserTitle { get; set; }
        public string UserEmail { get; set; }
        public string GoogleEmail { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime StartDate { get; set; }

    }



}
