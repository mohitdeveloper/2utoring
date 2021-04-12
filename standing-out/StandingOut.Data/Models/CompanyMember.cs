using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    [Table("CompanyMember")]
    public class CompanyMember : EntityBase
    {
        public CompanyMember() { }

        [Key]
        public Guid CompanyTeamId { get; set; }

        [ForeignKey("Company")]
        public Guid CompanyId { get; set; }

        // ADMIN Details
        [Required]
        [StringLength(250)]
        public string Name { get; set; }

        [Required]
        [StringLength(250)]
        public string Role { get; set; }

        [StringLength(2000)]
        public string Description { get; set; }

        // PROFILE Image stuff
        [StringLength(250)]
        public string ImageName { get; set; }
        [StringLength(1000)]
        public string ImageDirectory { get; set; }

        public string ProfileImageFileLocation { get; set; }
        [StringLength(2000)]
        public string ProfileImageFileName { get; set; }
 
        public string StoreProfileImageDownload
        {
            get
            {
                return !string.IsNullOrEmpty(ProfileImageFileLocation) ? $"/CompanyTeam/Home/DownloadCompanyProfileImage/{CompanyTeamId}?dummy={Guid.NewGuid()}" : "";
            }
        }
        public virtual Company Company { get; set; }
    }
}
