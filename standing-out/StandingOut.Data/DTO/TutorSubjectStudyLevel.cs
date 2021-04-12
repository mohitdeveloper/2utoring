using System;

namespace StandingOut.Data.DTO
{
    public class TutorSubjectStudyLevel
    {
        public Guid TutorSubjectStudyLevelId { get; set; }
        public Guid TutorSubjectId { get; set; }
        public Guid StudyLevelId { get; set; }

        public string StudyLevelName { get; set; }
        public bool Checked { get; set; }
    }

}
