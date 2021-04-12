using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class TutorSubject : EntityBase
    {
        [Key]
        public Guid TutorSubjectId { get; set; }

        [ForeignKey("Tutor")]
        public Guid TutorId { get; set; }
        
        [ForeignKey("Subject")]
        public Guid SubjectId { get; set; }
        
        [ForeignKey("SubjectCategory")]
        public Guid? SubjectCategoryId { get; set; }

        public virtual Tutor Tutor { get; set; }
        public virtual Subject Subject { get; set; }
        public virtual SubjectCategory SubjectCategory { get; set; }
        public virtual List<TutorSubjectStudyLevel> TutorSubjectStudyLevels { get; set; }
    }

}
