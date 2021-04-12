using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using StandingOut.Data.DTO.CompanyRegister;
using StandingOut.Data.Models;
using Microsoft.AspNetCore.Http;


namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IWebsiteContactService : IDisposable
    {
        Task<bool> Create(Models.WebsiteContact model);
    }
}
