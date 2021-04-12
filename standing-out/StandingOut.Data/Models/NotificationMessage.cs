using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace StandingOut.Data.Models
{
    public class NotificationMessage : EntityBase
    {
        public NotificationMessage()
        {

        }
        [Key]
        public Guid NotificationMessageId { get; set; }
        public string Heading { get; set; }
        public string Body { get; set; }
        public int SetNo { get; set; }
        public int SequenceNo { get; set; }
        public bool CanDelete { get; set; }
        public string AlertType { get; set; }
        public string Condition { get; set; }
        public string NotificationIcon { get; set; }
        


        // NAVIGATION Fields
        public virtual PageNotificationMessage PageNotificationMessage { get; set; }
        public virtual RoleTypeNotificationMessage RoleTypeNotificationMessage { get; set; }
        public virtual SubscriptionNotificationMessage SubscriptionNotificationMessage { get; set; }
        public virtual List<UserNotificationMessage> UserNotificationMessages { get; set; }
    }
}
