using System;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class CompanyProfile
    {
        public CompanyProfile()
        {
            Tutors = Tutors ?? new List<CompanyProfileTutor>();
        }

        public Guid CompanyId { get; set; }
        
        public string Name { get; set; }
        public string Header { get; set; }
        public string SubHeader { get; set; }
        public string Biography { get; set; }

        public string BiographyHtml
        {
            get
            {
                return string.IsNullOrWhiteSpace(Biography) ? string.Empty : Biography.Replace("\r\n", "<br>").Replace("\r", "<br>").Replace("\n", "<br>");
            }
        }

        public string ImageName { get; set; }

        public string ImageDownloadUrl
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(ImageName))
                    return $"/Organisations/DownloadImage/{CompanyId}?imageName={ImageName}";
                else
                    return null;
            }
        }

        public List<CompanyProfileTutor> Tutors { get; set; }
    }
}
