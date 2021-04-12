using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Models
{
    public class Subject : EntityBase
    {
        public Subject()
        {
            SubjectCategories ??= new List<SubjectCategory>();
        }

        [Key]
        public Guid SubjectId { get; set; }

        [Required]
        [StringLength(250)]
        [RegularExpression("^[^;,\\/?:@&=$+-]*$")]
        public string Name { get; set; }
        [StringLength(300)]
        public string Url { get; set; }

        public virtual List<SubjectCategory> SubjectCategories { get; set; }
    }
}
