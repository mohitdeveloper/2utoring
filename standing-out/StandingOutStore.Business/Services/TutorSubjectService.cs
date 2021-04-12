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
    public class TutorSubjectService : ITutorSubjectService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public TutorSubjectService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public TutorSubjectService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.TutorSubject>> GetByTutor(Guid id)
        {
            return await _UnitOfWork.Repository<Models.TutorSubject>().Get(o => o.TutorId == id, includeProperties: "Subject, SubjectCategory, TutorSubjectStudyLevels, TutorSubjectStudyLevels.StudyLevel");
        }

        public async Task<List<string>> GetByTutorForProfile(Guid id)
        {
            var tutorSubjects = await _UnitOfWork.Repository<Models.TutorSubject>().Get(o => o.TutorId == id, includeProperties: "Subject, SubjectCategory, TutorSubjectStudyLevels, TutorSubjectStudyLevels.StudyLevel");
            var result = new List<string>();
            foreach(var tutorSubject in tutorSubjects)
            {
                foreach (var tutorSubjectStudyLevel in tutorSubject.TutorSubjectStudyLevels)
                {
                    result.Add($"{tutorSubject.Subject.Name} {tutorSubjectStudyLevel.StudyLevel.Name}");
                }
            }

            return result;
        }
        public async Task<Models.TutorSubject> GetByTutorAndSubject(Guid id, Guid SubjectId)
        {
            return await _UnitOfWork.Repository<Models.TutorSubject>()
                .GetSingle(o => o.TutorId == id &&
                          o.SubjectId == SubjectId
                , includeProperties: "Subject, SubjectCategory, TutorSubjectStudyLevels, TutorSubjectStudyLevels.StudyLevel");
        }

        public async Task<Models.TutorSubject> Create(Models.TutorSubject model)
        {
            await _UnitOfWork.Repository<Models.TutorSubject>().Insert(model);
            return model;
        }
        public async Task<Models.TutorSubject> CreateIfNotExists(Models.TutorSubject model)
        {
            var tutorSubject = await GetByTutorAndSubject(model.TutorId, model.SubjectId);
            if (model.SubjectCategory != null)
                tutorSubject.SubjectCategory = model.SubjectCategory;

            //model = (tutorSubject == null) ? await Create(model) : await Update(tutorSubject);
            model = (tutorSubject == null) ? await Create(model) : model;
            return model;
        }

        public async Task<Models.TutorSubject> Update(Models.TutorSubject model)
        {
            await _UnitOfWork.Repository<Models.TutorSubject>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var tutorSubject = await _UnitOfWork.Repository<Models.TutorSubject>().GetSingle(o => o.TutorSubjectId == id);
            tutorSubject.IsDeleted = true;
            await Update(tutorSubject);
        }
    }
}

