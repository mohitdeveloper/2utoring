using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class Login
    {
        [Required]
        [StringLength(250)]
        public string Email { get; set; }
        [Required]
        [StringLength(250)]
        public string Password { get; set; }

        public string ReturnUrl { get; set; }
    }
}
