using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class StripePlan : EntityBase
    {
        public StripePlan()
        {
        }

        [Key]
        public Guid StripePlanId { get; set; }

        public StripePlanType StripePlanType { get; set; }
        public StripePlanLevel StripePlanLevel { get; set; }

        [Required]
        [StringLength(1000)]
        public string StripeProductId { get; set; } 
        // Historically, we keep Stripe API ID in this (not  Product Id)

        [ForeignKey("Subscription")]
        public Guid? SubscriptionId { get; set; }

        [Required]
        [StringLength(250)]
        public string Description { get; set; }

        public int? FreeDays { get; set; }

        public virtual Subscription Subscription { get; set; }
    }
}
