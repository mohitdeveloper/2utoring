using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class ViewStudent
    {
        public ViewStudent()
        {
            StudentSessions ??= new List<DTO.StudentSession>();
        }

        public Models.User Student { get; set; }
        public IList<DTO.StudentSession> StudentSessions { get; set; }
    }
}
