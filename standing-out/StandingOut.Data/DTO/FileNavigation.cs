using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class FileNavigation
    {
        public FileNavigation()
        {
            ResetToRoot = false;
            DisallowUploadIn = new List<string>();
            DisallowDeleteOn = new List<string>();
        }

        public bool ResetToRoot { get; set; }
        public string ResetToFolder { get; set; }
        public IList<Google.Apis.Drive.v3.Data.File> Files { get; set; }
        public string NextPageToken { get; set; }
        public string RootFolderId { get; set; }
        public string MasterFolderId { get; set; }
        public string StudentFolderId { get; set; }
        public string SharedFolderId { get; set; }
        public string CurrentFolderId { get; set; }
        public List<string> DisallowUploadIn { get; set; }
        public List<string> DisallowDeleteOn { get; set; }
        public List<string> ShowAsImportant { get; set; }
        public List<string> StudentFolders { get; set; }
    }
}
