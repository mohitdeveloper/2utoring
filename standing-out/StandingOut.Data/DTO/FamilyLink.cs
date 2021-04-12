using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class FamilyLink
    {
        public Guid FamilyLinkId { get; set; }
        [Required]
        public string ChildEmail { get; set; }
        public DateTime? LastRequestAt { get; set; }
        public bool Linked { get; set; }
        public string FullName { get; set; }
        public bool RecentRequest
        {
            get
            {
                return !LastRequestAt.HasValue || DateTime.Now > LastRequestAt.Value.AddDays(1) ? false : true;
            }
        }
    }
}

