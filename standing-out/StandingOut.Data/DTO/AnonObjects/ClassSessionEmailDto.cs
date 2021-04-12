using System;

namespace StandingOut.Data.DTO
{
    public class ClassSessionEmailDto
    {
        public string TutorFirstName { get; set; }
        public string TutorLastName { get; set; }
        public string TutorEmail { get; set; }
        public string LessonName { get; set; }
        public DateTimeOffset LessonStartDate { get; set; }
        public decimal LessonPrice { get; set; }
    }
}
