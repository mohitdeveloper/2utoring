using System;

namespace StandingOut.Data.DTO
{
    public class SessionWhiteBoardShareLoad
    {
        public Guid SessionWhiteBoardId { get; set; }
        public string Name { get; set; }
        public DateTime SharedDate { get; set; }
    }
}
