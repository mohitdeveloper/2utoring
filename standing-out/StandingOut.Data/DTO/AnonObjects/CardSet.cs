using StandingOut.Data.Models;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    // FOR USE WITH INFO CARDS THROUGH THE SITE IF MULTIPLE NEEDED
    public class CardSet
    {
        public LessonCard Lesson { get; set; }
        public TutorCard Tutor { get; set; }
    }

    public class CourseCardSet
    {
        public DTO.Course Course { get; set; }
        public List<LessonCard> LessonList { get; set; }
        public TutorCard Tutor { get; set; }
    }
}
