using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    /// <summary>
    /// Represents the Basic unit of sale - a Course
    /// As a Course can have more than one lesson, even for a single user there would be multiple enrolments (one per lesson)
    /// Invites are to be sent per course.
    /// </summary>
    public class OrderItem : EntityBase
    {
        public OrderItem()
        {
            SessionAttendees ??= new List<SessionAttendee>(); // Will be mapped from userId in DTO
            CourseInvites ??= new List<CourseInvite>();
        }

        [Key]
        public Guid OrderItemId { get; set; }

        [Required]
        [ForeignKey("Order")]
        public Guid OrderId { get; set; }

        [Required]
        [ForeignKey("Course")]
        public Guid CourseId { get; set; }

        public virtual Order Order { get; set; }
        public virtual Course Course { get; set; }
        public virtual List<CourseInvite> CourseInvites { get; set; } // Note: Invite.CourseId to match this.CourseId
        public virtual List<SessionAttendee> SessionAttendees { get; set; }
    }
}