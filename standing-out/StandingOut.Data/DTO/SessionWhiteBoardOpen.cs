using System;

namespace StandingOut.Data.DTO
{
    public class SessionWhiteBoardOpen : SessionWhiteBoard
    {
        public SessionWhiteBoardOpen() { }

        public Guid LoadFromWhiteBoardId { get; set; }
        public DateTime? LoadFromDate { get; set; }
    }
}
