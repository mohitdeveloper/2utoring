using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class SessionGroupDraggable
    {
        public SessionGroupDraggable()
        {
            AccordianCollapsed = false;
            SessionAttendees = SessionAttendees ?? new List<SessionAttendee>();
        }

        public bool AccordianCollapsed { get; set; } //this is used on the store only

        public Guid? SessionGroupId { get; set; }
        public Guid ClassSessionId { get; set; }

        [Required]
        [StringLength(250)]
        public string Name { get; set; }

        public bool ChatActive { get; set; }

        public bool Hide { get; set; }

        public List<SessionAttendee> SessionAttendees { get; set; }
    }

    public class TutorCommandGroups
    {
        public TutorCommandGroups()
        {
            AllSessionAttendees ??= new List<SessionAttendee>();
            Groups ??= new List<SessionGroupDraggable>();
        }

        public List<SessionAttendee> AllSessionAttendees { get; set; }
        public List<SessionGroupDraggable> Groups { get; set; }


    }
}
