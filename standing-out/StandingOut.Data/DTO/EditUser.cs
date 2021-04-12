using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class EditUser
    {
        [Required]
        public string Id { get; set; }

        [Required]
        [StringLength(250)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }
        [Required]
        [StringLength(250)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }
        [Required]
        [StringLength(250)]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}
