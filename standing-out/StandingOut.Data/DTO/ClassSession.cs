using Microsoft.AspNetCore.Http;
using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class ClassSession
    {
        public ClassSession()
        {
        }

        public Guid? ClassSessionId { get; set; }
        public string OwnerId { get; set; }
        public Guid SubjectId { get; set; }
        public Guid? SubjectCategoryId { get; set; }
        public Guid StudyLevelId { get; set; }

        //This should only be one or theother!
        public int? AppointmentId { get; set; }

        public int? ClassId { get; set; }

        public Guid? CourseId { get; set; }

        public bool RequiresGoogleAccount { get; set; }
        [Required]
        [StringLength(500)]
        public string Name { get; set; }
        [StringLength(500)]
        public string CourseName { get; set; }
        public string TutorName { get; set; }

        [StringLength(500)]
        public string LessonDescriptionBody { get; set; }
        [Required]
        public DateTimeOffset StartDate { get; set; }
        [Required]
        public DateTimeOffset EndDate { get; set; }
        public int DetailsDuration { get; set; }
        public int MaxPersons { get; set; }
        public decimal PricePerPerson { get; set; }
        public bool IsUnder16 { get; set; }
        public bool HasEmailAttachment { get; set; }

        public ClassSessionType Type { get; set; }
        public ClassSessionScheduleType? ScheduleType { get; set; }
        public DateTime? ScheduleEndDate { get; set; }


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

        [StringLength(100)]
        public string StudentOverallDirectoryId { get; set; }
        [StringLength(100)]
        public string StudentMasterDirectoryId { get; set; }

        public string EmailContents { get; set; }
        public bool IsDeleted { get; set; }
        public bool Started { get; set; }
        public DateTimeOffset? StartedAtDate { get; set; }
        public DateTimeOffset? DueEndDate { get; set; }
        public bool Ended { get; set; }
        public DateTime? EndedAtDate { get; set; }
        public bool Complete { get; set; }
        public bool Refunded { get; set; }
        public bool Cancel { get; set; }
        public int ReadMessagesTutor { get; set; }
        public bool ChatActive { get; set; }

        public IFormFile File { get; set; }

        //NotMapped
        public int Duration { get; set; }
        public string InitialTimeDisplay { get; set; }
        public int SessionAttendeesCount { get; set; }
        public int SessionMediaCount { get; set; }
        public string CurrentStatus
        {
            get
            {
                if (EndDate < DateTime.Now)
                    return "Finished";
                else if (StartDate > DateTime.Now)
                    return "Not Started";
                else
                    return "Running";
            }
        }

        public string SubjectName { get; set; }
        public string StudyLevelName { get; set; }
        public decimal StudentFees { get; set; }
        public decimal StandingOutFees { get; set; }
        public decimal VendorEarningAmount { get; set; } // Only vendor can see the lesson hence

        public bool EarningsPaid { get; set; } // If each earning from this lesson is part of a payout.. 
        public string PaymentStatus { get; set; }

        public decimal TutorEarnings
        {
            get
            {
                return VendorEarningAmount;
            }
        }
 
        public bool DisableDateEdit
        {
            get
            {
                if (StartDate.AddMinutes(-30) < DateTimeOffset.UtcNow)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public UserProfile Owner { get; set; }
    }
}
