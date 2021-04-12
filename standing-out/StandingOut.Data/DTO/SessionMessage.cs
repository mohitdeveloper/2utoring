using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class SessionMessage 
    {
        public Guid SessionMessageId { get; set; }
        public Guid ClassSessionId { get; set; }
        public string FromUserId { get; set; }
        public Guid? ToGroupId { get; set; }
        public string ToUserId { get; set; }
        public Guid? SessionOneToOneChatInstanceId { get; set; }

        [Required]
        public DateTime LogDate { get; set; }
        [Required]
        public string Message { get; set; }


        public string FromUserDisplayName { get; set; }
        public string FromUserGoogleProfilePicture { get; set; }

    }
}
