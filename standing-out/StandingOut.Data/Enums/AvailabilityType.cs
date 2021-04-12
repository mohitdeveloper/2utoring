using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Enums
{
    public enum AvailabilityType
    {
        [Display(Name = "Pattern")]
        Pattern = 0,

        [Display(Name = "Deleted")]
        Deleted = 1,

        [Display(Name = "Added")]
        Added = 2,
       
    }
}
