using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SessionOneToOneChatInstanceUser
    {
        [ForeignKey("User")]
        public string UserId { get; set; }
        [ForeignKey("SessionOneToOneChatInstance")]
        public Guid SessionOneToOneChatInstanceId { get; set; }
        public int ReadMessages { get; set; }

        public User User { get; set; }
        public SessionOneToOneChatInstance SessionOneToOneChatInstance { get; set; }
    }
}
