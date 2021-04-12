using StandingOut.Data.Enums;
using System;

namespace StandingOut.Data.DTO
{
    public class SafeguardReportIndex
    {
        public Guid SafeguardReportId { get; set; }
        public string SessionName { get; set; }
        public string TutorName { get; set; }
        public string UserName { get; set; }
        public DateTime LogDate { get; set; }
        public string Title { get; set; }
        public SafeguardReportStatus Status { get; set; }

    }
}
