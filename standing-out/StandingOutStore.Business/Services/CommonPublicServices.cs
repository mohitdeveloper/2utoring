using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using StandingOut.Data.DTO.CompanyRegister;
using StandingOut.Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace StandingOutStore.Business.Services
{
    public class CommonPublicServices : ICommonPublicService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly AppSettings _AppSettings;
        private readonly UserManager<Models.User> _UserManager;
        public CommonPublicServices(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager, IErrorLogService errorLogService)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
        }

        public async Task<bool> SendMessage(DTO.EmailModel model)
        {
            var user = await _UserManager.FindByEmailAsync(model.ReceiverEmail);
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();
            string senderFullName = char.ToUpper(model.FirstName[0]) + model.FirstName.Substring(1) + " " + char.ToUpper(model.LastName[0]) + model.LastName.Substring(1);
            if (user != null && user.TutorId.HasValue)
            {
                string tutorName = user.Title + " " + (char.ToUpper(user.FirstName[0]) + user.FirstName.Substring(1) + " " + char.ToUpper(user.LastName[0]) + user.LastName.Substring(1));
                var companyTutor = await _UnitOfWork.Repository<Models.CompanyTutor>().GetSingle(o => o.TutorId == user.TutorId, includeProperties: "Company");
                if (companyTutor != null)
                {
                    #region Send to company tutor and company
                    var company = companyTutor.Company;
                    string companyName = char.ToUpper(company.Name[0]) + company.Name.Substring(1);
                    try
                    {
                        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                            System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\VisitorMessage.html"),
                            new Dictionary<string, string>()
                            {
                                { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                                { "{{receiverFullName}}", tutorName},
                                { "{{senderFullName}}", senderFullName },
                                { "{{senderEmail}}", model.Email },
                                { "{{message}}", model.Message},
                            }, user.Email, settings.SendGridFromEmail, senderFullName + $" has sent you a message");

                        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                            System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\VisitorMessage.html"),
                            new Dictionary<string, string>()
                            {
                                { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                                { "{{receiverFullName}}", companyName},
                                { "{{senderFullName}}", senderFullName },
                                { "{{senderEmail}}", model.Email },
                                { "{{message}}", model.Message},
                            }, company.EmailAddress, settings.SendGridFromEmail, senderFullName + $" has sent you a message");
                    }
                    catch { }
                    #endregion
                }
                else
                {
                    #region Send to Tutor
                    try
                    {
                        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                             System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\VisitorMessage.html"),
                             new Dictionary<string, string>()
                             {
                                { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                                { "{{receiverFullName}}", tutorName},
                                { "{{senderFullName}}", senderFullName },
                                { "{{senderEmail}}", model.Email },
                                { "{{message}}", model.Message},
                             }, user.Email, settings.SendGridFromEmail, senderFullName + $" has sent you a message");
                    }
                    catch { }
                    #endregion
                }
            }
            else if (user != null)
            {
                var company = await _UnitOfWork.Repository<Models.Company>().GetQueryable(x => x.AdminUserId == user.Id).AsNoTracking().FirstOrDefaultAsync();
                if (company != null)
                {
                    #region Send To Company
                    string companyName = char.ToUpper(company.Name[0]) + company.Name.Substring(1);
                    try
                    {
                        await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
                             System.IO.Path.Combine(_Enviroment.ContentRootPath, "Templates\\VisitorMessage.html"),
                             new Dictionary<string, string>()
                             {
                                { "{{siteUrl}}", _AppSettings.MainSiteUrl },
                                { "{{receiverFullName}}", companyName},
                                { "{{senderFullName}}", senderFullName },
                                { "{{senderEmail}}", model.Email },
                                { "{{message}}", model.Message},
                             }, company.EmailAddress, settings.SendGridFromEmail, senderFullName + $" has sent you a message");
                    }
                    catch { }
                    #endregion
                }
                else
                {
                    return false;
                }
            }
            return true;
        }

        public async Task<bool> UpdateCourse(DTO.UpdateModel model)
        {
            try
            {
                var courseModel = await _UnitOfWork.Repository<Models.Course>().GetSingle(x => x.CourseId == model.Id);
                courseModel.StartDate = model.StartDate;
                courseModel.EndDate = model.EndDate;
                await _UnitOfWork.Repository<Models.Course>().Update(courseModel);
                return true;
            }
            catch (Exception)
            {

                return false;
            }

        }
        public async Task<bool> UpdateClassSession(DTO.UpdateModel model)
        {
            try
            {
                var LessionModel = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(x => x.ClassSessionId == model.Id);
                LessionModel.StartDate = model.StartDate;
                LessionModel.EndDate = model.EndDate;
                await _UnitOfWork.Repository<Models.ClassSession>().Update(LessionModel);
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public async Task<bool> UpdateStripPlan(DTO.UpdateStripPlanModel model)
        {
            try
            {
                var StripModel = await _UnitOfWork.Repository<Models.StripePlan>().GetSingle(x => x.StripePlanId == model.StripePlanId);
                if (StripModel != null)
                {
                    StripModel.StripeProductId = model.StripeProductId;
                    StripModel.ModifiedDate = DateTime.Now;
                    await _UnitOfWork.Repository<Models.StripePlan>().Update(StripModel);
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception)
            {

                return false;
            }
        }


        public async Task<List<Models.ErrorLog>> GetErrorLog()
        {
            List<Models.ErrorLog> logData = await _UnitOfWork.Repository<Models.ErrorLog>().Get();
            //logData = logData.OrderBy(x => x.LogDate).Take(50).ToList();
            return logData;
        }
    }
}
