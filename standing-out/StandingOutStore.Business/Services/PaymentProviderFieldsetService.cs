using System;
using System.Collections.Generic;
using System.Text;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using StandingOut.Data.Models;
using StandingOut.Data.DTO;
using StandingOut.Data.Enums;

namespace StandingOutStore.Business.Services
{
    public class PaymentProviderFieldsetService : IPaymentProviderFieldsetService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private readonly AppSettings _AppSettings;
        private bool _Disposed;

        public PaymentProviderFieldsetService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<Models.PaymentProviderFieldSet> GetById(Guid paymentProviderFieldSetId)
        {
            return await _UnitOfWork.Repository<Models.PaymentProviderFieldSet>().GetSingle(o => o.PaymentProviderFieldSetId == paymentProviderFieldSetId);
        }
    }
}
