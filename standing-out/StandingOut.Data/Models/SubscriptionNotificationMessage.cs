using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace StandingOut.Data.Models
{
    public class SubscriptionNotificationMessage : EntityBase
    {
        public SubscriptionNotificationMessage() { }

        [Key]
        public Guid SubscriptionNotificationMessageId { get; set; }

        [ForeignKey("Subscription")]
        public Guid SubscriptionId { get; set; }

        [ForeignKey("NotificationMessage")]
        public Guid NotificationMessageId { get; set; }

    }
}
