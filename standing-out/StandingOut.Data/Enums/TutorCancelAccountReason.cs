using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Enums
{
    public enum TutorCancelAccountReason
    {
        [Display(Name = "I've chosen to use a different platform")]
        ChosenDifferentPlatform = 1,
        [Display(Name = "The platform is lacking the tools I require to tutor online")]
        LackingFeatures = 2,
        [Display(Name = "I find the platform too expensive")]
        TooExpensive = 3,
        [Display(Name = "I'm no longer making use of the platform")]
        NoLongerUsing = 4,
        [Display(Name = "Other")]
        Other = 5,
    }
}
