using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Models
{
    public class Hub : EntityBase
    {
        public Hub()
        {
            ClassSessions = ClassSessions ?? new List<ClassSession>();
        }

        [Key]
        public Guid HubId { get; set; }
        [Required]
        [StringLength(15)]
        public string SubDomain { get; set; }

        public virtual List<ClassSession> ClassSessions { get; set; }
    }
}
