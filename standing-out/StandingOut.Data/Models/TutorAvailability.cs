using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    /// <summary>
    /// Contains availability records for a Tutor
    ///
    /// WEEK Pattern (SpecificDate MUST be null):
    /// e.g [Mon        09:00 - 12:00   Available]
    ///     [Mon        13:00 to 17:00  Available]
    ///     [Sat        00:00 to 23.59  NotAvailable     "Weekend"]
    ///     [Sun        00:00 to 23.59  NotAvailable]    "Weekend"]
    ///     and so on builds a pattern for the week 
    ///
    /// OVERRIDE (optional): (Specific date MUST be given)
    ///     [Fri    25 Dec 2020     00:00 - 23:59 NotAvailable      "Its Xmas day, time off"]
    ///     [Sat    26 Dec 2020     00:00 - 23:59 Available         "I like working boxing day"] 
    /// </summary>
    public class TutorAvailability : EntityBase
    {
        [Key]
        public Guid TutorAvailabilityId { get; set; }
        [ForeignKey("Tutor")]
        public Guid TutorId { get; set; }   
        
        // enum Sunday=0, Monday=1, Tuesday etc..
        public DayOfWeek DayOfWeek { get; set; }     
        
        // Specific date as override (only set when overriding day of week availability)
        public DateTimeOffset? SpecificDate { get; set; }
        public string OriginDate { get; set; }

        // Could be a TimeSlot or Entire day (00:00 to 23.59)
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        // Available or Not.
        public AvailabilityType SlotType { get; set; }

        // If they want to give a reason for their absence etc
        public string SlotDescription  { get; set; }
        public int? NoOfWeek { get; set; }
        public string RepeatedSlot { get; set; }

        public virtual Tutor Tutor { get; set; }
    }
}
