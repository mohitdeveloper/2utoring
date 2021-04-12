using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class StudyLevel 
    {
        public StudyLevel()
        {

        }

        public Guid StudyLevelId { get; set; }

        [Required]
        [StringLength(250)]
        public string Name { get; set; }
        [Required]
        public int Order { get; set; }
    }
}
