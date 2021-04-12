using System;

namespace StandingOut.Data.DTO
{
    public class GuidOptionExpanded : SearchOption
    {
        public string ParentUrl { get; set; }
        public Guid ParentValue { get; set; }
    }
}
