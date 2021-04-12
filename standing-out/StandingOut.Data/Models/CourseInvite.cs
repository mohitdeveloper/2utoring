using StandingOut.Data.Entity;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    [Table("CourseInvites")]
    public class CourseInvite : EntityBase
    {
        public CourseInvite()
        {
            InviteSent = false;
        }

        [Key]
        public Guid CourseInviteId { get; set; }
        
        [ForeignKey("Course")]
        public Guid CourseId { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; } // Invitee (receiver) userid

        [ForeignKey("OrderItem")]
        public Guid? OrderItemId { get; set; }

        [Required]
        [StringLength(250)]
        public string Email { get; set; } // Invitee (email receiver)

        [DefaultValue(false)]
        public bool InviteSent { get; set; }

        public virtual Course Course { get; set; }
        public virtual User User { get; set; }
        public virtual OrderItem OrderItem { get; set; }
    }
}
