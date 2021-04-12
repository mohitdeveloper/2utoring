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
    public class TutorQualificationService : ITutorQualificationService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public TutorQualificationService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public TutorQualificationService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.TutorQualification>> GetByTutor(Guid id)
        {
            return await _UnitOfWork.Repository<Models.TutorQualification>().Get(o => o.TutorId == id);
        }

        public async Task<Models.TutorQualification> Create(Models.TutorQualification model)
        {
            await _UnitOfWork.Repository<Models.TutorQualification>().Insert(model);
            return model;
        }

        public async Task<Models.TutorQualification> Update(Models.TutorQualification model)
        {
            await _UnitOfWork.Repository<Models.TutorQualification>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var tutorQualification = await _UnitOfWork.Repository<Models.TutorQualification>().GetSingle(o => o.TutorQualificationId == id);
            tutorQualification.IsDeleted = true;
            await Update(tutorQualification);
        }
    }
}

