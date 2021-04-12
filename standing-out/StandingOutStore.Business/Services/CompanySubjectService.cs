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

namespace StandingOutStore.Business.Services
{
    public class CompanySubjectService : ICompanySubjectService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public CompanySubjectService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, 
            IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, 
            UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public CompanySubjectService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.CompanySubject>> GetByCompany(Guid id)
        {
            return await _UnitOfWork.Repository<Models.CompanySubject>().Get(o => o.CompanyId == id, 
                includeProperties: "Subject, SubjectCategory, CompanySubjectStudyLevels, CompanySubjectStudyLevels.StudyLevel");
        }

        public async Task<List<string>> GetByCompanyForProfile(Guid id)
        {
            var CompanySubjects = await _UnitOfWork.Repository<Models.CompanySubject>().Get(o => o.CompanyId == id, 
                includeProperties: "Subject, SubjectCategory, CompanySubjectStudyLevels, CompanySubjectStudyLevels.StudyLevel");
            var result = new List<string>();
            foreach(var CompanySubject in CompanySubjects)
            {
                foreach (var CompanySubjectStudyLevel in CompanySubject.CompanySubjectStudyLevels)
                {
                    result.Add($"{CompanySubject.Subject.Name} {CompanySubjectStudyLevel.StudyLevel.Name}");
                }
            }

            return result;
        }

        public async Task<Models.CompanySubject> GetByCompanyAndSubject(Guid companyId, Guid SubjectId)
        {
            return await _UnitOfWork.Repository<Models.CompanySubject>().GetSingle(o => o.CompanyId == companyId && o.SubjectId == SubjectId, includeProperties: "Subject");
        }

        public async Task<Models.CompanySubject> Create(Models.CompanySubject model)
        {
            await _UnitOfWork.Repository<Models.CompanySubject>().Insert(model);
            return model;
        }

        public async Task<Models.CompanySubject> CreateIfNotExists(Models.CompanySubject model)
        {
            var companySubject = await GetByCompanyAndSubject(model.CompanyId, model.SubjectId);
            if (model.SubjectCategory != null)
                companySubject.SubjectCategory = model.SubjectCategory;

            //model = (companySubject == null) ? await Create(model) : await Update(companySubject);
            model = (companySubject == null) ? await Create(model) : model;
            return model;
        }

        public async Task<Models.CompanySubject> Update(Models.CompanySubject model)
        {
            await _UnitOfWork.Repository<Models.CompanySubject>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var CompanySubject = await _UnitOfWork.Repository<Models.CompanySubject>().GetSingle(o => o.CompanySubjectId == id);
            CompanySubject.IsDeleted = true;
            await Update(CompanySubject);
        }
    }
}

