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
    public interface ICompanyService : IDisposable
    {
        Task<List<Models.Company>> Get();
        Task<Models.Company> GetById(Guid id, string includeProperties = "");
        Task<Models.Company> GetByUrlSlug(string urlSlug);

        Task<Models.Company> UpdateInitialRegisterStep(Guid companyId, int step);
        Task<CompanyRegisterPayment> SavePayment(CompanyRegisterPayment model);
        Task<Models.Company> SaveBasicInfo(CompanyRegisterBasicInfo model);
        Task<Models.Company> GetByAdminUser(Models.User adminUser, string includeProperties = "");

        Task<Models.Company> Create(DTO.CreateCompany model);
        Task<Models.Company> Create(Models.Company model);
        Task<Models.Company> Update(DTO.EditCompany model);
        Task<Models.Company> Update(Models.Company model);
        Task Delete(Guid id);

        Task<DTO.CompanyProfile> GetProfileById(Guid id);
        Task<bool> IsUserCompanyAdmin(Models.User user);
        Task<bool> IsCompanyTutor(Models.User user);
        Task<bool> IsAdminUserForCompany(Models.User user, Guid CompanyId);
        Task SaveProfileOne(CompanyRegisterProfileOne model);
        Task SaveProfileThree(CompanyRegisterProfileThree model);
        Task<List<CompanyRegisterProfileTeam>> GetTeamData(Guid companyId);
        Task AddCompanyMember(Guid companyId, CompanyMember companyMember);
        Task RemoveCompanyMember(Guid companyId, Guid companyMemberId);
        Task ProfileUpload(Guid companyId, IFormFile file);

        Task<Models.Company> SetCompanyUrlSlug(Guid id, Company company = null);
        Task Cancel(Guid companyId, DTO.CompanyCancel model);
        Task<CompanyRegisterPayment> UpdatePayment(CompanyRegisterPayment model);
        Task<Models.Company> CheckCompanyStripe(Guid companyId);
        Task<Models.Subscription> GetActiveSubscription(Guid companyId);
        Task<DTO.PagedList<DTO.PagedTutorBankDetails>> PagedBankDetails(DTO.SearchModel model, Guid? companyId);
        Task<DTO.CompanyProfileViewModel> GetAboutCompany(Guid companyId);
        Task<bool> UpdateIdVerificationStauts(Guid tutorId, bool status);
    }
}

