using System;

namespace StandingOut.Data.DTO
{
    public class SessionOneToOneChatInstance
    {
        public Guid SessionOneToOneChatInstanceId { get; set; }
        public Guid ClassSessionId { get; set; }

        public bool Active { get; set; }
    }
}
