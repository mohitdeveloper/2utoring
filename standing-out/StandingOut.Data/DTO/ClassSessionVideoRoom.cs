using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class ClassSessionVideoRoom
    {
        public Guid ClassSessionVideoRoomId { get; set; }
        public Guid ClassSessionId { get; set; }
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

        public DateTimeOffset CreatedDate { get; set; }

        public UserProfile User { get; set; }
    }

    public class ClassSessionVideoRoomGroup
    {
        public ClassSessionVideoRoomGroup()
        {
            Items ??= new List<ClassSessionVideoRoom>();
        }

        public string id { get; set; }
        public List<ClassSessionVideoRoom> Items { get; set; }
    }

}
