using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace StandingOut.Data.Models
{
    public class UserNotificationMessage : EntityBase
    {
        public UserNotificationMessage() { }

        [Key]
        public Guid UserNotificationMessageId { get; set; }

        [ForeignKey("NotificationMessage")]
        public Guid NotificationMessageId { get; set; }
        public Guid UserId { get; set; }
        public bool Show { get; set; }
        public bool IsClosed { get; set; }

        public virtual NotificationMessage NotificationMessage { get; set; }

    }
}
