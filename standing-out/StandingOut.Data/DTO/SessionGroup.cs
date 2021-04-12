using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class SessionGroup 
    {
        public SessionGroup()
        {
        }

        public Guid SessionGroupId { get; set; }
        public Guid ClassSessionId { get; set; }

        [Required]
        [StringLength(250)]
        public string Name { get; set; }

        public int ReadMessagesTutor { get; set; }
        public bool ChatActive { get; set; }

        public bool GroupRoomJoinEnabled { get; set; }
        public bool GroupVideoEnabled { get; set; }
        public bool GroupAudioEnabled { get; set; }
    }


}
