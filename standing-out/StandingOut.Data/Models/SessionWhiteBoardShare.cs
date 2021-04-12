using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SessionWhiteBoardShare : EntityBase
    {
        public SessionWhiteBoardShare() { }

        [Key]
        public Guid SessionWhiteBoardShareId { get; set; }
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }
        [ForeignKey("SessionWhiteBoard")]
        public Guid SessionWhiteBoardId { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }

        public bool WritePermissions { get; set; }

        public virtual ClassSession ClassSession { get; set; }
        public virtual SessionWhiteBoard SessionWhiteBoard { get; set; }
        public virtual User User { get; set; }
    }
}
