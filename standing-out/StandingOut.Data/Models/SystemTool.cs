using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Models
{
    public class SystemTool : EntityBase
    {
        [Key]
        public Guid SystemToolId { get; set; }
        [Required]
        [StringLength(250)]
        public string Name { get; set; }
        [Required]
        [StringLength(250)]
        public string FontAwesomeIconClass { get; set; }
        [Required]
        [StringLength(1000)]
        public string NgInclude { get; set; }

        public bool ExitWarning { get; set; }

        public bool AllowMultiple { get; set; }
    }
}
