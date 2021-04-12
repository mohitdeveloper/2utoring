using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using Mapping = StandingOut.Shared.Mapping;
using System.Linq.Dynamic.Core;

namespace StandingOutStore.Business.Services
{
    public class SubjectCategoryService : ISubjectCategoryService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public SubjectCategoryService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public SubjectCategoryService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<DTO.GuidOptionExpanded>> GetOptions(Guid? subjectId)
        {           
            if (subjectId.HasValue)
            {
                return await _UnitOfWork.Repository<Models.SubjectCategory>().GetQueryable(o => o.SubjectId == subjectId)
                .Select(x => new DTO.GuidOptionExpanded
                {
                    Name = x.Name,
                    Url = x.Url,
                    Id = x.SubjectCategoryId,
                    ParentUrl = x.Subject.Url,
                    ParentValue = x.SubjectId
                })
                .OrderBy(x => x.Name)
                .ToListAsync();
            } else
            {
                return await _UnitOfWork.Repository<Models.SubjectCategory>().GetQueryable()
                .Select(x => new DTO.GuidOptionExpanded
                {
                    Name = x.Name,
                    Url = x.Url,
                    Id = x.SubjectCategoryId,
                    ParentUrl = x.Subject.Url,
                    ParentValue = x.SubjectId
                })
                .OrderBy(x => x.Name)
                .ToListAsync();
            }
        }

        public async Task<List<Models.SubjectCategory>> Get()
        {
            return await _UnitOfWork.Repository<Models.SubjectCategory>().Get();
        }

        public async Task<DTO.PagedList<DTO.SubjectCategory>> GetPaged(DTO.SearchModel model)
        {
            IQueryable<Models.SubjectCategory> data = _UnitOfWork.Repository<Models.SubjectCategory>().GetQueryable(includeProperties: "Subject");

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => (o.Name != null && o.Name.ToLower().Contains(search))
);
            }

            var result = new DTO.PagedList<DTO.SubjectCategory>();

            System.Reflection.PropertyInfo prop = typeof(Models.SubjectCategory).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {
                switch (model.SortType)
                {
                    case "Subject.Name":
                        data = model.Order == "DESC" ? data.OrderByDescending(o => o.Subject.Name) : data.OrderBy(o => o.Subject.Name);
                        break;
                }
            }

            result.Data = Mapping.Mappings.Mapper.Map<List<Models.SubjectCategory>, List<DTO.SubjectCategory>>(await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;

            return result;
        }

        public async Task<Models.SubjectCategory> GetByIdWithoutIncludes(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SubjectCategory>().GetSingle(o => o.SubjectCategoryId == id);
        }

        public async Task<Models.SubjectCategory> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SubjectCategory>().GetSingle(o => o.SubjectCategoryId == id);
        }

        public async Task<Models.SubjectCategory> GetById(Guid id, string includes)
        {
            return await _UnitOfWork.Repository<Models.SubjectCategory>().GetSingle(o => o.SubjectCategoryId == id, includeProperties: includes);
        }

        public async Task<Models.SubjectCategory> GetByUrl(string url)
        {
            return await _UnitOfWork.Repository<Models.SubjectCategory>().GetSingle(o => o.Url.ToLower().Trim() == url.ToLower().Trim());
        }

        public async Task<Models.SubjectCategory> Create(Models.SubjectCategory model)
        {
            model.Url = Utilities.StringUtilities.Slugify(model.Name.Replace("+", "plus"));
            await _UnitOfWork.Repository<Models.SubjectCategory>().Insert(model);
            return model;
        }

        public async Task<Models.SubjectCategory> Update(Models.SubjectCategory model)
        {
            model.Url = Utilities.StringUtilities.Slugify(model.Name.Replace("+", "plus"));
            await _UnitOfWork.Repository<Models.SubjectCategory>().Update(model);
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

