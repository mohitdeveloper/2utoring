using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace StandingOut.Data.DTO.SystemObjects
{
    public class RegisterUser
    {
        [StringLength(250)]
        [Display(Name = "First name")]
        public string FirstName { get; set; }
        [StringLength(250)]
        [Display(Name = "Last name")]
        public string LastName { get; set; }
        [Required]
        [StringLength(250)]
        [Display(Name = "Email address")]
        public string Email { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 8)]
        [DataType(DataType.Password)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,100}$", ErrorMessage = "Password must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 number and 1 special character.")]
        public string Password { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,100}$", ErrorMessage = "Password must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 number and 1 special character.")]
        [Display(Name = "Confirm your password")]
        [Compare("Password", ErrorMessage = "Your Password does not match, please try again.")]
        public string ConfirmPassword { get; set; }

        public string ReturnUrl { get; set; }
        public string IPAddress { get; set; }
        public string VerificationCode { get; set; }
        
    }
}
