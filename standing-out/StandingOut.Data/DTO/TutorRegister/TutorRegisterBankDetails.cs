using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO.TutorRegister
{
    public class TutorRegisterBankDetails
    {
        public string UserId { get; set; }
        public Guid? TutorId { get; set; }

        [Required]
        [StringLength(20)]
        public string BankAccountNumber { get; set; }
        [Required]
        [StringLength(10)]
        public string BankSortCode { get; set; }
        [Required]
        [StringLength(250)]
        public string AddressLine1 { get; set; }
        [Required]
        [StringLength(10)]
        public string Postcode { get; set; }
    }
}


