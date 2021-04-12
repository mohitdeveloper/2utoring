using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class TutorSubjectStudyLevel : EntityBase
    {
        [Key]
        public Guid TutorSubjectStudyLevelId { get; set; }

        [ForeignKey("TutorSubject")]
        public Guid TutorSubjectId { get; set; }
        
        [ForeignKey("StudyLevel")]
        public Guid StudyLevelId { get; set; }

        public virtual TutorSubject TutorSubject { get; set; }
        public virtual StudyLevel StudyLevel { get; set; }
    }

}
