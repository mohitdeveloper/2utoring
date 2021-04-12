using System;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class LessonTimetableDay
    {
        public LessonTimetableDay()
        {
            Lessons ??= new List<LessonTimetableLesson>();
        }
        public DateTimeOffset Date { get; set; }
        public List<LessonTimetableLesson> Lessons { get; set; }
    }
}


