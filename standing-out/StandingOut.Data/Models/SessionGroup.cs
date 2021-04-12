using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SessionGroup : EntityBase
    {
        public SessionGroup()
        {
            SessionAttendees = SessionAttendees ?? new List<SessionAttendee>();
            SessionWhiteBoards = SessionWhiteBoards ?? new List<SessionWhiteBoard>();
            ChatActive = true;
            ReadMessagesTutor = 0;
        }

        [Key]
        public Guid SessionGroupId { get; set; }
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }

        [Required]
        [StringLength(250)]
        public string Name { get; set; }

        public int ReadMessagesTutor { get; set; }
        public bool ChatActive { get; set; }

        public virtual ClassSession ClassSession { get; set; }
        public virtual List<SessionAttendee> SessionAttendees { get; set; }
        public virtual List<SessionWhiteBoard> SessionWhiteBoards { get; set; }
    }
}
