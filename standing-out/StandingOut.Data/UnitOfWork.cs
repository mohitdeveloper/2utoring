using StandingOut.Data.Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Threading;
using Microsoft.AspNetCore.Identity;

namespace StandingOut.Data
{
    public interface IUnitOfWork
    {
        GenericRepository<TEntity> Repository<TEntity>() where TEntity : EntityBase;
        Task ExecuteRawSql(string sql, params object[] parameters);
        Task Save();
        void Detach(Object obj);
        DbEntities GetContext();
    }

    public class UnitOfWork : IUnitOfWork
    {
        private DbEntities _Context;
        private IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private Models.User _User;

        public UnitOfWork(DbEntities dbEntities, IHttpContextAccessor httpContext, UserManager<Models.User> userManager)
        {
            _Context = dbEntities;
            _HttpContext = httpContext;
            _UserManager = userManager;

            if (_HttpContext != null && _HttpContext.HttpContext != null && _HttpContext.HttpContext.User != null && !string.IsNullOrWhiteSpace(_HttpContext.HttpContext.User.Identity.Name))
                SetUser(_HttpContext.HttpContext.User.Identity.Name).Wait();
        }

        public UnitOfWork(DbEntities dbEntities)
        {
            _Context = dbEntities;
        }

        private async Task SetUser(string email)
        {
            _User = await _UserManager.FindByEmailAsync(email);
            _Context.SetUser(email);
        }

        public Dictionary<Type, object> _Repositories = new Dictionary<Type, object>();
        public GenericRepository<TEntity> Repository<TEntity>() where TEntity : EntityBase
        {
            // Check to see if we have a constructor for the given type
            if (!_Repositories.ContainsKey(typeof(TEntity)))
            {
                if (_User != null)
                {
                    //if(_User.ContractId.HasValue && TEntity.E).
                    _Repositories.Add(typeof(TEntity), new GenericRepository<TEntity>(_Context, o => o.IsDeleted == false));
                }
                else
                {
                    _Repositories.Add(typeof(TEntity), new GenericRepository<TEntity>(_Context, o => o.IsDeleted == false));
                }
            }
            return _Repositories[typeof(TEntity)] as GenericRepository<TEntity>;
        }



        #region -- Raw SQL --

        public async Task ExecuteRawSql(string sql, params object[] parameters)
        {
            await _Context.Database.ExecuteSqlCommandAsync(sql, parameters);
        }

        #endregion

        public async Task Save()
        {
            await _Context.SaveChangesAsync(CancellationToken.None);
        }

        public void Detach(Object obj)
        {
            _Context.Entry(obj).State = EntityState.Detached;
        }

        public DbEntities GetContext()
        {
            return _Context;
        }
    }
}
