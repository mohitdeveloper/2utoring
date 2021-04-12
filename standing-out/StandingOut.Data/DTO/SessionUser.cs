namespace StandingOut.Data.DTO
{
    public class SessionUser
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public bool IsTutor { get; set; }
        public string FullName { get; set; }
        public string GoogleProfilePicture { get; set; }
    }

    public class VideoRoomGroup
    {
        public string Text { get; set; }
        public string Value { get; set; }
        public string PermissionType { get; set; }
        public bool IsIndividual { get; set; }
        public string UserId { get; set; }
        public bool HelpRequested { get; set; }
    }
}
