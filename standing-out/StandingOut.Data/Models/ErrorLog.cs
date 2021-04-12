using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Models
{
    public class ErrorLog : EntityBase
    {
        public ErrorLog()
        {
            LogDate = DateTime.Now;
        }

        [Key]
        public Guid ErrorLogId { get; set; }

        [StringLength(2000)]
        public string Path { get; set; }
        [StringLength(2000)]
        public string Message { get; set; }
        [StringLength(2000)]
        public string InnerException { get; set; }
        public string StackTrace { get; set; }
        public string InnerStackTrace { get; set; }

        public DateTime LogDate { get; set; }
    }
}
