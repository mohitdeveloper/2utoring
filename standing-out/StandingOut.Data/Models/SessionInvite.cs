using StandingOut.Data.Entity;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace StandingOut.Data.Models
{
    [Table("SessionInvites")]
    public class SessionInvite : EntityBase
    {
        public SessionInvite()
        {
            InviteSent = false;
        }

        [Key]
        public Guid SessionInviteId { get; set; }
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }

        [Required]
        [StringLength(250)]
        public string Email { get; set; }

        [DefaultValue(false)]
        public bool InviteSent { get; set; }

        public virtual ClassSession ClassSession { get; set; }
        public virtual User User { get; set; }
    }
}
