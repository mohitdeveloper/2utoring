using System;

namespace StandingOut.Data.DTO
{
    // FOR USE WITH THE TUTOR CARD PARTIAL
    public class TutorCard
    {
        public Guid TutorId { get; set; }
        public string UrlSlug { get; set; }
        public string Salutation { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ProfileImageFileLocation { get; set; }
        public bool IsApproved { get; set; }

        public string Biography { get; set; }
        public string Header { get; set; }

        public string[] Subjects { get; set; }
        public string[] Qualifications { get; set; }
    }
}
