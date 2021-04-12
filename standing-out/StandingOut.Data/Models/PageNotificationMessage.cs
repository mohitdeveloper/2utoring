using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace StandingOut.Data.Models
{
    public class PageNotificationMessage : EntityBase
    {
        public PageNotificationMessage()
        {

        }

        [Key]
        public Guid PageNotificationMessageId { get; set; }
        [ForeignKey("NotificationMessage")]
        public Guid NotificationMessageId { get; set; }
        public string PageName { get; set; }
    }
}
