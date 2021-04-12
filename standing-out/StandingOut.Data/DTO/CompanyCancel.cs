using StandingOut.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class CompanyCancel
    {
        public CompanyCancel()
        {
        }

        [Required]
        [Display(Name = "Why do you want to cancel?")]
        public CompanyCancelAccountReason? CompanyCancelAccountReason { get; set; }
        [Display(Name = "Please explain")]
        [StringLength(1000)]
        public string CompanyCancelAccountReasonDescription { get; set; }
    }
}
