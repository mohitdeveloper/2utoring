using System;

namespace StandingOut.Data.DTO
{
    public class SessionAttendeeFileUploaderUser
    {
        public Guid SessionAttendeeId { get; set; }
        public string SessionAttendeeFolder { get; set; }
        public string Email { get; set; }
    }
}
