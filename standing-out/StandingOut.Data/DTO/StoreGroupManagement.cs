using System;
using System.Collections.Generic;
using System.Text;

namespace StandingOut.Data.DTO
{
    public class StoreGroupManagement
    {
        public Guid? GroupId { get; set; }
        public List<string> UserIds { get; set; }
    }
}
