using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Models
{
    public class PromoCode : EntityBase
    {
        public PromoCode()
        {
            SessionAttendees ??= new List<SessionAttendee>();
        }

        [Key]
        public Guid PromoCodeId { get; set; }
        [Required]
        public PromoCodeType Type { get; set; }
        [Required]
        [StringLength(250)]
        public string Name { get; set; }
        public decimal? AmountOff { get; set; }
        public decimal? PercentOff { get; set; }
        public int? MaxUses { get; set; }
        public virtual List<SessionAttendee> SessionAttendees { get; set; }
    }
}
