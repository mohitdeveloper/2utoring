using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class ClassSessionVideoRoom : EntityBase
    {
        [Key]
        public Guid ClassSessionVideoRoomId { get; set; }
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }

        [Required]
        [StringLength(500)]
        public string RoomSid { get; set; }
        [Required]
        [StringLength(500)]
        public string ParticipantSid { get; set; }
        public int? Duration { get; set; }

        public string CompositionSid { get; set; }
        public bool CompositionDownloadReady { get; set; }

        public virtual ClassSession ClassSession { get; set; }
        public virtual User User { get; set; }
    }
}
