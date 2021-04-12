using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class SessionWhiteBoardCollaborateOverall
    {
        public SessionWhiteBoardCollaborateOverall()
        {
            Groups = Groups ?? new List<SessionWhiteBoardCollaborateGrouping>();
            Users = Users ?? new List<SessionWhiteBoardCollaborateGrouping>();
        }
        public List<SessionWhiteBoardCollaborateGrouping> Groups { get; set; }
        public List<SessionWhiteBoardCollaborateGrouping> Users { get; set; }
    }
}
