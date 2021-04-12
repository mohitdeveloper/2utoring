using System;

namespace StandingOut.Data.DTO
{
    public class CompanyProfileTutor
    {
        public CompanyProfileTutor()
        {
        }

        public string Name { get; set; }
        public Guid TutorId { get; set; }
        public string Header { get; set; }
        public string SubHeader { get; set; }
        public string Biography { get; set; }

        public string ImageDownloadUrl
        {
            get
            {
                return $"/Tutors/DownloadImage/{TutorId}";
            }
        }
    }
}
