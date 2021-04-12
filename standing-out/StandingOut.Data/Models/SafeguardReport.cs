using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SafeguardReport : EntityBase
    {
        [Key]
        public Guid SafeguardReportId { get; set; }
        [ForeignKey("ClassSession")]
        public Guid? ClassSessionId { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }

        public SafeguardReportStatus Status { get; set; }
        public DateTime LogDate { get; set; }
        [Required]
        [StringLength(250)]
        public string Title { get; set; }
        [Required]
        [StringLength(2000)]
        public string Description { get; set; }
        [StringLength(2000)]
        public string Notes { get; set; }

        public virtual ClassSession ClassSession { get; set; }
        public virtual User User { get; set; }
    }
}
