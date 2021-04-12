using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class CompanySubject : EntityBase
    {
        [Key]
        public Guid CompanySubjectId { get; set; }

        [ForeignKey("Company")]
        public Guid CompanyId { get; set; }
        
        [ForeignKey("Subject")]
        public Guid SubjectId { get; set; }
        
        [ForeignKey("SubjectCategory")]
        public Guid? SubjectCategoryId { get; set; }

        public virtual Company Company { get; set; }
        public virtual Subject Subject { get; set; }
        public virtual SubjectCategory SubjectCategory { get; set; }
        public virtual List<CompanySubjectStudyLevel> CompanySubjectStudyLevels { get; set; }
    }
}
