using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SessionMessage : EntityBase
    {
        [Key]
        public Guid SessionMessageId { get; set; }
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }
        [ForeignKey("FromUser")]
        public string FromUserId { get; set; }
        [ForeignKey("ToGroup")]
        public Guid? ToGroupId { get; set; }
        [ForeignKey("ToUser")]
        public string ToUserId { get; set; }
        [ForeignKey("SessionOneToOneChatInstance")]
        public Guid? SessionOneToOneChatInstanceId { get; set; }
        
        [Required]
        public DateTime LogDate { get; set; }
        [Required]
        public string Message { get; set; }

        public virtual ClassSession ClassSession { get; set; }
        public virtual User FromUser { get; set; }
        public virtual SessionGroup ToGroup { get; set; }
        public virtual User ToUser { get; set; }
        public virtual SessionOneToOneChatInstance SessionOneToOneChatInstance { get; set; }
    }
}
