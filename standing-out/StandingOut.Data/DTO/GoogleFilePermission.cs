using StandingOut.Data.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace StandingOut.Data.DTO
{
   public class GoogleFilePermission
    {

        public GoogleFilePermission()
        {

        }
    
        public Guid GoogleFilePermissionId { get; set; }
        public Guid ClassSessionId { get; set; }
        public Guid SessionAttendeeId { get; set; }
        public string UserId { get; set; }
        public string FileId { get; set; }
        public bool IsReadable { get; set; }
        public bool IsWriteable { get; set; }

       
    }

}
