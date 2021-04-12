using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace StandingOut.Data.Models
{
    public class ClassSession : EntityBase
    {
        public ClassSession()
        {
            VendorEarnings ??= new List<VendorEarning>();
            SessionAttendees = SessionAttendees ?? new List<SessionAttendee>();
            SessionGroups = SessionGroups ?? new List<SessionGroup>();
            SessionMessages = SessionMessages ?? new List<SessionMessage>();
            SafeguardReports = SafeguardReports ?? new List<SafeguardReport>();
            SessionMedia = SessionMedia ?? new List<SessionMedia>();
            SessionWhiteBoards = SessionWhiteBoards ?? new List<SessionWhiteBoard>();
            SessionWhiteBoardSaves = SessionWhiteBoardSaves ?? new List<SessionWhiteBoardSave>();
            SessionWhiteBoardShares = SessionWhiteBoardShares ?? new List<SessionWhiteBoardShare>();
            ChatActive = true;
            ReadMessagesTutor = 0;
        }

        [Key]
        public Guid ClassSessionId { get; set; }

        [ForeignKey("Owner")] // Tutor's UserId
        public string OwnerId { get; set; }
        [ForeignKey("Hub")]
        public Guid? HubId { get; set; }

        [ForeignKey("Course")]
        public Guid? CourseId { get; set; }

        //These are not used,, Null in current system
        public int? AppointmentId { get; set; }
        public int? ClassId { get; set; }

        public bool RequiresGoogleAccount { get; set; }
        [Required]
        [StringLength(500)]
        public string Name { get; set; }

        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }

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

        public string EmailContents { get; set; }
        public bool HasEmailAttachment { get; set; }

        public bool Started { get; set; }
        public DateTimeOffset? StartedAtDate { get; set; }
        public DateTimeOffset? DueEndDate { get; set; }
        public bool Ended { get; set; }
        public DateTimeOffset? EndedAtDate { get; set; }
        public bool Complete { get; set; }
        public bool Refunded { get; set; }
        public bool Cancel { get; set; }
        
        
        public int ReadMessagesTutor { get; set; }
        public bool ChatActive { get; set; }

        [NotMapped]
        public int Duration
        {
            get
            {
                TimeSpan span = EndDate.Subtract(StartDate);
                return Convert.ToInt32(span.TotalMinutes);
            }
        }

        [NotMapped]
        public string InitialTimeDisplay
        {
            get
            {
                TimeSpan span = EndDate.Subtract(StartDate);
                return $"{Convert.ToInt32(span.Hours).ToString("D2")}:{Convert.ToInt32(span.Minutes).ToString("D2")}:{Convert.ToInt32(span.Seconds).ToString("D2")}";
            }
        }

        #region Store display additions

        [Required]
        [ForeignKey("Subject")]
        public Guid SubjectId { get; set; }
        [ForeignKey("SubjectCategory")]
        public Guid? SubjectCategoryId { get; set; }
        [Required]
        [ForeignKey("StudyLevel")]
        public Guid StudyLevelId { get; set; }
        [StringLength(500)]
        public string LessonDescriptionBody { get; set; }
        [Required]
        public int MaxPersons { get; set; }
        [Required]
        [Column(TypeName = "decimal(13,4)")]
        public decimal PricePerPerson { get; set; }
        [Required]
        public bool IsUnder16 { get; set; }
        public ClassSessionType Type { get; set; }

        // Keep these 2 null (ScheduleType & ScheduleEndDate) for ClassSessions of Courses
        public ClassSessionScheduleType? ScheduleType { get; set; }
        public DateTime? ScheduleEndDate { get; set; }


        #endregion Store display additions






        public virtual User Owner { get; set; }
        public virtual Hub Hub { get; set; }
        public Course Course { get; set; }
        public virtual List<SessionAttendee> SessionAttendees { get; set; }
        public virtual List<SessionGroup> SessionGroups { get; set; }
        public virtual List<SessionMessage> SessionMessages { get; set; }
        public virtual List<SessionMedia> SessionMedia { get; set; }
        public virtual List<SafeguardReport> SafeguardReports { get; set; }
        public virtual List<ClassSessionVideoRoom> VideoRooms { get; set; }
        public virtual List<SessionWhiteBoard> SessionWhiteBoards { get; set; }
        public virtual List<SessionWhiteBoardSave> SessionWhiteBoardSaves { get; set; }
        public virtual List<SessionWhiteBoardShare> SessionWhiteBoardShares { get; set; }

        // TO get to orders from ClassSession - use SessionAttendees -> Order

        #region Store display only

        public virtual Subject Subject { get; set; }
        public virtual SubjectCategory SubjectCategory { get; set; }
        public virtual StudyLevel StudyLevel { get; set; }
        public virtual List<VendorEarning> VendorEarnings { get; set; } // A lesson has earnings split by it's original orders to trace back earnings to orders (Stripe TransferGroup)

        [NotMapped]
        public Guid OwnerVendorId
        { // A Company/Tutor is vendor of Course if they created it. For a CompanyTutor Company is Vendor
            get
            {
                return (Course.CompanyId.HasValue ? Course.CompanyId.Value : Course.TutorId.Value);
            }
        }

        /// <summary>
        /// Based on both aspects
        /// 1) Vendor connected account has been notionally credited with this lesson-order's earnings
        /// 2) Payout (actual money transferred)        
        /// </summary>
        [NotMapped]
        public string PaymentStatus
        {
            get
            {
                if (VendorEarnings.Any() && SessionAttendees.Any())
                {
                    if (VendorEarnings.Sum(x => x.EarningAmount) == SessionAttendees.Sum(s => s.VendorAmount)) return "Credited";
                    if (VendorEarnings.Sum(x => x.EarningAmount) <= SessionAttendees.Sum(s => s.VendorAmount)) return "Partly Credited";
                    if (VendorEarnings.TrueForAll(ve => !ve.VendorPayoutId.HasValue)) return "Not Paid Out";
                    if (VendorEarnings.Any(ve => ve.VendorPayoutId.HasValue)) return "Part Paid Out";
                    if (VendorEarnings.TrueForAll(ve => ve.VendorPayoutId.HasValue)) return "Paid Out";
                    return "Unknown";
                }
                else if (!SessionAttendees.Any()) return "N/A";
                else if (Cancel) return "Cancelled";
                return "Uncredited";
            }
        }

        ///// <summary>
        ///// Based on whether Vendor connected account has been notionally credited with this lesson-order's earnings
        ///// </summary>
        //[NotMapped]
        //public string VendorEarningStatus
        //{
        //    get
        //    {
        //        if(VendorEarnings.Sum(x => x.EarningAmount) == SessionAttendees.Sum(s => s.VendorAmount)) return "Paid";
        //        if(VendorEarnings.Sum(x => x.EarningAmount) <= SessionAttendees.Sum(s => s.VendorAmount)) return "Partly Paid";
        //        return "Unknown";
        //    }
        //}

        #endregion Store display only
    }
}
