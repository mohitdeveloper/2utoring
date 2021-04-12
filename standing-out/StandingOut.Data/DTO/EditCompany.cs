using System;

namespace StandingOut.Data.DTO
{
    public class EditCompany : CreateCompany
    {
        public Guid CompanyId { get; set; }

        public string ImageDownloadUrl
        {
            get
            {
                return $"/Organisations/DownloadImage/{CompanyId}?imageName={ImageName}";
            }
        }
    }
}
