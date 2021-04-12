using System;
using System.Collections.Generic;
using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Models = StandingOut.Data.Models;

namespace StandingOut.Business.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public SubscriptionService(IUnitOfWork unitOfWork, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _UserManager = userManager;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                _Disposed = true;
            }
        }

        public async Task<List<Models.Subscription>> Get()
        {
            return await _UnitOfWork.Repository<Models.Subscription>().Get();
        }

        public async Task<Models.Subscription> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.Subscription>().GetByID(id);
        }

        public async Task<Models.Subscription> Create(Models.Subscription model)
        {
            var insertedCount = await _UnitOfWork.Repository<Models.Subscription>().Insert(model);
            return (insertedCount > 0) ? await GetById(model.SubscriptionId) : null;
        }

        public async Task<Models.Subscription> Update(Models.Subscription model)
        {
            var updatedCount = await _UnitOfWork.Repository<Models.Subscription>().Update(model);
            return (updatedCount > 0) ? await GetById(model.SubscriptionId) : null;
        }

        public async Task<int> Delete(Guid id)
        {
            return await _UnitOfWork.Repository<Models.Subscription>().Delete(id);
        }
    }
}
