using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class ForgotPassword
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
