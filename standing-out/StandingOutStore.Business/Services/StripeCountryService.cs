using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;

namespace StandingOutStore.Business.Services
{
    public class StripeCountryService : IStripeCountryService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
		private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IUserService _UserService;
        private bool _Disposed;

        public StripeCountryService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager,IUserService userService)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
			_AppSettings = appSettings.Value;
            _UserManager = userManager;
            _UserService = userService;
        }

		public StripeCountryService(IUnitOfWork unitOfWork, AppSettings appSettings)
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

        public async Task<List<Models.StripeCountry>> Get()
        {
            return await _UnitOfWork.Repository<Models.StripeCountry>().Get();
        }
        public async Task<Models.StripeCountry> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.StripeCountry>().GetSingle(x=>x.StripeCountryId==id);
        }

        public async Task<Models.StripeCountry> GetByCode(string code)
        {
            return await _UnitOfWork.Repository<Models.StripeCountry>().GetSingle(x => x.CurrencyCode == code);
        }
       
    }
}

