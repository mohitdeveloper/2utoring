using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace StandingOut.Data.DTO
{
   public class WebsiteContact
    {
        
        public Guid WebsiteContactId { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [Required]
        [StringLength(250)]
        public string ContactEmail { get; set; }

        [Required]
        public Guid SubjectId { get; set; }

        [Required]
        public Guid StudyLevelId { get; set; }

        [StringLength(100)]
        public string SearchFor { get; set; }

        [StringLength(100)]
        public string Time { get; set; }

        [StringLength(100)]
        public string Days { get; set; }

        [StringLength(2000)]
        public string Description { get; set; }

        // NAVIGATION Fields
        public virtual Subject Subject { get; set; }
        public virtual StudyLevel StudyLevel { get; set; }
    }
}
