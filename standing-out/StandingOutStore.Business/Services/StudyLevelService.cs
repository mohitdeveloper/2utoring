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
    public class StudyLevelService : IStudyLevelService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public StudyLevelService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public StudyLevelService(IUnitOfWork unitOfWork, AppSettings appSettings)
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
            var studyLevels = await _UnitOfWork.Repository<Models.StudyLevel>().GetQueryable().AsNoTracking()
                .OrderBy(x => x.Order)
                .ToListAsync();
            return studyLevels.Select(x => new DTO.SearchOption()
                {
                    Name = x.Name,
                    Url = x.Url,
                    Id = x.StudyLevelId
                })
                .ToList();
        }

        public async Task<List<Models.StudyLevel>> Get()
        {
            return await _UnitOfWork.Repository<Models.StudyLevel>().Get();
        }

        public async Task<DTO.PagedList<DTO.StudyLevel>> GetPaged(DTO.SearchModel model)
        {
            IQueryable<Models.StudyLevel> data = _UnitOfWork.Repository<Models.StudyLevel>().GetQueryable();

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => (o.Name != null && o.Name.ToLower().Contains(search))
);
            }

            var result = new DTO.PagedList<DTO.StudyLevel>();

            System.Reflection.PropertyInfo prop = typeof(Models.StudyLevel).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {
                //perform some manual sorting (if required, this should only be for sub-objects).
            }

            result.Data = Mapping.Mappings.Mapper.Map<List<Models.StudyLevel>, List<DTO.StudyLevel>>(await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync());
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;

            return result;
        }

        public async Task<Models.StudyLevel> GetByIdWithoutIncludes(Guid id)
        {
            return await _UnitOfWork.Repository<Models.StudyLevel>().GetSingle(o => o.StudyLevelId == id);
        }

        public async Task<List<Models.StudyLevel>> GetCompanyLevels(Guid id)
        {
            var SubjectStudyLevelSetupList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.CompanyId == id && o.IsDeleted == false, includeProperties: "StudyLevel");
            return SubjectStudyLevelSetupList.Select(x => x.StudyLevel).ToList();
        }
        public async Task<List<Models.StudyLevel>> GetTutorLevels(Guid id)
        {
            var SubjectStudyLevelSetupList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.TutorId == id && o.IsDeleted == false, includeProperties: "StudyLevel");
            return SubjectStudyLevelSetupList.Select(x => x.StudyLevel).ToList();
        }

        public async Task<List<Models.StudyLevel>> GetCompanyLevelsBySubject(Guid id,Guid subjectId)
        {
            var SubjectStudyLevelSetupList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.CompanyId == id && o.SubjectId==subjectId && o.IsDeleted == false, includeProperties: "StudyLevel");
            return SubjectStudyLevelSetupList.Select(x => x.StudyLevel).ToList();
        }
        public async Task<List<Models.StudyLevel>> GetTutorLevelsBySubject(Guid id, Guid subjectId)
        {
            var SubjectStudyLevelSetupList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.TutorId == id && o.SubjectId == subjectId  && o.IsDeleted == false, includeProperties: "StudyLevel");
            return SubjectStudyLevelSetupList.Select(x => x.StudyLevel).ToList();
        }

        


        public async Task<Models.StudyLevel> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.StudyLevel>().GetSingle(o => o.StudyLevelId == id);
        }

        public async Task<Models.StudyLevel> GetById(Guid id, string includes)
        {
            return await _UnitOfWork.Repository<Models.StudyLevel>().GetSingle(o => o.StudyLevelId == id, includeProperties: includes);
        }

        public async Task<Models.StudyLevel> GetByUrl(string url)
        {
            return await _UnitOfWork.Repository<Models.StudyLevel>().GetSingle(o => o.Url.ToLower().Trim() == url.ToLower().Trim());
        }

        public async Task<Models.StudyLevel> Create(Models.StudyLevel model)
        {
            model.Url = Utilities.StringUtilities.Slugify(model.Name.Replace("+", "plus"));
            await _UnitOfWork.Repository<Models.StudyLevel>().Insert(model);
            return model;
        }

        public async Task<Models.StudyLevel> Update(Models.StudyLevel model)
        {
            model.Url = Utilities.StringUtilities.Slugify(model.Name.Replace("+", "plus"));
            await _UnitOfWork.Repository<Models.StudyLevel>().Update(model);
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

