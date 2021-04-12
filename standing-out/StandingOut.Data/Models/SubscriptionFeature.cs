using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    /// <summary>
    /// Allows the mapping of Features to Subscriptions and the respective "Setting" of that feature..
    /// </summary>
    public class SubscriptionFeature : EntityBase
    {
        [Key]
        public Guid SubscriptionFeatureId { get; set; }

        [Required]
        [ForeignKey("Subscription")]
        public Guid SubscriptionId { get; set; }

        [Required]
        [ForeignKey("Feature")]
        public Guid FeatureId { get; set; }

        [StringLength(2000)]
        public string Setting { get; set; } // Actual feature setting value e.g. 5, Off, Unlimited.. etc

        // Rule selection - These 3 values go together
        // Example setup: 
        // CompanySubscription <-> Feature [Admin	CommissionPerStudent	TieredCommission] <-> StudentAttendancePerMonthRange 1 - 15 = Setting = 4.00
        // CompanySubscription <-> Feature [Admin	CommissionPerStudent	TieredCommission] <-> StudentAttendancePerMonthRange 16 - 30 = Setting = 3.75
        // CompanySubscription <-> Feature [Admin	CommissionPerStudent	TieredCommission] <-> StudentAttendancePerMonthRange 31 - 50 = Setting = 3.50
        // CompanySubscription <-> Feature [Admin	CommissionPerStudent	TieredCommission] <-> StudentAttendancePerMonthRange 51 - 999999 = Setting = 3.25
        [StringLength(200)]
        public string RuleCriteria { get; set; } // "StudentAttendancePerMonthRange" 
        public int? RuleMin { get; set; }        // 1, 6, 21, 51
        public int? RuleMax { get; set; }        // 5, 20, 50, 999999
        // end of Rule selection

        public string Description { get; set; }

        public virtual Subscription Subscription { get; set; }
        public virtual Feature Feature { get; set; }
    }
}
