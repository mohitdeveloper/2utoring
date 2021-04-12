using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;

namespace StandingOut.Business.Services
{
    public class CompanyTutorService : ICompanyTutorService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
		private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public CompanyTutorService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
			_AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

		public CompanyTutorService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.CompanyTutor>> Get()
        {
            return await _UnitOfWork.Repository<Models.CompanyTutor>().Get();
        }

        public async Task<List<Models.CompanyTutor>> GetByCompany(Guid id)
        {
            return await _UnitOfWork.Repository<Models.CompanyTutor>().Get(o => o.CompanyId == id, includeProperties: "Tutor, Tutor.Users");
        }

        public async Task<Models.CompanyTutor> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.CompanyTutor>().GetSingle(o => o.CompanyTutorId == id);
        }
        
        public async Task<Models.CompanyTutor> Create(Models.CompanyTutor model)
        {
            await _UnitOfWork.Repository<Models.CompanyTutor>().Insert(model);
            return model;
        }

        public async Task<Models.CompanyTutor> Update(Models.CompanyTutor model)
        {
            await _UnitOfWork.Repository<Models.CompanyTutor>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var model = await GetById(id);
            model.IsDeleted = true;
            await Update(model);
        }
    }
}

