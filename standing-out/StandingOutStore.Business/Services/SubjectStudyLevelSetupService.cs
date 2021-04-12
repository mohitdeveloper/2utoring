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
using StandingOut.Data.Enums;

namespace StandingOutStore.Business.Services
{
    public class SubjectStudyLevelSetupService : ISubjectStudyLevelSetupService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly ICompanySubjectService _CompanySubjectService;

        private readonly ITutorSubjectService _TutorSubjectService;
        private readonly ICompanySubjectStudyLevelService _CompanySubjectStudyLevelService;
        private readonly ITutorSubjectStudyLevelService _TutorSubjectStudyLevelService;
        private readonly IStudyLevelService _StudyLevelService;
        private bool _Disposed;

        public SubjectStudyLevelSetupService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings,
            UserManager<Models.User> userManager,

            ICompanySubjectService companySubjectService,
            ITutorSubjectService tutorSubjectService,
            ICompanySubjectStudyLevelService companySubjectStudyLevelService,
            ITutorSubjectStudyLevelService tutorSubjectStudyLevelService
            )
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            _CompanySubjectService = companySubjectService;
            _TutorSubjectService = tutorSubjectService;
            _CompanySubjectStudyLevelService = companySubjectStudyLevelService;
            _TutorSubjectStudyLevelService = tutorSubjectStudyLevelService;
        }

        public SubjectStudyLevelSetupService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<Models.SubjectStudyLevelSetup> getPricePerPerson(DTO.SubjectStudyLevelSetupPrice model)
        {
            
            if (model.CompanyId != null)
            {
                return await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().GetSingle(x => x.CompanyId == model.CompanyId && x.SubjectId == model.SubjectId && x.StudyLevelId == model.StudyLevelId);
            }
            else
            {
                return await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().GetSingle(x => x.TutorId ==  model.TutorId && x.SubjectId == model.SubjectId && x.StudyLevelId == model.StudyLevelId);
            }
        }


        /// <summary>
        /// Gets data based on CompanyId or TutorId
        /// </summary>
        /// <param name="ContextEntityId"></param>
        /// <returns></returns>
        public async Task<List<Models.SubjectStudyLevelSetup>> Get(Guid ContextEntityId)
        {
            return await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>()
                .Get(x => x.CompanyId == ContextEntityId || x.TutorId == ContextEntityId);
        }

        /// <summary>
        /// Get a list of Subject - Study Level items with Price for Company or Tutor.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<DTO.PagedList<DTO.SubjectStudyLevelSetup>> GetPaged(DTO.SubjectStudyLevelSearchModel model)
        {
            var data = (model.SubjectStudyLevelSetupType == SubjectStudyLevelSetupType.Tutor)
                ? GetPagedTutorData(model)
                : GetPagedCompanyData(model);

            var result = new DTO.PagedList<DTO.SubjectStudyLevelSetup>();

            if (!string.IsNullOrWhiteSpace(model.Search))
            {
                string search = model.Search.ToLower();
                data = data.Where(o => (o.Subject.Name != null && o.Subject.Name.ToLower().Contains(search) || o.StudyLevel.Name != null && o.StudyLevel.Name.ToLower().Contains(search)));
            }

            System.Reflection.PropertyInfo prop = typeof(DTO.SubjectStudyLevelSetup).GetProperty(model.SortType);
            if (prop != null && (model.Order == "ASC" || model.Order == "DESC") && !model.SortType.Trim().Contains(" ")) //These are checks are to reduce the likelyhood of SQL Injection
            {
                data = data.OrderBy($"{model.SortType.Trim().Replace(" ", "")} {model.Order}"); //Sames for these bits
            }
            else
            {
                //perform some manual sorting (if required, this should only be for sub-objects).
                switch (model.SortType)
                {
                    case "Subject.Name":
                        data = model.Order == "DESC" ? data.OrderByDescending(o => o.Subject.Name) : data.OrderBy(o => o.Subject.Name);
                        break;
                    case "StudyLevel.Name":
                        data = model.Order == "DESC" ? data.OrderByDescending(o => o.StudyLevel.Name) : data.OrderBy(o => o.StudyLevel.Name);
                        break;
                }
            }

            if (data.Any())
            {
                var dataOut = await data.Skip((model.Page - 1) * model.Take).Take(model.Take).ToListAsync();
                result.Data =
                    Mapping.Mappings.Mapper
                        .Map<List<Models.SubjectStudyLevelSetup>, List<DTO.SubjectStudyLevelSetup>>(dataOut);
            }
            else result.Data = new List<DTO.SubjectStudyLevelSetup>();

            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalCount = data.Count();

            if (result.Paged.TotalCount > 0)
                result.Paged.TotalPages = (int)Math.Ceiling(Convert.ToDecimal(result.Paged.TotalCount) / Convert.ToDecimal(result.Paged.Take));
            else
                result.Paged.TotalPages = 0;

            return result;
        }

        private IQueryable<Models.SubjectStudyLevelSetup> GetPagedCompanyData(DTO.SubjectStudyLevelSearchModel model)
        {
            var data =
                _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>()
                    .GetQueryable(o => o.CompanyId == model.OwningEntityId && o.IsDeleted == false,
                        includeProperties: "Subject, StudyLevel, Company");

            if (!string.IsNullOrWhiteSpace(model.StudyLevelSearch) || !string.IsNullOrWhiteSpace(model.SubjectNameSearch))
            {
                string subjectNameSearch = model.SubjectNameSearch?.ToLower() ?? string.Empty;
                string studyLevelSearch = model.StudyLevelSearch?.ToLower() ?? string.Empty;
                data = data.Where(o => (o.Subject != null &&
                                        o.Subject.Name.ToLower().Contains(subjectNameSearch))
                                       ||
                                       (o.StudyLevel != null
                                        && o.StudyLevel.Name.ToLower().Contains(studyLevelSearch)));
            }

            return data;
        }

        private IQueryable<Models.SubjectStudyLevelSetup> GetPagedTutorData(DTO.SubjectStudyLevelSearchModel model)
        {
            var data =
                _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>()
                    .GetQueryable(o => o.TutorId == model.OwningEntityId && o.IsDeleted==false,
                        includeProperties: "Subject, StudyLevel, Tutor");

            if (!string.IsNullOrWhiteSpace(model.StudyLevelSearch) || !string.IsNullOrWhiteSpace(model.SubjectNameSearch))
            {
                string subjectNameSearch = model.SubjectNameSearch?.ToLower() ?? string.Empty;
                string studyLevelSearch = model.StudyLevelSearch?.ToLower() ?? string.Empty;
                data = data.Where(o => (o.Subject != null &&
                                        o.Subject.Name.ToLower().Contains(subjectNameSearch))
                                       ||
                                       (o.StudyLevel != null
                                        && o.StudyLevel.Name.ToLower().Contains(studyLevelSearch)));
            }

            return data;
        }


        //// Get specific data row
        //public async Task<Models.SubjectStudyLevelSetup> GetByIdWithoutIncludes(Guid id)
        //{
        //    return await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().GetSingle(o => o.SubjectStudyLevelSetupId == id);
        //}

        // Specific pricing record 
        public async Task<Models.SubjectStudyLevelSetup> GetById(Guid id, string includes = "")
        {
            return await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>()
                .GetSingle(o => o.SubjectStudyLevelSetupId == id, includeProperties: includes);
        }

        // Gets a specific pricing record for a Subject-study level combination
        public async Task<Models.SubjectStudyLevelSetup> GetBySubjectStudyLevel(Guid? entityId, Guid subjectId, Guid studyLevelId, string includes = "")
        {
            return await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>()
                .GetSingle(o => (o.TutorId == entityId || o.CompanyId == entityId) && 
                                o.SubjectId == subjectId && 
                                o.StudyLevelId == studyLevelId
                    , includeProperties: includes);
        }

        public async Task<Models.SubjectStudyLevelSetup> Create(Models.SubjectStudyLevelSetup model)
        {
            var existingEntry = await GetBySubjectStudyLevel(model.TutorId ?? model.CompanyId, model.SubjectId, model.StudyLevelId);
            if (existingEntry != null) return model;

            if (model.CompanyId != null && model.CompanyId != Guid.Empty)
            {
                var companySubjectStudyLevel = await CreateCompanySubjectStudyLevelSetup(model);
            }

            if (model.TutorId != null && model.TutorId != Guid.Empty)
            {
                var tutorSubjectStudyLevel = await CreateTutorSubjectStudyLevelSetup(model);
            }

            await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Insert(model);
            return model;
        }

        private async Task<Models.CompanySubjectStudyLevel> CreateCompanySubjectStudyLevelSetup(Models.SubjectStudyLevelSetup model)
        {
            Models.CompanySubjectStudyLevel companySubjectStudyLevel;

            // If setting value for a new set - create the set for the company
            companySubjectStudyLevel = new Models.CompanySubjectStudyLevel
            {
                CompanySubject = new Models.CompanySubject
                { CompanyId = model.CompanyId.Value, SubjectId = model.SubjectId },
                StudyLevelId = model.StudyLevelId
            };
            companySubjectStudyLevel = await _CompanySubjectStudyLevelService.CreateIfNotExists(companySubjectStudyLevel);

            //model.CompanySubjectStudyLevelId = companySubjectStudyLevel.CompanySubjectStudyLevelId;
            return companySubjectStudyLevel;
        }


        private async Task<Models.TutorSubjectStudyLevel> CreateTutorSubjectStudyLevelSetup(Models.SubjectStudyLevelSetup model)
        {
            Models.TutorSubjectStudyLevel tutorSubjectStudyLevel;
            tutorSubjectStudyLevel = new Models.TutorSubjectStudyLevel
            {
                TutorSubject = new Models.TutorSubject
                { TutorId = model.TutorId.Value, SubjectId = model.SubjectId },
                StudyLevelId = model.StudyLevelId
            };
            tutorSubjectStudyLevel = await _TutorSubjectStudyLevelService.CreateIfNotExists(tutorSubjectStudyLevel);

            //model.TutorSubjectStudyLevelId = tutorSubjectStudyLevel.TutorSubjectStudyLevelId;
            return tutorSubjectStudyLevel;
        }

        /// <summary>
        /// When editing we only change price.. (not the subject and level combination)
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<Models.SubjectStudyLevelSetup> Update(Models.SubjectStudyLevelSetup model)
        {
            await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Update(model);
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

