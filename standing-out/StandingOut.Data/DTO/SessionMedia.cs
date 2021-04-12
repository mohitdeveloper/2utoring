using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class SessionMedia 
    {
        public SessionMedia()
        {
            Display = true;
        }

        public Guid SessionMediaId { get; set; }
        public Guid ClassSessionId { get; set; }

        [Required]
        [StringLength(250)]
        public string Name { get; set; }
        [Required]
        public SessionMediaType Type { get; set; }

        [Required]
        [StringLength(2000)]
        public string Content { get; set; }

        public bool Display { get; set; }
        public bool FullScreen { get; set; }
    }
}
