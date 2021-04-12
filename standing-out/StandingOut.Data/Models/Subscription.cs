using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class Subscription : EntityBase
    {
        public Subscription()
        {
            SubscriptionFeatures ??= new List<SubscriptionFeature>();
            TutorSubscriptions ??= new List<TutorSubscription>();
            CompanySubscriptions ??= new List<CompanySubscription>();
        }

        [Key]
        public Guid SubscriptionId { get; set; }

        [Required]
        [StringLength(2000)]
        public string SubscriptionName { get; set; }

        public string Description { get; set; }

        [Column(TypeName = "decimal(13,4)")]
        public decimal SubscriptionPrice { get; set; }

        public virtual List<SubscriptionFeature> SubscriptionFeatures { get; set; }

        public virtual List<TutorSubscription> TutorSubscriptions { get; set; }
        public virtual List<CompanySubscription> CompanySubscriptions { get; set; }
    }
}
