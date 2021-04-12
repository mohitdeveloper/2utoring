using StandingOut.Data.Enums;
using System;

namespace StandingOut.Data.DTO
{
    public class LessonTimetableLesson
    {
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public int Duration { get; set; }
        public bool Started { get; set; }
        public bool Ended { get; set; }
        public bool Cancel { get; set; }
        public bool Complete { get; set; }
        public bool CanStart { get; set; }
        //{
        //    get
        //    {
        //        return StartDate < DateTime.UtcNow.AddMinutes(30);
        //    }
        //}
        public string Name { get; set; }
        public Guid ClassSessionId { get; set; }
        public Guid CourseId { get; set; }
        public ClassSessionType Type { get; set; }

        public int AttendeeCount { get; set; }
        public bool RequiresGoogleAccount { get; set; }

        public bool IsBasicTutor { get; set; }
    }
}


