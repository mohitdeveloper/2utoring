using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace StandingOutStore.Business.Services
{
    public class PromoCodeService : IPromoCodeService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
		private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private bool _Disposed;

        public PromoCodeService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
			_AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

		public PromoCodeService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<Models.PromoCode> GetByName(string name)
        {
            return await _UnitOfWork.Repository<Models.PromoCode>().GetQueryable(x => x.Name.ToLower().Trim() == name.ToLower().Trim()).FirstOrDefaultAsync();
        }

        public async Task<int> GetUses(Guid promoCodeId)
        {
            return await _UnitOfWork.Repository<Models.SessionAttendee>().GetCount(x => x.PromoCodeId == promoCodeId);
        }

        public async Task<List<Models.PromoCode>>Create(List<Models.PromoCode> codes)
        {
            await _UnitOfWork.Repository<Models.PromoCode>().Insert(codes);
            return codes;
        }
    }
}

