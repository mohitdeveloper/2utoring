using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace StandingOut.Data.DTO
{
    public class TutorAvailability
    {
        public TutorAvailability()
        {

        }
        public Guid TutorAvailabilityId { get; set; }

        [Required]
        public Guid TutorId { get; set; }

        [Required]
        public DayOfWeek DayOfWeek { get; set; }
        public DateTimeOffset? SpecificDate { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        public AvailabilityType SlotType { get; set; }

        [StringLength(250)]
        public string SlotDescription { get; set; }
        public int NoOfWeek { get; set; }
        public string RepeatedSlot { get; set; }
        public string OriginDate { get; set; }
        public DateTime? CreatedDate { get; set; }
       
        
    }
    public class SearchAvailableTutors
    {
        
        public Guid CompanyId { get; set; }

        [Required]
        public string SelectedDays { get; set; }

        [Required]
        public DateTime CourseTime { get; set; }
        public int Weeks { get; set; }
    }
    public class CheckAvailableSlot
    {
        [Required]
        public string OwnerId { get; set; }
        [Required]
        public DateTimeOffset StartDate { get; set; }
        //[Required]
        //public DateTimeOffset EndDate { get; set; }
    }
}
