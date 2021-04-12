using StandingOut.Data.Enums;
using StandingOut.Data.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class StripePlan
    {
        public StripePlan()
        {
        }

        public Guid StripePlanId { get; set; }

        public StripePlanType StripePlanType { get; set; }
        public StripePlanLevel StripePlanLevel { get; set; }

        [Required]
        [StringLength(1000)]
        public string StripeProductId { get; set; }
        [Required]
        [StringLength(250)]
        public string Description { get; set; }        
        public Subscription Subscription { get; set; }        
        public int FreeDays { get; set; }        
    }



}
