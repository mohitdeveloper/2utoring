using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class Subject 
    {
        public Subject()
        {
        }

        public Guid SubjectId { get; set; }

        [Required]
        [StringLength(250)]
        public string Name { get; set; }

    }
}
