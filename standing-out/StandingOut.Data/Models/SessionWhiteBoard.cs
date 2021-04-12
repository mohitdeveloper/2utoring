using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SessionWhiteBoard : EntityBase
    {
        public SessionWhiteBoard()
        {
            History = History ?? new List<SessionWhiteBoardHistory>();
            SessionWhiteBoardShares = SessionWhiteBoardShares ?? new List<SessionWhiteBoardShare>();
            Locked = false;
        }

        [Key]
        public Guid SessionWhiteBoardId { get; set; }        
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }
        [ForeignKey("SessionGroup")]
        public Guid? SessionGroupId { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }

        [StringLength(500)]
        public string Name { get; set; }

        public int SizeX { get; set; }
        public int SizeY { get; set; }

        public bool Locked { get; set; }
        public bool IsInactive { get; set; }

        public virtual ClassSession ClassSession { get; set; }
        public virtual SessionGroup SessionGroup { get; set; }
        public virtual User User { get; set; }

        public virtual List<SessionWhiteBoardHistory> History { get; set; }
        public virtual List<SessionWhiteBoardShare> SessionWhiteBoardShares { get; set; }
    }
}
