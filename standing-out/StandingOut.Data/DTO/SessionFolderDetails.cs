using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class SessionFolderDetails
    {
        public SessionFolderDetails() { StudentFolders = new List<Google.Apis.Drive.v3.Data.File>(); }
        public Google.Apis.Drive.v3.Data.File SessionFolder { get; set; }
        public Google.Apis.Drive.v3.Data.File BaseStudentFolder { get; set; }
        public Google.Apis.Drive.v3.Data.File BaseTutorFolder { get; set; }
        public Google.Apis.Drive.v3.Data.File SharedStudentFolder { get; set; }
        public Google.Apis.Drive.v3.Data.File MasterStudentFolder { get; set; }
        public IList<Google.Apis.Drive.v3.Data.File> StudentFolders { get; set; }

        public void PassAnotherFolderDetails(SessionFolderDetails sessionFolderDetails)
        {
            if (sessionFolderDetails.SessionFolder != null)
                SessionFolder = sessionFolderDetails.SessionFolder;
            if (sessionFolderDetails.BaseStudentFolder != null)
                BaseStudentFolder = sessionFolderDetails.BaseStudentFolder;
            if (sessionFolderDetails.BaseTutorFolder != null)
                BaseTutorFolder = sessionFolderDetails.BaseTutorFolder;
            if (sessionFolderDetails.SharedStudentFolder != null)
                SharedStudentFolder = sessionFolderDetails.SharedStudentFolder;
            if (sessionFolderDetails.MasterStudentFolder != null)
                MasterStudentFolder = sessionFolderDetails.MasterStudentFolder;
            if (sessionFolderDetails.StudentFolders != null && sessionFolderDetails.StudentFolders.Count > 0)
                foreach (var studentFolder in sessionFolderDetails.StudentFolders)
                    StudentFolders.Add(studentFolder);
        }
    }
}
