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
    public class CompanySubjectStudyLevelService : ICompanySubjectStudyLevelService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public CompanySubjectStudyLevelService(IUnitOfWork unitOfWork, IHostingEnvironment hosting,
            IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings,
            UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public CompanySubjectStudyLevelService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.CompanySubjectStudyLevel>> GetByCompany(Guid id)
        {
            return await _UnitOfWork.Repository<Models.CompanySubjectStudyLevel>()
                .Get(o => o.CompanySubject.CompanyId == id,
                includeProperties: "CompanySubject, CompanySubject.Subject, StudyLevel");
        }

        public async Task<List<string>> GetByCompanyForProfile(Guid id)
        {
            var companySubjectStudyLevels = await _UnitOfWork.Repository<Models.CompanySubjectStudyLevel>()
                .Get(o => o.CompanySubject.CompanyId == id,
                includeProperties: "CompanySubject, CompanySubject.Subject, StudyLevel");

            var result = new List<string>();
            foreach (var item in companySubjectStudyLevels)
            {
                result.Add($"{item.CompanySubject.Subject.Name} {item.StudyLevel.Name}");
            }

            return result;
        }

        public async Task<Models.CompanySubjectStudyLevel> GetByCompanySubjectStudyLevel(Models.CompanySubject modelCompanySubject, Guid modelStudyLevelId)
        {
            return await _UnitOfWork.Repository<Models.CompanySubjectStudyLevel>()
                .GetSingle(x => x.CompanySubject.CompanyId == modelCompanySubject.CompanyId && 
                                x.CompanySubject.SubjectId == modelCompanySubject.SubjectId && 
                                x.StudyLevelId == modelStudyLevelId);
        }

        public async Task<Models.CompanySubjectStudyLevel> Create(Models.CompanySubjectStudyLevel model)
        {
            await _UnitOfWork.Repository<Models.CompanySubjectStudyLevel>().Insert(model);
            return model;
        }


        public async Task<Models.CompanySubjectStudyLevel> CreateIfNotExists(Models.CompanySubjectStudyLevel model)
        {
            var companySubjectStudyLevel = await GetByCompanySubjectStudyLevel(model.CompanySubject, model.StudyLevelId);
            if (model.CompanySubject?.SubjectCategory != null)
                model.CompanySubject.SubjectCategory = companySubjectStudyLevel.CompanySubject.SubjectCategory;

            //model = (companySubjectStudyLevel == null) ? await Create(model) : await Update(model);
            model = (companySubjectStudyLevel == null) ? await Create(model) : model;

            return model;
        }

        public async Task<Models.CompanySubjectStudyLevel> Update(Models.CompanySubjectStudyLevel model)
        {
            await _UnitOfWork.Repository<Models.CompanySubjectStudyLevel>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var CompanySubjectStudyLevel = await _UnitOfWork.Repository<Models.CompanySubjectStudyLevel>().GetSingle(o => o.CompanySubjectId == id);
            CompanySubjectStudyLevel.IsDeleted = true;
            await Update(CompanySubjectStudyLevel);
        }
    }
}

