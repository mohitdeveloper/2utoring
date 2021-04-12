using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class ClassSessionComplete
    {
        public ClassSessionComplete() { }

        [Required]
        public string EmailContents { get; set; }

        public IFormFile File { get; set; }
    }
}
