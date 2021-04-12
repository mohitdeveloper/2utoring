using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace StandingOut.Data.DTO
{
  public  class CodeVerification
    {
        [Required]
        [Display(Name = "Verification Code")]
        public string VCode { get; set; }

        public string UserId { get; set; }
        public string ReturnUrl { get; set; }

    }
}
