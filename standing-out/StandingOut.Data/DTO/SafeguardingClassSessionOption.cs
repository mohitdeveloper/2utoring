using System;

namespace StandingOut.Data.DTO
{
    public class SafeguardingClassSessionOption
    {
        public Guid ClassSessionId { get; set; }
        public string Name { get; set; }
        public DateTimeOffset StartDate { get; set; }
    }
}
