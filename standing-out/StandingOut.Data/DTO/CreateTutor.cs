using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class CreateTutor
    {
        [Required]
        [Display(Name = "User")]
        public string UserId { get; set; }

        [Required]
        [Display(Name = "Acuity Scehduling Calendar ID")]
        public int CalendarId { get; set; }

        [Required]
        [StringLength(250)]
        public string Header { get; set; }
        [Required]
        [StringLength(250)]
        [Display(Name = "Sub Header")]
        public string SubHeader { get; set; }
        [StringLength(2000)]
        public string Biography { get; set; }
        public string ImageName { get; set; }

        public IFormFile File { get; set; }
    }
}
