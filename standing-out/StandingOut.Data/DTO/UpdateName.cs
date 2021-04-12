using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class UpdateName
    {
        [Required]
        [StringLength(250)]
        public string Name { get; set; }
    }
}
