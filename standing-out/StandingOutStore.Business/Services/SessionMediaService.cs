using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace StandingOutStore.Business.Services
{
    public class SessionMediaService : ISessionMediaService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private bool _Disposed;

        public SessionMediaService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
        }

        public SessionMediaService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.SessionMedia>> GetByClassSession(Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.SessionMedia>().Get(o => o.ClassSessionId == classSessionId);
        }

        public async Task<Models.SessionMedia> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SessionMedia>().GetSingle(o => o.SessionMediaId == id);
        }

        public async Task<Models.SessionMedia> Create(Models.SessionMedia model)
        {
            await _UnitOfWork.Repository<Models.SessionMedia>().Insert(model);
            return model;
        }

        public async Task<Models.SessionMedia> Update(Models.SessionMedia model)
        {
            await _UnitOfWork.Repository<Models.SessionMedia>().Update(model);
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

