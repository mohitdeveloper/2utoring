using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    /// <summary>
    /// Course with multiple ClassSessions
    /// Ref screen 5, 29, 30 
    /// </summary>
    public class Course : EntityBase
    {
        public Course()
        {
            ClassSessions ??= new List<ClassSession>();
            CourseInvites ??= new List<CourseInvite>();
            OrderItems ??= new List<OrderItem>();
        }

        [Key]
        public Guid CourseId { get; set; }

        [ForeignKey("Creator")]
        public string CreatorUserId { get; set; } // UserId who created this

        [ForeignKey("Tutor")]
        public Guid? TutorId { get; set; }

        [ForeignKey("Company")]
        public Guid? CompanyId { get; set; }

        [Required]
        [StringLength(500)]
        public string Name { get; set; } // Course Name

        [Required]
        [ForeignKey("Subject")]
        public Guid SubjectId { get; set; } // Subject 

        [ForeignKey("SubjectCategory")]
        public Guid? SubjectCategoryId { get; set; }

        [Required]
        [ForeignKey("StudyLevel")]
        public Guid StudyLevelId { get; set; }  // Study Level

        [Required]
        public int MaxClassSize { get; set; } // Number of students (Class Size)

        [StringLength(2000)]
        public string Description { get; set; } // Description

        [Required]
        [Column(TypeName = "decimal(13,2)")]
        public decimal PricePerPerson { get; set; } // Price

        [Required]
        public bool IsUnder18 { get; set; } // Age restriction (as per mockup)

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
        public bool Published { get; set; } = false; // Set to true to make it available for purchase
        //This Column for Parent and Student
        public string IPAddress { get; set; }
        public string UniqueNumber { get; set; }
         

        // NAVIGATION Fields
        public virtual User Creator { get; set; }
        public virtual Tutor Tutor { get; set; }
        public virtual Company Company { get; set; }
        public virtual Subject Subject { get; set; }
        public virtual SubjectCategory SubjectCategory { get; set; }
        public virtual StudyLevel StudyLevel { get; set; }

        public virtual List<ClassSession> ClassSessions { get; set; }
        public virtual List<CourseInvite> CourseInvites { get; set; }
        public virtual List<OrderItem> OrderItems { get; set; }
        
    }
}
