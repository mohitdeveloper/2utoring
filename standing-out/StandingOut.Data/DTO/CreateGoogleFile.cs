using StandingOut.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class CreateGoogleFile
    {
        public CreateGoogleFile()
        {
        }
        
        [Required]
        [StringLength(250)]
        public string Name { get; set; }
        [Required]
        public FileType FileType { get; set; }
        [Required]
        [StringLength(250)]
        public string FolderId { get; set; }
    }
}
