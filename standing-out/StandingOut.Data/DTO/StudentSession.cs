using System;

namespace StandingOut.Data.DTO
{
    public class StudentSession
    {
        public Guid ClassSessionId { get; set; }
        public Guid TutorId { get; set; }
        public string TutorName { get; set; }
        public bool Attended { get; set; }
        public DateTime? JoinDate { get; set; }
        public string SessionName { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public int TotalAttendees { get; set; }
        public bool SessionStarted { get; set; }
        public bool SessionCancelled { get; set; }
        public bool SessionEnded { get; set; }
        public bool SessionCompleted { get; set; }
        public string CurrentStatus
        {
            get
            {
                if (EndDate < DateTime.Now)
                    return "Finished";
                else if (StartDate > DateTime.Now)
                    return "Not Started";
                else
                    return "Running";
            }
        }
       
    }
}
