using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class ScreenshotData
    {
        [Required]
        [StringLength(250)]
        public string Name { get; set; }

        public string ImageData { get; set; }
    }
}
