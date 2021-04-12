using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class CreateUser
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
        [Required]
        [StringLength(250)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }
        [Required]
        [StringLength(250)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }
    }
}
