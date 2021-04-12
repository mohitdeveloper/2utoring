using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Enums
{
    public enum SessionMediaType
    {
        [Display(Name = "Video URL")]
        Embed = 0,
        [Display(Name = "Website")]
        Iframe = 1
    }
}
