using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;

namespace StandingOut.Business.Services
{
    public class SessionMediaService : ISessionMediaService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private bool _Disposed;

        public SessionMediaService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
        }

		public SessionMediaService(IUnitOfWork unitOfWork)
        {
            _UnitOfWork = unitOfWork;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<List<Models.SessionMedia>> Get(Guid classSessionId)
        {
            return await _UnitOfWork.Repository<Models.SessionMedia>().Get(o => o.ClassSessionId == classSessionId);
        }

        public async Task<Models.SessionMedia> GetById(Guid classSessionId, Guid id)
        {
            return await _UnitOfWork.Repository<Models.SessionMedia>().GetSingle(o => o.SessionMediaId == id && o.ClassSessionId == classSessionId);
        }

        public async Task<Models.SessionMedia> Create(Guid classSessionId, Models.SessionMedia model)
        {
            model.ClassSessionId = classSessionId;

            await _UnitOfWork.Repository<Models.SessionMedia>().Insert(model);
            return model;
        }

        public async Task<Models.SessionMedia> Update(Guid classSessionId, Models.SessionMedia model)
        {
            await _UnitOfWork.Repository<Models.SessionMedia>().Update(model);
            return model;
        }

        public async Task Delete(Guid classSessionId, Guid id)
        {
            var model = await GetById(classSessionId, id);
            model.IsDeleted = true;
            await Update(classSessionId, model);
        }
    }
}

