using StandingOut.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class TutorCancel
    {
        public TutorCancel()
        {
        }

        [Required]
        [Display(Name = "Why do you want to cancel?")]
        public TutorCancelAccountReason? TutorCancelAccountReason { get; set; }
        [Display(Name = "Please explain")]
        [StringLength(1000)]
        public string TutorCancelAccountReasonDescription { get; set; }
    }
}
