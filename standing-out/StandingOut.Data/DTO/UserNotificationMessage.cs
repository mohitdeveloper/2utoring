using System;
using System.Collections.Generic;
using System.Text;

namespace StandingOut.Data.DTO
{
    public class UserNotificationMessage
    {
        public UserNotificationMessage()
        {

        }
        public Guid UserNotificationMessageId { get; set; }
        public Guid NotificationMessageId { get; set; }
        public Guid UserId { get; set; }
        public bool Show { get; set; }
        public bool IsClosed { get; set; }
    }
}
