using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class TutorQualification : EntityBase
    {
        [Key]
        public Guid TutorQualificationId { get; set; }
        [ForeignKey("Tutor")]
        public Guid TutorId { get; set; }

        [StringLength(250)]
        public string Name { get; set; }

        public virtual Tutor Tutor { get; set; }
    }

}
