using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class SessionWhiteBoardSave : EntityBase
    {
        public SessionWhiteBoardSave() { }

        [Key]
        public Guid SessionWhiteBoardSaveId { get; set; }
        [Required]
        [ForeignKey("ClassSession")]
        public Guid ClassSessionId { get; set; }
        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int SizeX { get; set; }
        [Required]
        public int SizeY { get; set; }
        [Required]
        public string FileLocation { get; set; }

        public virtual ClassSession ClassSession { get; set; }
        public virtual User User { get; set; }
    }
}
