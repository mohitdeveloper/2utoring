using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOut.Shared.Helpers.AzureFileHelper
{
    public class AzureFileHelper : IAzureFileHelper
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly UserManager<Models.User> _UserManager;

        public AzureFileHelper(IUnitOfWork unitOfWork, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _UserManager = userManager;
        }

        private async Task<string> GetConnectionString()
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            return settings.AzureBlobConnectionString;
        }

        public async Task<string> UploadBlob(Stream File, string filename, string blobContainer)
        {
            //get connection string
            string connstring = await GetConnectionString();

            //now get the container and create it if it doesn't exist
            BlobContainerClient container = new BlobContainerClient(connstring, blobContainer);
            await container.CreateIfNotExistsAsync();

            bool unique = false;
            int counter = 1;

            //Get a reference to the blob.
            BlobClient blobBlock = container.GetBlobClient(filename);

            if (!blobBlock.Exists())
                unique = true;

            var original = filename;

            //loop till we get a unique name
            while (!unique)
            {
                //Get a reference to the blob.
                blobBlock = container.GetBlobClient(filename);

                if (blobBlock.Exists())
                {
                    filename = GetBlobUniqueFileName(counter, original);
                    counter++;
                }
                else
                    unique = true;

            }

            await blobBlock.UploadAsync(File);

            return filename;
        }

        public async Task<Stream> DownloadBlob(string filename, string blobContainer)
        {
            try
            {
                //get connection string
                string connstring = await GetConnectionString();

                //now get the container and create it if it doesn't exist
                BlobContainerClient container = new BlobContainerClient(connstring, blobContainer);

                //Get a reference to the blob.
                BlobClient blobBlock = container.GetBlobClient(filename);

                //initialise memorystream and return file
                MemoryStream file = new MemoryStream();
                var respone = await blobBlock.DownloadToAsync(file);

                file.Position = 0;

                return file;
            }
            catch (Exception)
            {

                return null;
            }
        }

        public async Task DeleteBlob(string filename, string blobContainer)
        {
            //get connection string
            string connstring = await GetConnectionString();

            //now get the container and create it if it doesn't exist
            BlobContainerClient container = new BlobContainerClient(connstring, blobContainer);

            //Get a reference to the blob.
            BlobClient blobBlock = container.GetBlobClient(filename);

            await blobBlock.DeleteIfExistsAsync();
        }

        public async Task<List<string>> GetFileList(string blobContainer)
        {
            //get connection string
            string connstring = await GetConnectionString();

            //now get the container and create it if it doesn't exist
            BlobContainerClient container = new BlobContainerClient(connstring, blobContainer);

            List<string> blobs = new List<string>();
            await foreach (BlobItem blobItem in container.GetBlobsAsync())
            {
                blobs.Add(blobItem.Name);
            }

            return blobs;
        }

        public byte[] ConvertToByteArray(Stream stream)
        {
            stream.Position = 0;
            using (var memoryStream = new MemoryStream())
            {
                stream.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }

        private string GetBlobUniqueFileName(int count, string filename)
        {
            string origFilename = filename;

            var currentNumber = count;
            var extension = Path.GetExtension(origFilename);
            var name = Path.GetFileNameWithoutExtension(origFilename);

            extension = extension.StartsWith(".") ? extension : "." + extension;

            //filename = Slugify(string.Format("{0}-{1}{2}", name, currentNumber, extension));
            filename = string.Format("{0}-{1}{2}", name, currentNumber, extension);

            return filename;
        }    


        public void Dispose()
        {
            GC.Collect();
        }

    }
}
