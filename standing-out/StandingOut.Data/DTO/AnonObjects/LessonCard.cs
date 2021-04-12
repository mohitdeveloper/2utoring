using System;

namespace StandingOut.Data.DTO
{
    // FOR USE WITH THE LESSON CARD PARTIAL THAT POPS UP EVERYWHERE
    public class LessonCard
    {
        public string SubjectName { get; set; }
        public string SubjectCategoryName { get; set; }
        public string SessionName { get; set; }
        public string StudyLevelName { get; set; }
        
        public Guid TutorId { get; set; }
        public string TutorSalutation { get; set; }
        public string TutorFirstName { get; set; }
        public string TutorLastName { get; set; }
        public string TutorProfileImageFileLocation { get; set; }
        public bool IsApproved { get; set; }
        public string[] TutorSubjects { get; set; }

        public int SessionDuration { get; set; }
        public int SessionRemainingSpaces { get; set; }
        public DateTimeOffset SessionDate { get; set; }
        
        public string SessionDescriptionBody { get; set; }
        
        public decimal SessionPrice { get; set; }
        public string SessionCurrency { get; set; }

        public Guid ClassSessionId { get; set; }

        public bool IsUnder16 { get; set; }
        public bool RequiresGoogleAccount { get; set; }
        public string TutorHeadline { get; set; }
    }
}
