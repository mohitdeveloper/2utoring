using System;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class CompanySubject
    {
        public Guid CompanySubjectId { get; set; }
        public Guid CompanyId { get; set; }
        public Guid SubjectId { get; set; }
        public Guid? SubjectCategoryId { get; set; }

        public List<CompanySubjectStudyLevel> CompanySubjectStudyLevels { get; set; }
        public string SubjectName { get; set; }
        public string SubjectCategoryName { get; set; }
        public string CompanySubjectStudyLevelsString { get; set; }
    }

}
