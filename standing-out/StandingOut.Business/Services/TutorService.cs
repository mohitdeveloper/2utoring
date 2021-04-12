using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using System.Text;
using StandingOut.Shared.Helpers.AzureFileHelper;
using Mapping = StandingOut.Shared.Mapping;

namespace StandingOut.Business.Services
{
    public class TutorService : ITutorService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
		private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IAzureFileHelper _AzureFileHelper;
        private bool _Disposed;

        public TutorService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, 
            UserManager<Models.User> userManager, IAzureFileHelper azureFileHelper)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
			_AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

		public TutorService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.Tutor>> Get()
        {
            return await _UnitOfWork.Repository<Models.Tutor>().Get(includeProperties: "Users");
        }

        public async Task<Models.Tutor> GetById(Guid tutorId)
        {
            return await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == tutorId, includeProperties: "Users");
        }
        
        public async Task<Models.Tutor> Create(DTO.CreateTutor model)
        {
            var tutor = new Models.Tutor()
            {
                CalendarId = model.CalendarId,
                Header = model.Header,
                SubHeader = model.SubHeader,
                Biography = model.Biography,
            };

            await _UnitOfWork.Repository<Models.Tutor>().Insert(tutor);

            if (model.File != null)
            {
                var fileStream = model.File.OpenReadStream();
                fileStream.Position = 0;
                tutor.ProfileImageFileLocation = await _AzureFileHelper.UploadBlob(fileStream, Guid.NewGuid() + model.File.FileName.Substring(model.File.FileName.LastIndexOf('.')), $"tutorprofileimages");
                tutor.ProfileImageFileName = model.File.FileName;
                await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
            }

            var user = await _UserManager.FindByIdAsync(model.UserId);
            user.TutorId = tutor.TutorId;
            await _UserManager.UpdateAsync(user);

            await _UserManager.AddToRoleAsync(user, "Tutor");

            return tutor;
        }

        public async Task<Models.Tutor> Update(DTO.EditTutor model)
        {
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetByID(model.TutorId);
            tutor.CalendarId = model.CalendarId;
            tutor.Header = model.Header;
            tutor.SubHeader = model.SubHeader;
            tutor.Biography = model.Biography;
            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

            if (model.File != null)
            {
                var fileStream = model.File.OpenReadStream();
                fileStream.Position = 0;
                tutor.ProfileImageFileLocation = await _AzureFileHelper.UploadBlob(fileStream, Guid.NewGuid() + model.File.FileName.Substring(model.File.FileName.LastIndexOf('.')), $"tutorprofileimages");
                tutor.ProfileImageFileName = model.File.FileName;
                await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
            }
            
            return tutor;
        }

        public async Task<Models.Tutor> UpdateMy(DTO.EditTutor model)
        {
            var tutor = await GetById(model.TutorId);
            tutor.Header = model.Header;
            tutor.SubHeader = model.SubHeader;
            tutor.Biography = model.Biography;

            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);

            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            StringBuilder sb = new StringBuilder();
            sb.AppendLine($"Tutor {tutor.Users.FirstOrDefault().FullName} has updated thier info");
            sb.AppendLine("<ul>");
            sb.AppendLine($"<li><strong>Header</strong>: {tutor.Header}</li>");
            sb.AppendLine($"<li><strong>SubHeader</strong>: {tutor.SubHeader}</li>");
            sb.AppendLine($"<li><strong>Biography</strong>: {tutor.Biography}</li>");
            sb.AppendLine($"<li><strong>Image</strong>: see attached</li>");
            sb.AppendLine("</ul>");

            var attatchments = new List<SendGrid.Helpers.Mail.Attachment>();

            //if (!string.IsNullOrEmpty(tutor.ImageDirectory) && !string.IsNullOrEmpty(tutor.ImageDirectory)) {
            //    attatchments.Add(new SendGrid.Helpers.Mail.Attachment() { Filename = tutor.ImageName, Type = "application/octect-stream", Content = Convert.ToBase64String(System.IO.File.ReadAllBytes(tutor.ImageDirectory + tutor.ImageName)) });
            //}

            await Utilities.EmailUtilities.SendEmail(settings.SendGridApi, "charliebeesley@hotmail.co.uk", "admin@2utoring.com", "Tutor Profile Update", sb.ToString(), null, null, attatchments);

            return tutor;
        }

        public async Task<Models.Tutor> UploadImage(Guid tutorId, ICollection<IFormFile> file)
        {
            var tutor = await GetById(tutorId);
            var fileStream = file.First().OpenReadStream();
            fileStream.Position = 0;
            tutor.ProfileImageFileLocation = await _AzureFileHelper.UploadBlob(fileStream, Guid.NewGuid() + file.First().FileName.Substring(file.First().FileName.LastIndexOf('.')), $"tutorprofileimages");
            tutor.ProfileImageFileName = file.First().FileName;

            await Update(tutor);
            return tutor;
        }

        private async Task Update(Models.Tutor tutor)
        {
            await _UnitOfWork.Repository<Models.Tutor>().Update(tutor);
        }

        private async Task Delete(Guid id)
        {
            var model = await GetById(id);
            model.IsDeleted = true;
            await Update(model);
        }

        public async Task Delete(Models.User model)
        {
            await Delete(model.TutorId.Value);
            model.TutorId = null;
            await _UserManager.UpdateAsync(model);


            await _UserManager.RemoveFromRoleAsync(model, "Tutor");
        }

        public async Task<DTO.TutorProfile> GetProfileById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.Tutor>().GetQueryable(x => x.TutorId == id, includeProperties: "Users, CompanyTutors, CompanyTutors.Company")
                .Select(x => Mapping.Mappings.Mapper.Map<Models.Tutor, DTO.TutorProfile>(x))
                .FirstOrDefaultAsync();
        }
    }
}

