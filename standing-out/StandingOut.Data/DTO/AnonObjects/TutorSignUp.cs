using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class TutorSignUp
    {
        public TutorSignUp()
        {
        }
        
        [Required]
        [MaxLength(255)]
        public string Email { get; set; }
        [Required]
        [MaxLength(255)]
        public string FirstName { get; set; }
        [Required]
        [MaxLength(255)]
        public string LastName { get; set; }
        [Required]
        [MaxLength(20)]
        public string Phone { get; set; }
        [Required]
        [MaxLength(2000)]
        public string Message { get; set; }
    }
}
