using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    [Table("CompanySubscription")]
    public class CompanySubscription : EntityBase
    {
        [Key]
        public Guid CompanySubscriptionId { get; set; }

        [ForeignKey("Company")]
        public Guid CompanyId { get; set; }

        [ForeignKey("Subscription")]
        public Guid SubscriptionId { get; set; }

        public virtual Company Company { get; set; }

        public virtual Subscription Subscription { get; set; }

        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
    }
}
