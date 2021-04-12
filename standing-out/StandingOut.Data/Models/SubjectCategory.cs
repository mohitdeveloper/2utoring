using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SubjectCategory : EntityBase
    {
        public SubjectCategory()
        {

        }

        [Key]
        public Guid SubjectCategoryId { get; set; }
        [Required]
        [ForeignKey("Subject")]
        [Display(Name = "Subject")]
        public Guid SubjectId { get; set; }

        [Required]
        [StringLength(250)]
        [RegularExpression("^[^;,\\/?:@&=$+-]*$")]
        public string Name { get; set; }
        [StringLength(300)]
        public string Url { get; set; }

        public virtual Subject Subject { get; set; }
    }
}
