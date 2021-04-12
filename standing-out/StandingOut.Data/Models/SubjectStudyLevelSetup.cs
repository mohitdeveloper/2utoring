using StandingOut.Data.Entity;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;

namespace StandingOut.Data.Models
{
    /// <summary>
    /// Common table for Tutor and Company to have a Subject-Level setup
    ///     Start with Pricing data.
    /// </summary>
    public class SubjectStudyLevelSetup : EntityBase
    {
        [Key]
        public Guid SubjectStudyLevelSetupId { get; set; }

        [ForeignKey("Company")]
        public Guid? CompanyId { get; set; }

        [ForeignKey("Tutor")]
        public Guid? TutorId { get; set; }

        // BOTH of these must be set..
        [ForeignKey("Subject")]
        public Guid SubjectId  { get; set; }

        [ForeignKey("StudyLevel")]
        public Guid StudyLevelId { get; set; }
        
        public virtual Subject Subject { get; set; }
        public virtual StudyLevel StudyLevel { get; set; }

        public virtual Company Company { get; set; }
        public virtual Tutor Tutor { get; set; }


        [Required]
        [Column(TypeName = "decimal(13,4)")]
        public decimal PricePerPerson { get; set; }
        
        [Column(TypeName = "decimal(13,4)")]
        public decimal? GroupPricePerPerson { get; set; }
    }
}
