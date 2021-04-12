using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace StandingOut.Business.Services
{
    public class SystemToolService : ISystemToolService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
		private readonly AppSettings _AppSettings;
        private bool _Disposed;

        public SystemToolService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
			_AppSettings = appSettings.Value;
        }

		public SystemToolService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.SystemTool>> Get()
        {
            return await _UnitOfWork.Repository<Models.SystemTool>().Get();
        }

        public async Task<List<Models.SystemTool>> Get(Guid classSessionId)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.ClassSessionId == classSessionId);
            if (classSession.RequiresGoogleAccount == true)
            {
                return await _UnitOfWork.Repository<Models.SystemTool>().Get();
            } else
            {
                return await _UnitOfWork.Repository<Models.SystemTool>().Get(o => o.Name.ToLower() != "file");
            }
        }

        public async Task<Models.SystemTool> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SystemTool>().GetSingle(o => o.SystemToolId == id);
        }

        public async Task<Models.SystemTool> Create(Models.SystemTool model)
        {
            await _UnitOfWork.Repository<Models.SystemTool>().Insert(model);
            return model;
        }

        public async Task<Models.SystemTool> Update(Models.SystemTool model)
        {
            await _UnitOfWork.Repository<Models.SystemTool>().Update(model);
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

