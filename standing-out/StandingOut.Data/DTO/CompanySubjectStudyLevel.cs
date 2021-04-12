using System;

namespace StandingOut.Data.DTO
{
    public class CompanySubjectStudyLevel
    {
        public Guid CompanySubjectStudyLevelId { get; set; }
        public Guid CompanySubjectId { get; set; }
        public Guid StudyLevelId { get; set; }

        public string StudyLevelName { get; set; }
        public bool Checked { get; set; }
    }

}
