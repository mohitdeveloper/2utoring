using System;

namespace StandingOut.Data.DTO
{
    public class UserProfileComponent
    {
        public UserProfileComponent()
        {
        }
        
        public bool IsTutor { get; set; }
        public Guid? TutorId { get; set; }
        public string FullName { get; set; }
        public string Initials { get; set; }
        public string GoogleProfilePicture { get; set; }
        public string ImageDownlaodUrl
        {
            get
            {
                if (TutorId.HasValue)
                    return $"/Tutors/DownloadImage/{TutorId.Value}?dummy={Guid.NewGuid()}";
                else
                    return string.Empty;
            }
        }
    }
}
