using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class CompanyTutor
    {
        public Guid CompanyTutorId { get; set; }
        public Guid CompanyId { get; set; }
        public Guid TutorId { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public DateTime? PreferredStartDate { get; set; }
        public DateTime? PreferredEndDate { get; set; }

        public Company Company { get; set; }
        public Tutor Tutor { get; set; }
    }
    //Get Tutor By Company,Subject,Level,Google Enable
    public class CTutor
    {

        [Required]
        public Guid SubjectId { get; set; }

        [Required]
        public Guid StudyLevelId { get; set; }

        [Required]
        public bool IsGoogleEnabled { get; set; }

    }
    //Get Company Tutor by TutorAvailability
    public class CTutorAvailability
    {
        [Required]
        public int DayOfWeek { get; set; }

        [Required]
        public string SlotTime { get; set; }

        [Required]
        public int NoOfWeek { get; set; }
        [Required]
        public Guid SubjectId { get; set; }

        [Required]
        public Guid StudyLevelId { get; set; }


    }

    public class TutorDDL
    {
        public Guid TutorId { get; set; }
        public string Name { get; set; }

    }

}
