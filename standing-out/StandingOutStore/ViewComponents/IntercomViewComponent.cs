using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Razor.TagHelpers;
using StandingOutStore.Business.Services.Interfaces;

namespace StandingOutStore.ViewComponents
{
    public class IntercomViewComponent : ViewComponent
    {
        private readonly IUserService _UserService;
        private readonly string _IntercomAppId = "qoskikpv";
        private readonly ICompanyService _CompanyService;


        public IntercomViewComponent(IUserService userService, ICompanyService companyService)
        {
            _UserService = userService;
            _CompanyService = companyService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            ViewData["IntercomAppId"] = _IntercomAppId;
            if (User.Identity.IsAuthenticated)
            {
                var localUser = await _UserService.GetByEmail(User.Identity.Name);
                var user = Mappings.Mapper.Map<Models.User, DTO.Intercom.IntercomUser>(localUser);
                ViewData["IntercomName"] = user.Name;
                ViewData["IntercomEmail"] = user.Email;
                ViewData["IntercomCreatedAt"] = user.CreatedAt;
                ViewData["UserId"] = localUser.Id;
                var company = await _CompanyService.GetByAdminUser(localUser);
                ViewData["isCompany"] = company != null && company.AdminUserId == localUser.Id;
                ViewData["isTutor"] = localUser.TutorId.HasValue && localUser.Tutor.IsDeleted == false;
                ViewData["isParent"] = localUser.IsParent && !(localUser.TutorId.HasValue && localUser.Tutor.IsDeleted == false) && !(company != null && company.AdminUserId == localUser.Id);
                ViewData["isStudent"] = !localUser.IsParent && !(localUser.TutorId.HasValue && localUser.Tutor.IsDeleted == false) && !(company != null && company.AdminUserId == localUser.Id);
                return View();
            }
            else
                return View();
        }
    }
}
