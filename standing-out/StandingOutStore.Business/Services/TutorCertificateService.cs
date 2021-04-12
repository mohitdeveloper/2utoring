using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using System.IO;
using StandingOut.Shared.Helpers.AzureFileHelper;
using StandingOut.Data.Enums;

namespace StandingOutStore.Business.Services
{
    public class TutorCertificateService : ITutorCertificateService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IAzureFileHelper _AzureFileHelper;
        private bool _Disposed;

        public TutorCertificateService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager, IAzureFileHelper azureFileHelper)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _AzureFileHelper = azureFileHelper;
        }

        public TutorCertificateService(IUnitOfWork unitOfWork, AppSettings appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<List<Models.TutorCertificate>> GetByTutor(Guid id)
        {
            return await _UnitOfWork.Repository<Models.TutorCertificate>().Get(o => o.TutorId == id && o.CertificateType==TutorCertificateType.Qualification && o.IsDeleted==false);
        }

        public async Task Upload(Guid tutorId, IFormFile file)
        {
            var tutorCertificate = new Models.TutorCertificate() { TutorId = tutorId };
            using var stream = file.OpenReadStream();
            tutorCertificate.CertificateFileLocation = await _AzureFileHelper.UploadBlob(stream, Guid.NewGuid() + file.FileName.Substring(file.FileName.LastIndexOf('.')), $"tutorcertificates");
            tutorCertificate.CertificateFileName = file.FileName;
            tutorCertificate.CertificateType = TutorCertificateType.Qualification;
            await _UnitOfWork.Repository<Models.TutorCertificate>().Insert(tutorCertificate);
        }

        public async Task<Models.TutorCertificate> Update(Models.TutorCertificate model)
        {
            await _UnitOfWork.Repository<Models.TutorCertificate>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var tutorCertificate = await _UnitOfWork.Repository<Models.TutorCertificate>().GetSingle(o => o.TutorCertificateId == id);
            tutorCertificate.IsDeleted = true;
            await Update(tutorCertificate);
        }

        public async Task<Models.TutorCertificate> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.TutorCertificate>().GetByID(id);
        }

        public async Task<byte[]> GetFile(Guid id)
        {
            var certificate = await GetById(id);

            if (string.IsNullOrWhiteSpace(certificate.CertificateFileName))
                throw new Exception("File Missing");

            if (certificate.CertificateType == TutorCertificateType.DBS)
            {
                var file = await _AzureFileHelper.DownloadBlob(certificate.CertificateFileLocation, $"tutordbscertificates");
                using var mStream = new MemoryStream();
                file.CopyTo(mStream);
                return mStream.ToArray();
            }
            else
            {
                var file = await _AzureFileHelper.DownloadBlob(certificate.CertificateFileLocation, $"tutorcertificates");
                file.Position = 0;
                using var mStream = new MemoryStream();
                file.CopyTo(mStream);
                return mStream.ToArray();
            }

        }
    }
}

