using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Models
{
    public class StudyLevel : EntityBase
    {
        public StudyLevel()
        {

        }

        [Key]
        public Guid StudyLevelId { get; set; }

        [Required]
        [StringLength(250)]
        [RegularExpression("^[^;,\\/?:@&=$+-]*$")]
        public string Name { get; set; }
        [StringLength(300)]
        public string Url { get; set; }


        [Required]
        public int Order { get; set; }
    }
}
