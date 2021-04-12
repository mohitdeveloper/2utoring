using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Mapping = StandingOut.Shared.Mapping;

namespace StandingOut.Business.Services
{
    public class SearchService : ISearchService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed;

		public SearchService(IUnitOfWork unitOfWork)
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

        public async Task<DTO.PagedList<DTO.GlobalSearchResult>> Global(DTO.GlobalSearch model)
        {
            var searchTerm = string.IsNullOrWhiteSpace(model.Search) ? model.Search : model.Search.Trim().ToLower();
            var result = new DTO.PagedList<DTO.GlobalSearchResult>();
            IQueryable<DTO.GlobalSearchResult> globalQuery = null;

            // I know this is pulling out all the data -> Sadly this version of ef doesn't like Unions, and freaks out completely when you put an include in there too
            // Matt approved 26/03/2020 ty
            if (model.Tutors)
            {
                var query = _UnitOfWork.Repository<Models.Tutor>().GetQueryable(includeProperties: "Users");
                if (!string.IsNullOrWhiteSpace(searchTerm))
                    query = query.Where(x => x.Users.Any(y => !y.IsDeleted && (y.FirstName + " " + y.LastName).ToLower().Contains(searchTerm)) || x.Header.ToLower().Contains(searchTerm));
                //if (globalQuery == null)
                //    globalQuery = query.Include(x => x.Users).Select(x => Mapping.Mappings.Mapper.Map<Models.Tutor, DTO.GlobalSearchResult>(x));
                //else
                //    globalQuery = globalQuery.Concat(query.Select(x => Mapping.Mappings.Mapper.Map<Models.Tutor, DTO.GlobalSearchResult>(x)));
                result.Data = await query.Select(x => Mapping.Mappings.Mapper.Map<Models.Tutor, DTO.GlobalSearchResult>(x)).ToListAsync();
            }
            if (model.Companies)
            {
                var query = _UnitOfWork.Repository<Models.Company>().GetQueryable();
                if (!string.IsNullOrWhiteSpace(searchTerm))
                    query = query.Where(x => x.Name.ToLower().Contains(searchTerm) || x.Header.ToLower().Contains(searchTerm));
                //if (globalQuery == null)
                //    globalQuery = query.Select(x => Mapping.Mappings.Mapper.Map<Models.Company, DTO.GlobalSearchResult>(x));
                //else
                //    globalQuery = globalQuery.Concat(query.Select(x => Mapping.Mappings.Mapper.Map<Models.Company, DTO.GlobalSearchResult>(x)));
                if (result.Data == null)
                    result.Data = await query.Select(x => Mapping.Mappings.Mapper.Map<Models.Company, DTO.GlobalSearchResult>(x)).ToListAsync();
                else
                    result.Data.AddRange(await query.Select(x => Mapping.Mappings.Mapper.Map<Models.Company, DTO.GlobalSearchResult>(x)).ToListAsync());
            }

            result.Paged.TotalCount = result.Data.Count();
            result.Data = result.Data.OrderBy(x => x.Name).Skip(model.Page * model.Take).Take(model.Take).ToList();
            result.Paged.Page = model.Page;
            result.Paged.Take = model.Take;
            result.Paged.TotalPages = (result.Paged.TotalCount / result.Paged.Take) - (result.Paged.TotalCount % result.Paged.Take == 0 ? 1 : 0);

            return result;
        }
    }
}

