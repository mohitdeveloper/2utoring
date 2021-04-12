using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class Course
    {
        public Guid CourseId { get; set; }
        public string CreatorUserId { get; set; } // UserId who created this
        public bool IsClassSessionExist { get; set; }
        public Guid? TutorId { get; set; }
        public string TutorName { get; set; }
        public string TutorImage { get; set; }
        public string StripeConnectAccountId { get; set; }
        public string CompanyStripeConnectAccountId { get; set; }
        public Guid? CompanyId { get; set; }

        [Required]
        [StringLength(500)]
        public string Name { get; set; } // Course Name

        [StringLength(2000)]
        public string Description { get; set; } // Course Description

        [Required]
        public Guid SubjectId { get; set; } // Subject 
        public string SubjectName { get; set; }
        public Guid? SubjectCategoryId { get; set; }
        public string SubjectCategoryName { get; set; }

        [Required]
        public Guid StudyLevelId { get; set; }  // Study Level
        public string StudyLevelName { get; set; }

        [Required]
        public int MaxClassSize { get; set; } // Number of students (Class Size)

        [Required]
        public decimal PricePerPerson { get; set; } // Price

        [Required]
        public bool IsUnder18 { get; set; } // Age restriction (as per mockup)

        public TutorApprovalStatus DbsApprovalStatus { get; set; }
        public TutorApprovalStatus ProfileApprovalStatus { get; set; }
        public TutorApprovalStatus CompanyIDVerificationtStatus { get; set; }
        public TutorApprovalStatus TutorIDVerificationtStatus { get; set; }

        [Required]
        public CourseType CourseType { get; set; } // Course Type (Public , Private)

        // Set to start of 1st lesson when lessons added by avail search
        public DateTimeOffset? StartDate { get; set; }
        public DateTimeOffset? EndDate { get; set; }

        // If needed at course level (mockup sets it at lesson level)
        public bool? RequiresGoogleAccount { get; set; }

        // Status
        public bool Started { get; set; }
        public bool Completed { get; set; }
        public bool Cancelled { get; set; }

        // Once lessons are scheduled n all, set this to true
        public bool Published { get; set; } = false; // Set to true to make it available

        //This IPAddress and UniqueNumber Column for Parent and Student
        public string IPAddress { get; set; }
        public string UniqueNumber { get; set; }
        public bool IsLoggedIn { get; set; } = false;
        public int ClassSessionsCount { get; set; }
        public decimal ClassSessionsTotalAmount { get; set; }
        //public virtual Tutor Tutor { get; set; }
        // public virtual Company Company { get; set; }
        //public virtual Subject Subject { get; set; }
        //public virtual SubjectCategory SubjectCategory { get; set; }
        //public virtual StudyLevel StudyLevel { get; set; }
        public virtual List<ClassSession> ClassSessions { get; set; }
        public virtual List<TutorAvailability> TutorAvailabilities { get; set; }
        public List<string> TutorQualification { get; set; }
        public Company CurrentCompany { get; set; }
        public int CourseAttendeesCount { get; set; }
        public int TotalBookedSlot { get; set; }
        public int TotalSlotCount { get; set; }

    }

    public class GDrive
    {
        public Guid classSessionId { get; set; }
        public bool status { get; set; }
        public bool ApiResponse { get; set; }

        [StringLength(500)]
        public string SessionDirectoryName { get; set; }

        [StringLength(100)]
        public string SessionDirectoryId { get; set; }

        [StringLength(100)]
        public string BaseStudentDirectoryId { get; set; }

        [StringLength(100)]
        public string BaseTutorDirectoryId { get; set; }

        [StringLength(100)]
        public string SharedStudentDirectoryId { get; set; }

        [StringLength(500)]
        public string MasterStudentDirectoryName { get; set; }

        [StringLength(100)]
        public string MasterStudentDirectoryId { get; set; }

        public bool MasterFilesCopied { get; set; }
    }
    public class CourseProfile
    {
        public Course Course { get; set; }
        public Tutor Tutor { get; set; }
        public List<CourseDetail> RelatedCourseList { get; set; }
    }
    public class CourseDetail
    {
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public string SubjectName { get; set; }
        public string StudyLevelName { get; set; }
        public decimal CourseTotalAmount { get; set; }
        public int PlacesRemaining { get; set; }
        public int ClassSessionsCount { get; set; }
        public int TotalBookedSlot { get; set; }
        public int TotalSlotCount { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public Guid TutorId { get; set; }
        public string TutorName { get; set; }
        public string TutorImage { get; set; }
        public TutorApprovalStatus TutorDBSStatus { get; set; }
        public List<string> TutorQualification { get; set; }


    }
}
