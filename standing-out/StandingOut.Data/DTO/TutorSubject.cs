using System;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class TutorSubject
    {
        public Guid TutorSubjectId { get; set; }
        public Guid TutorId { get; set; }
        public Guid SubjectId { get; set; }
        public Guid? SubjectCategoryId { get; set; }

        public List<TutorSubjectStudyLevel> TutorSubjectStudyLevels { get; set; }
        public string SubjectName { get; set; }
        public string SubjectCategoryName { get; set; }
        public string TutorSubjectStudyLevelsString { get; set; }
    }

}
