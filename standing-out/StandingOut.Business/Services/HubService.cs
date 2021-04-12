using StandingOut.Business.Services.Interfaces;
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

namespace StandingOut.Business.Services
{
    public class HubService : IHubService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private readonly AppSettings _AppSettings;
        private bool _Disposed;

        public HubService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext
            , IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public HubService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<DTO.Hub>> Get()
        {
            return await _UnitOfWork.Repository<Models.Hub>().GetQueryable()
                .Select(x => new DTO.Hub
                {
                    HubId = x.HubId,
                    SubDomain = x.SubDomain,
                    Population = x.ClassSessions.Where(y => (y.Started && !y.Ended) || (y.StartDate > DateTime.Now && y.EndDate < DateTime.Now) && !y.IsDeleted)
                        .Sum(y => y.SessionAttendees.Where(z => !z.IsDeleted).Count())
                }).ToListAsync();
        }

        public async Task<DTO.Hub> GetHubToUse()
        {
            var hubs = await Get();
            return hubs.OrderBy(x => x.Population).FirstOrDefault();
        }

        public string GetDomain(string subDomain)
        {
            if (_Enviroment.IsDevelopment())
                return _AppSettings.HubBaseUrl;
            else
                return $"https://{subDomain}.{_AppSettings.HubBaseUrl}";
        }
    }
}

