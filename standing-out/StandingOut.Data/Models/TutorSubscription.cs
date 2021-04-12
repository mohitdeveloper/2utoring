using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class TutorSubscription : EntityBase
    {
        [Key]
        public Guid TutorSubscriptionId { get; set; }

        [ForeignKey("Tutor")]
        public Guid TutorId { get; set; }

        [ForeignKey("Subscription")]
        public Guid SubscriptionId { get; set; }

        public virtual Tutor Tutor { get; set; }

        public virtual Subscription Subscription { get; set; }

        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
    }
}
