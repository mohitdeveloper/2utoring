using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class EditTutor
    {
        [Required]
        [Display(Name = "User")]
        public string UserId { get; set; }
        public Guid TutorId { get; set; }

        [Required]
        [Display(Name = "Acuity ID")]
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

        public IFormFile File { get; set; }
        public string ImageName { get; set; }
        public string ImageDirectory { get; set; }
        public string Email { get; set; }

        public List<DTO.ClassSession> TutorSessions { get; set; }

        public string ImageDownloadUrl
        {
            get
            {
                if (ImageName != null)
                    return $"/Tutors/DownloadImage/{TutorId}?imageName={ImageName}";
                else
                    return null;
            }
        }
    }
}
