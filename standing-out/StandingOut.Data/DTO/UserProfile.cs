using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class UserProfile
    {
        public string Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        [StringLength(255)]
        public string FirstName { get; set; }
        [Required]
        [StringLength(255)]
        public string LastName { get; set; }
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; }
        public bool IsParent { get; set; }
        public string ParentTitle { get; set; }
        [StringLength(250)]
        public string ParentFirstName { get; set; }
        [StringLength(250)]
        public string ParentLastName { get; set; }
    }
    public class UserProfileHeader
    {
        public string ShortName { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string LayoutType { get; set; }

    }
}
