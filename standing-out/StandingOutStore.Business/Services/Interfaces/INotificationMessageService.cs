using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Identity;

namespace StandingOutStore.Business.Services.Interfaces
{
   public interface INotificationMessageService: IDisposable
    {
        Task<DTO.NotificationModel> GetNotificationMessages(Models.User user, string PageName, string UserType);
    }
}
