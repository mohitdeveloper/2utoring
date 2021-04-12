using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SessionOneToOneChatInstance : EntityBase
    {
        public SessionOneToOneChatInstance()
        {
            SessionOneToOneChatInstanceUsers = SessionOneToOneChatInstanceUsers ?? new List<SessionOneToOneChatInstanceUser>();
            SessionMessages = SessionMessages ?? new List<SessionMessage>();
        }

        [Key]
        public Guid SessionOneToOneChatInstanceId { get; set; }
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }

        public bool Active { get; set; }

        public virtual ClassSession ClassSession { get; set; }
        public virtual List<SessionOneToOneChatInstanceUser> SessionOneToOneChatInstanceUsers { get; set; }
        public virtual List<SessionMessage> SessionMessages { get; set; }
    }
}
