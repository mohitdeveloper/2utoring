using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class SubjectCategory
    {
        public SubjectCategory()
        {

        }

        [Key]
        public Guid SubjectCategoryId { get; set; }
        [Required]
        public Guid SubjectId { get; set; }

        [Required]
        [StringLength(250)]
        public string Name { get; set; }

        public string SubjectName { get; set; }
    }
}
