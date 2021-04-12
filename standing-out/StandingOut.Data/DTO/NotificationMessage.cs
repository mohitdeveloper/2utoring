using System;
using System.Collections.Generic;
using System.Text;

namespace StandingOut.Data.DTO
{
    public class NotificationMessage
    {
        public NotificationMessage()
        {

        }
        public Guid NotificationMessageId { get; set; }
        public string Heading { get; set; }
        public string Body { get; set; }
        public int SetNo { get; set; }
        public int SequenceNo { get; set; }
        public bool CanDelete { get; set; }
        public string AlertType { get; set; }
        public string Condition { get; set; }
        public string NotificationIcon { get; set; }
       

    }

    public class NotificationModel
    {
        public List<NotificationMessage> MessageList { get; set; }
        public UserAlertViewModel UserAlertModel { get; set; }

    }
}
