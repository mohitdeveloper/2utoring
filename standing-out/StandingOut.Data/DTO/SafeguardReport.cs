using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class SafeguardReport 
    {
        public Guid SafeguardReportId { get; set; }
        public Guid? ClassSessionId { get; set; }
        public string UserId { get; set; }

        public SafeguardReportStatus Status { get; set; }
        public DateTime LogDate { get; set; }
        [Required]
        [StringLength(250)]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        public string Notes { get; set; }

    }
}
