using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace StandingOut.Data.Models
{
    public class RoleTypeNotificationMessage : EntityBase
    {
        public RoleTypeNotificationMessage()
        {

        }

        [Key]
        public Guid RoleTypeNotificationMessageId { get; set; }

        [ForeignKey("NotificationMessage")]
        public Guid NotificationMessageId { get; set; }
        public string RoleType { get; set; }
    }
}
