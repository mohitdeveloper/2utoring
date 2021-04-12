using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SessionWhiteBoardHistory : EntityBase
    {
        public SessionWhiteBoardHistory()
        {
            LogDate = DateTime.Now;
        }

        [Key]
        public Guid SessionWhiteBoardHistoryId { get; set; }
        [Required]
        [ForeignKey("SessionWhiteBoard")]
        public Guid SessionWhiteBoardId { get; set; }
        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        [Required]
        [StringLength(20)]
        public string HistoryType { get; set; }
        public string JsonData {get; set; }
        [Required]
        public DateTime LogDate { get; set; }

        public bool UnDone { get; set; }
        public DateTime? UnDoneDate { get; set; }

        public bool ReDone { get; set; }
        [ForeignKey("ReDoneHistory")]
        public Guid? ReDoneId { get; set; }

        public virtual SessionWhiteBoard SessionWhiteBoard { get; set; }
        public virtual User User { get; set; }
        public virtual SessionWhiteBoardHistory ReDoneHistory { get; set; }
    }
}
