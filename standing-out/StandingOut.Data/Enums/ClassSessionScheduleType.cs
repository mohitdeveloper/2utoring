using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Enums
{
    public enum ClassSessionScheduleType
    {
        [Display(Name = "Never")]
        Never = 0,
        [Display(Name = "Every Day")]
        EveryDay = 1,
        [Display(Name = "Every Week")]
        EveryWeek = 2,
        [Display(Name = "Every Two Weeks")]
        EveryTwoWeeks = 3,
        [Display(Name = "Every Four Weeks")]
        EveryFourWeeks = 4,
    }
}
