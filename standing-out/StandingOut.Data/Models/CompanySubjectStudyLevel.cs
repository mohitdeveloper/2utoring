using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class CompanySubjectStudyLevel : EntityBase
    {
        [Key]
        public Guid CompanySubjectStudyLevelId { get; set; }

        [ForeignKey("CompanySubject")]
        public Guid CompanySubjectId { get; set; }
        
        [ForeignKey("StudyLevel")]
        public Guid StudyLevelId { get; set; }

        public virtual CompanySubject CompanySubject { get; set; }
        public virtual StudyLevel StudyLevel { get; set; }
    }

}
