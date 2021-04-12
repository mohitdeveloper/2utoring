using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class ClassSessionFeatures
    {
        public int TutorDashboard_EditLesson_Session_MaxPersons { get; set; }
        public int TutorDashboard_CreateLesson_Session_MaxPersons { get; set; }
        
        // Take the below 6 switches into account when creating/editing course 
        // Private/Public Course - limit number of lessons using PrivateLessonCount/PublicLessonCount
        // Under18 Course - Allow radio as per bool
        public int TutorDashboard_CreateCourse_PrivateLessonCount { get; set; }
        public int TutorDashboard_EditCourse_PrivateLessonCount { get; set; }
        public int TutorDashboard_CreateCourse_PublicLessonCount { get; set; }
        public int TutorDashboard_EditCourse_PublicLessonCount { get; set; }
        public int Classroom_ClassroomEntryTime_MinutesBeforeEntry { get; set; }
        public bool TutorDashboard_CreateCourse_Under18 { get; set; }
        public bool TutorDashboard_EditCourse_Under18 { get; set; }

        public bool AdminDashboard_DBSApproval_ApprovalRequired { get; set; }
        public bool AdminDashboard_ProfileApproval_ApprovalRequired { get; set; }

        public int ClassroomTutorCommand_Groups_MaxGroups { get; set; }
        public int TutorDashboard_Lesson_MaxGroups { get; set; }
        public bool Menu_Panes_TriPaneEnabled { get; set; }
        public bool Menu_Panes_QuadPaneEnabled { get; set; }

        //public bool OpenDoc_Panes_TriPaneEnabled { get; set; }
        //public int TutorDashboard_Lesson_GroupSize { get; set; }
        public bool Classroom_EnterClass_SessionRecordingEnabled { get; set; }
        public bool TutorDashboard_View_CompletedLesson { get; set; }
        public bool StudentDashboard_View_CompletedLesson { get; set; }

        // public decimal[] Admin_CommissionPerStudent { get; set; }

        public List<CommissionPerStudentTier> Admin_CommissionPerStudent_StudentAttendancePerMonthTiers { get; set; } 
            = new List<CommissionPerStudentTier>();
    }

    public class CommissionPerStudentTier
    {
        public string RuleCriteria { get; set; }
        public int RuleMin { get; set; }
        public int RuleMax { get; set; }
        public decimal Setting { get; set; }
    }
}
