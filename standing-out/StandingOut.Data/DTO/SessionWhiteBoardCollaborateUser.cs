using System;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class SessionWhiteBoardCollaborateGrouping
    {
        public SessionWhiteBoardCollaborateGrouping()
        {
            Whiteboards = Whiteboards ?? new List<SessionWhiteBoardCollaborate>();
        }
        public string UserId { get; set; }
        public Guid GroupId { get; set; }
        public string Name { get; set; }
        public List<SessionWhiteBoardCollaborate> Whiteboards { get; set; }
    }
}
