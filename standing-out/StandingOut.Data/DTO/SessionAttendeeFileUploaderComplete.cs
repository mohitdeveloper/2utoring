using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class SessionAttendeeFileUploaderComplete
    {
        public List<string> FileIds { get; set; }
        public List<SessionAttendeeFileUploaderShare> SessionAttendees { get; set; }
    }
}
