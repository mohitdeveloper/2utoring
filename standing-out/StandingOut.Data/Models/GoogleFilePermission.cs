using StandingOut.Data.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace StandingOut.Data.Models
{
    public class GoogleFilePermission : EntityBase
    {



        public GoogleFilePermission()
        {

        }

        [Key]
        public Guid GoogleFilePermissionId { get; set; }
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }
        [ForeignKey("SessionAttendee")]
        public Guid SessionAttendeeId { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        public string FileId { get; set; }
        public bool IsReadable { get; set; }
        public bool IsWriteable { get; set; }
        public string FolderName { get; set; }

        // NAVIGATION Fields
        //public virtual User User { get; set; }
        //public virtual ClassSession ClassSession { get; set; }
        //public virtual SessionAttendee SessionAttendee { get; set; }

    }
}
