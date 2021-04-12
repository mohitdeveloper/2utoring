using StandingOut.Data.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class BasketItemDto
    {
        public BasketItemDto()
        {
            ClassSessions ??= new List<ClassSession>();
        }

        [Required]
        public Guid CourseId { get; set; }
        public List<ClassSession> ClassSessions { get; set; } // Frontend may pass what lessons the user expected to enrol for. If any enrolments fail, they get reported back

        //[Required]
        //public List<UserInfo> CourseAttendees { get; set; } // Only current user for now..
        public List<CourseInvite> CourseInvites { get; set; } // All others will be email invites
    }
}
