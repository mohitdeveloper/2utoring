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
    public class SubjectService : ISubjectService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public SubjectService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public SubjectService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<DTO.SearchOption>> GetOptions()
        {
            return await _UnitOfWork.Repository<Models.Subject>().GetQueryable()
                .Select(x => new DTO.SearchOption()
                {
                    Name = x.Name,
                    Id = x.SubjectId,
                    Url = x.Url
                })
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        public async Task<List<Models.Subject>> Get()
        {
            var model= await _UnitOfWork.Repository<Models.Subject>().Get();

            return model.OrderBy(x => x.Name).ToList();
        }

        public async Task<DTO.PagedList<DTO.Subject>> GetPaged(DTO.SearchModel model)
        {
            IQueryable<Models.Subject> data = _UnitOfWork.Repository<Models.Subject>().GetQueryable();

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => (o.Name != null && o.Name.ToLower().Contains(search))
);
            }

            var result = new DTO.PagedList<DTO.Subject>();

            System.Reflection.PropertyInfo prop = typeof(Models.Subject).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {
                //perform some manual sorting (if required, this should only be for sub-objects).
            }

            result.Data = Mapping.Mappings.Mapper.Map<List<Models.Subject>, List<DTO.Subject>>(await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;

            return result;
        }

        public async Task<Models.Subject> GetByIdWithoutIncludes(Guid id)
        {
            return await _UnitOfWork.Repository<Models.Subject>().GetSingle(o => o.SubjectId == id);
        }

        public async Task<Models.Subject> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.Subject>().GetSingle(o => o.SubjectId == id);
        }
        public async Task<List<Models.Subject>> GetCompanySubjects(Guid id)
        {
            var SubjectStudyLevelSetupList= await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.CompanyId == id && o.IsDeleted==false, includeProperties: "Subject");
            return SubjectStudyLevelSetupList.Select(x => x.Subject).Distinct().ToList();
        }
        public async Task<List<Models.Subject>> GetTutorSubjects(Guid id)
        {
            var SubjectStudyLevelSetupList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.TutorId == id && o.IsDeleted == false, includeProperties: "Subject");
            return SubjectStudyLevelSetupList.Select(x => x.Subject).Distinct().ToList();
        }

        public async Task<Models.Subject> GetById(Guid id, string includes)
        {
            return await _UnitOfWork.Repository<Models.Subject>().GetSingle(o => o.SubjectId == id, includeProperties: includes);
        }

        public async Task<Models.Subject> GetByUrl(string url)
        {
            return await _UnitOfWork.Repository<Models.Subject>().GetSingle(o => o.Url.ToLower().Trim() == url.ToLower().Trim());
        }

        public async Task<Models.Subject> Create(Models.Subject model)
        {
            model.Url = Utilities.StringUtilities.Slugify(model.Name.Replace("+", "plus"));
            await _UnitOfWork.Repository<Models.Subject>().Insert(model);
            return model;
        }

        public async Task<Models.Subject> Update(Models.Subject model)
        {
            model.Url = Utilities.StringUtilities.Slugify(model.Name.Replace("+", "plus"));
            await _UnitOfWork.Repository<Models.Subject>().Update(model);
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

