using StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using StandingOut.Data.DTO;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace StandingOutStore.ViewComponents
{
    public class NotificationMessageViewComponent : ViewComponent
    {
        private readonly IUserService _UserService;
        private readonly UserManager<Models.User> _UserManager;
        private readonly ICompanyService _CompanyService;
        private readonly INotificationMessageService _NotificationMessageService;
        public NotificationMessageViewComponent(IUserService userService, UserManager<Models.User> userManager, ICompanyService companyService,INotificationMessageService notificationMessageService)
        {
            _UserService = userService;
            _UserManager = userManager;
            _CompanyService = companyService;
            _NotificationMessageService = notificationMessageService;
        }
        public async Task<IViewComponentResult> InvokeAsync(string pageName)
        {
            string UserType = "";
           NotificationModel model = new NotificationModel();
            if (User.Identity.IsAuthenticated && !string.IsNullOrEmpty(pageName))
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                #region Find User Type
                if (await _UserManager.IsInRoleAsync(user, "Admin"))
                {
                    UserType = "Company";
                }
                else if (await _UserManager.IsInRoleAsync(user, "Tutor"))
                {
                    if (await _CompanyService.IsCompanyTutor(user))
                    {
                        UserType = "CompanyTutor";
                    }
                    else
                    {
                        UserType = "Tutor";
                    }
                }
                else if (user.IsParent)
                {
                    //UserType = "Parent";
                    UserType = "Student";
                }
                else
                {
                    UserType = "Student";
                }
                #endregion

                if (!string.IsNullOrEmpty(UserType))
                {
                    model = await _NotificationMessageService.GetNotificationMessages(user, pageName, UserType);
                }

            }
            else
            {
                model.MessageList = new List<NotificationMessage>();
                model.UserAlertModel = new UserAlertViewModel();
            }
           
            return View(model);
        }
    }
}
