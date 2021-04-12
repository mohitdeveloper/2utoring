using System;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class SessionAttendeeFileUploader
    {
        public SessionAttendeeFileUploader()
        {
            IsReadable = false;
            IsWriteable = false;
        }
        public Guid SessionAttendeeId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool IsReadable { get; set; }
        public bool IsWriteable { get; set; }
        public string FolderName { get; set; }

    }
}
