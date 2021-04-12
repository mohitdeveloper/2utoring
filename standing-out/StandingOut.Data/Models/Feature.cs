using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Models
{
    /// <summary>
    /// The various features that need to be managed on the platform
    /// </summary>
    public class Feature : EntityBase
    {
        public Feature()
        {
            SubscriptionFeatures ??= new List<SubscriptionFeature>();
        }

        [Key]
        public Guid FeatureId { get; set; }

        [Required]
        [StringLength(2000)]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        [StringLength(2000)]
        public string FeatureArea { get; set; }

        [Required]
        [StringLength(2000)]
        public string Context { get; set; }
 
        public virtual List<SubscriptionFeature> SubscriptionFeatures { get; set; }
    }
}
