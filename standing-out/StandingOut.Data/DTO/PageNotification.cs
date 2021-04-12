using System;
using System.Collections.Generic;
using System.Text;

namespace StandingOut.Data.DTO
{
    public class PageNotification
    {
        public Guid PageNotificationMessageId { get; set; }
        public Guid NotificationMessageId { get; set; }
        public string PageName { get; set; }
       
    }
}
