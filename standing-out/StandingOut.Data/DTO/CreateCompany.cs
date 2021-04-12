using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class CreateCompany
    {
        [StringLength(250)]
        public string Name { get; set; }
        [StringLength(250)]
        public string Header { get; set; }
        [StringLength(250)]
        public string SubHeader { get; set; }
        [StringLength(2000)]
        public string Biography { get; set; }
        public string ImageName { get; set; }

        public IFormFile File { get; set; }
    }
}
