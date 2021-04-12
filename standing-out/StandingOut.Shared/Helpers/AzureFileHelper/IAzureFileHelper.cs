using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace StandingOut.Shared.Helpers.AzureFileHelper
{
    public interface IAzureFileHelper : IDisposable
    {
        Task<string> UploadBlob(Stream File, string filename, string blobContainer);
        Task<Stream> DownloadBlob(string filename, string blobContainer);
        Task DeleteBlob(string filename, string blobContainer);
        Task<List<string>> GetFileList(string blobContainer);
        byte[] ConvertToByteArray(Stream stream);
    }
}
