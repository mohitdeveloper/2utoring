using System;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class TutorProfile
    {
        public TutorProfile()
        {
            Companies = Companies ?? new List<TutorProfileCompany>();
        }

        public Guid TutorId { get; set; }
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

        public int CalendarId { get; set; }
        public string ImageName { get; set; }

        public string ImageDownloadUrl
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(ImageName))
                    return $"/Tutors/DownloadImage/{TutorId}?imageName={ImageName}";
                else
                    return null;
            }
        }

        public List<TutorProfileCompany> Companies { get; set; }
    }
}
