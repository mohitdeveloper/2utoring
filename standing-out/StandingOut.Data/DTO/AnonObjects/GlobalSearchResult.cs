using StandingOut.Data.Enums;
using System;

namespace StandingOut.Data.DTO
{
    public class GlobalSearchResult
    {
        public GlobalSearchResult()
        {
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Header { get; set; }
        public string SubHeader { get; set; }
        public string Biography 
        {
            get
            {
                return BiographyHTML;
            }
            set
            {
                BiographyHTML = string.IsNullOrWhiteSpace(value) ? string.Empty : value.Replace("\r\n", "<br>").Replace("\r", "<br>").Replace("\n", "<br>");
            } 
        }
        public string ImageName { get; set; }

        private string BiographyHTML { get; set; }

        public GlobalSearchType GlobalSearchType { get; set; }
        public string GlobalSearchTypeDisplay
        {
            get
            {
                return GlobalSearchType.ToString();
            }
        }

        public string ImageDownloadUrl
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(ImageName))
                {
                    if (GlobalSearchType == GlobalSearchType.Tutor)
                        return $"/Tutors/DownloadImage/{Id}?imageName=" + ImageName;
                    else if (GlobalSearchType == GlobalSearchType.Company)
                        return $"/Organisations/DownloadImage/{Id}?imageName=" + ImageName;
                }
                return null;
            }
        }
    }
}
