using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class ContactUs
    {
        public ContactUs()
        {
        }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        
        [MaxLength(255)]
        public string PhoneNo { get; set; }

        [Required]
        [MaxLength(255)]
        public string Email { get; set; }
       
        [MaxLength(2000)]
        public string Message { get; set; }
    }
}
