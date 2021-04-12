using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace StandingOut.Data
{
    public class GenericRepository<TEntity> where TEntity : class
    {
        internal DbEntities context;
        internal DbSet<TEntity> dbSet;
        internal Expression<Func<TEntity, bool>> globalFilter;
        internal Func<TEntity, bool> matchesFilter { get; private set; }

        public GenericRepository(DbEntities context)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();
        }

        public GenericRepository(DbEntities context, Expression<Func<TEntity, bool>> filter)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();
            this.globalFilter = filter;
            this.matchesFilter = filter.Compile();
        }

        #region -- Public Methods --

        //public virtual IQueryable<TEntity> Get(
        //    Expression<Func<TEntity, bool>> filter = null,
        //    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        //    string includeProperties = "", int? skip = null, int? take = null)
        //{
        //    IQueryable<TEntity> query = BuildQuery(filter, orderBy, includeProperties);

        //    if (skip.HasValue && skip.Value > 0) query = query.Skip(skip.Value);
        //    if (take.HasValue) query = query.Take(take.Value);

        //    return query;
        //}

        //public virtual TEntity GetSingle(
        //    Expression<Func<TEntity, bool>> filter = null,
        //    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        //    string includeProperties = "")
        //{
        //    IQueryable<TEntity> query = BuildQuery(filter, orderBy, includeProperties);
        //    return query.FirstOrDefault();
        //}

        //public virtual int GetCount(Expression<Func<TEntity, bool>> filter = null)
        //{
        //    IQueryable<TEntity> query = BuildQuery(filter, null, "");
        //    return query.Count();
        //}

        //public virtual TEntity GetByID(object id)
        //{
        //    return dbSet.Find(id);
        //}

        //public virtual void Insert(TEntity entity)
        //{
        //    dbSet.Add(entity);
        //}

        //public virtual void InsertRange(List<TEntity> entity)
        //{
        //    dbSet.AddRange(entity);
        //}

        //public virtual void Delete(object id)
        //{
        //    TEntity entityToDelete = dbSet.Find(id);
        //    Delete(entityToDelete);
        //}


        //public virtual void Delete(TEntity entityToDelete)
        //{
        //    dbSet.Remove(entityToDelete);
        //}

        //public virtual void Delete(List<TEntity> list)
        //{
        //    dbSet.RemoveRange(list);
        //}

        //public virtual void Update(TEntity entityToUpdate)
        //{
        //    dbSet.Attach(entityToUpdate);
        //    context.Entry(entityToUpdate).State = EntityState.Modified;
        //}


        //public virtual void UpdateRange(List<TEntity> range)
        //{
        //    foreach (TEntity entityToUpdate in range)
        //    {
        //        dbSet.Attach(entityToUpdate);
        //        context.Entry(entityToUpdate).State = EntityState.Modified;
        //    }
        //}

        //public virtual IEnumerable<TEntity> GetWithRawSql(string query, params object[] parameters)
        //{
        //    try
        //    {
        //        if (parameters == null || parameters.Length == 0)
        //            return dbSet.FromSql(query).ToList();
        //        else return dbSet.FromSql(query, parameters).ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        return new List<TEntity>();
        //    }
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="orderBy"></param>
        /// <param name="includeProperties"></param>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="includeGlobalFilter">Set to true to include Deleted items (otherwise global filter excludes them)</param>
        /// <returns></returns>
        public virtual async Task<List<TEntity>> Get(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "", int? skip = null, int? take = null, bool includeGlobalFilter = true)
        {
            IQueryable<TEntity> query = BuildQuery(filter, orderBy, includeProperties, includeGlobalFilter);

            if (skip.HasValue && skip.Value > 0) query = query.Skip(skip.Value);
            if (take.HasValue) query = query.Take(take.Value);

            return await query.ToListAsync();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="orderBy"></param>
        /// <param name="includeProperties"></param>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="includeGlobalFilter">Set to true to include Deleted items (otherwise global filter excludes them)</param>
        /// <returns></returns>
        public virtual IQueryable<TEntity> GetQueryable(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "", int? skip = null, int? take = null, bool includeGlobalFilter = true)
        {
            IQueryable<TEntity> query = BuildQuery(filter, orderBy, includeProperties, includeGlobalFilter);

            if (skip.HasValue && skip.Value > 0) query = query.Skip(skip.Value);
            if (take.HasValue) query = query.Take(take.Value);

            return query;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="orderBy"></param>
        /// <param name="includeProperties"></param>
        /// <param name="includeGlobalFilter">Set to true to include Deleted items (otherwise global filter excludes them)</param>
        /// <returns></returns>
        public virtual async Task<TEntity> GetSingle(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "", bool includeGlobalFilter = true)
        {
            IQueryable<TEntity> query = BuildQuery(filter, orderBy, includeProperties, includeGlobalFilter);
            return await query.FirstOrDefaultAsync();
        }


        public virtual async Task<int> GetCount(Expression<Func<TEntity, bool>> filter = null, bool includeGlobalFilter = true)
        {
            IQueryable<TEntity> query = BuildQuery(filter, null, "", includeGlobalFilter);
            return await query.CountAsync();
        }

        public virtual async Task<TEntity> GetByID(object id)
        {
            return await dbSet.FindAsync(id);
        }

        public virtual async Task<int> Insert(TEntity entity)
        {
            dbSet.Add(entity);
            var result = await context.SaveChangesAsync(CancellationToken.None);

            return result;
        }

        public virtual async Task<int> Insert(List<TEntity> entity)
        {
            dbSet.AddRange(entity);
            var result = await context.SaveChangesAsync(CancellationToken.None);

            return result;
        }

        public virtual async Task<int> Delete(object id)
        {
            TEntity entityToDelete = await dbSet.FindAsync(id);
            var result = await Delete(entityToDelete);

            return result;
        }

        public virtual async Task<int> Delete(TEntity entityToDelete)
        {
            if (context.Entry(entityToDelete).State == EntityState.Detached)
            {
                dbSet.Attach(entityToDelete);
            }
            dbSet.Remove(entityToDelete);

            return await context.SaveChangesAsync(CancellationToken.None);
        }

        public virtual async Task<int> Update(TEntity entityToUpdate)
        {
            dbSet.Attach(entityToUpdate);
            context.Entry(entityToUpdate).State = EntityState.Modified;

            return await context.SaveChangesAsync(CancellationToken.None);
        }

        public virtual async Task<int> Update(List<TEntity> entityToUpdate)
        {
            foreach (var item in entityToUpdate)
            {
                dbSet.Attach(item);
                context.Entry(item).State = EntityState.Modified;
            }

            return await context.SaveChangesAsync(CancellationToken.None);
        }

        public virtual async Task Delete(List<TEntity> list)
        {
            dbSet.RemoveRange(list);
            await context.SaveChangesAsync(CancellationToken.None);
        }

        public virtual async Task<IEnumerable<TEntity>> GetWithRawSql(string query, params object[] parameters)
        {
            try
            {
                if (parameters == null || parameters.Length == 0)
                    return await dbSet.FromSql(query).ToListAsync();
                else return await dbSet.FromSql(query, parameters).ToListAsync();
            }
            catch (Exception ex)
            {
                string err = ex.Message;
                return new List<TEntity>();
            }
        }



        #endregion

        #region -- Private Methods --
        /// <summary>
        /// 
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="orderBy"></param>
        /// <param name="includeProperties"></param>
        /// <param name="includeGlobalFilter">Set to true to include Deleted items (otherwise global filter excludes them)</param>
        /// <returns></returns>
        private IQueryable<TEntity> BuildQuery(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "", bool includeGlobalFilter = true)
        {
            IQueryable<TEntity> query = dbSet;

            if (globalFilter != null && includeGlobalFilter)
            {
                query = query.Where(globalFilter);
            }

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty.Trim());
            }

            if (orderBy != null)
            {
                return orderBy(query);
            }
            else
            {
                return query;
            }
        }

        private void ThrowIfEntityDoesNotMatchFilter(TEntity entity)
        {
            if (globalFilter != null && !matchesFilter(entity))
                throw new ArgumentOutOfRangeException();
        }

        #endregion                               
    }
}
