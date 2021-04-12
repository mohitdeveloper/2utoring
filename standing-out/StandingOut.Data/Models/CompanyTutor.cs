using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    /// <summary>
    /// Represents the relationship between Company and Tutor.
    /// Active tutor = where (ActualStartDate is in Past AND (ActualEndDate is null or in future).
    /// Ex-tutor = where (ActualStartDate and ActualEndDate are in Past).
    /// Joiner (prospective) tutor = where PreferredStartDate is in past and ActualStartDate is null OR in Future
    /// Leaver (soon leaving) tutor = where (ActualStartDate & PreferredEndDate is in past) AND (ActualEndDate is null or in future).
    /// </summary>
    public class CompanyTutor : EntityBase
    {
        [Key]
        public Guid CompanyTutorId { get; set; }

        [ForeignKey("Company")]
        public Guid CompanyId { get; set; }
        
        [ForeignKey("Tutor")]
        public Guid TutorId { get; set; }

        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public DateTime? PreferredStartDate { get; set; }
        public DateTime? PreferredEndDate { get; set; }

        public virtual Company Company { get; set; }
        public virtual Tutor Tutor { get; set; }
    }
}
