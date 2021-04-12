using System;
using System.Collections.Generic;
using System.Text;

namespace StandingOut.Data.DTO
{
   public class RoleTypeNotification
    {
        public Guid RoleTypeNotificationMessageId { get; set; }
        public Guid NotificationMessageId { get; set; }
        public string RoleType { get; set; }
    }
}
