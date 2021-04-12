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
    public class TutorSubjectStudyLevelService : ITutorSubjectStudyLevelService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public TutorSubjectStudyLevelService(IUnitOfWork unitOfWork, IHostingEnvironment hosting,
            IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings,
            UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public TutorSubjectStudyLevelService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.TutorSubjectStudyLevel>> GetByTutor(Guid id)
        {
            return await _UnitOfWork.Repository<Models.TutorSubjectStudyLevel>()
                .Get(o => o.TutorSubject.TutorId == id,
                includeProperties: "TutorSubject, TutorSubject.Subject, StudyLevel");
        }

        public async Task<List<string>> GetByTutorForProfile(Guid id)
        {
            var TutorSubjectStudyLevels = await _UnitOfWork.Repository<Models.TutorSubjectStudyLevel>()
                .Get(o => o.TutorSubject.TutorId == id,
                includeProperties: "TutorSubject, TutorSubject.Subject, StudyLevel");

            var result = new List<string>();
            foreach (var item in TutorSubjectStudyLevels)
            {
                result.Add($"{item.TutorSubject.Subject.Name} {item.StudyLevel.Name}");
            }

            return result;
        }

        public async Task<Models.TutorSubjectStudyLevel> GetByTutorSubjectStudyLevel(Models.TutorSubject modelTutorSubject, Guid modelStudyLevelId)
        {
            return await _UnitOfWork.Repository<Models.TutorSubjectStudyLevel>()
                .GetSingle(x => x.TutorSubject.TutorId == modelTutorSubject.TutorId &&
                                x.TutorSubject.SubjectId == modelTutorSubject.SubjectId &&
                                x.StudyLevelId == modelStudyLevelId);
        }

        public async Task<Models.TutorSubjectStudyLevel> Create(Models.TutorSubjectStudyLevel model)
        {
            await _UnitOfWork.Repository<Models.TutorSubjectStudyLevel>().Insert(model);
            return model;
        }


        public async Task<Models.TutorSubjectStudyLevel> CreateIfNotExists(Models.TutorSubjectStudyLevel model)
        {
            var tutorSubjectStudyLevel = await GetByTutorSubjectStudyLevel(model.TutorSubject, model.StudyLevelId);
            if (model.TutorSubject?.SubjectCategory != null)
                tutorSubjectStudyLevel.TutorSubject.SubjectCategory = model.TutorSubject.SubjectCategory;

            //model = (tutorSubjectStudyLevel == null) ? await Create(model) : await Update(model);
            model = (tutorSubjectStudyLevel == null) ? await Create(model) : model;
            return model;
        }

        public async Task<Models.TutorSubjectStudyLevel> Update(Models.TutorSubjectStudyLevel model)
        {
            await _UnitOfWork.Repository<Models.TutorSubjectStudyLevel>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var TutorSubjectStudyLevel = await _UnitOfWork.Repository<Models.TutorSubjectStudyLevel>().GetSingle(o => o.TutorSubjectId == id);
            TutorSubjectStudyLevel.IsDeleted = true;
            await Update(TutorSubjectStudyLevel);
        }
    }
}

