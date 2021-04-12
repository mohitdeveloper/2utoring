using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SessionMedia : EntityBase
    {
        public SessionMedia()
        {
        }

        [Key]
        public Guid SessionMediaId { get; set; }
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }

        [Required]
        [StringLength(250)]
        public string Name { get; set; }
        [Required]
        public SessionMediaType Type { get; set; }

        [Required]
        [StringLength(2000)]
        public string Content { get; set; }


        public virtual ClassSession ClassSession { get; set; }
    }
    }
