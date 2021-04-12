//using StandingOut.Business.Services.Interfaces;
//using StandingOut.Data;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using Models = StandingOut.Data.Models;
//using DTO = StandingOut.Data.DTO;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Hosting;
//using Microsoft.Extensions.Options;
//using Mapping = StandingOut.Shared.Mapping;

//namespace StandingOut.Business.Services
//{
//    public class FamilyLinkService : IFamilyLinkService
//    {
//        private readonly IUnitOfWork _UnitOfWork;
//        private readonly UserManager<Models.User> _UserManager;
//        private readonly IHostingEnvironment _Environment;
//        private bool _Disposed;
//        private readonly AppSettings _AppSettings;

//        public FamilyLinkService(IUnitOfWork unitOfWork, UserManager<Models.User> userManager, IHostingEnvironment environment, IOptions<AppSettings> appSettings)
//        {
//            _UnitOfWork = unitOfWork;
//            _UserManager = userManager;
//            _Environment = environment;
//            _AppSettings = appSettings.Value;
//        }

//        public void Dispose()
//        {
//            if (!_Disposed)
//            {
//                GC.Collect();
//            }
//        }

//        public async Task<List<DTO.FamilyLink>> Get(string userEmail)
//        {
//            var user = await _UserManager.FindByEmailAsync(userEmail);
//            if (!user.IsParent)
//                throw new Exception("User not authorised for this link");
//            return await _UnitOfWork.Repository<Models.FamilyLink>().GetQueryable(x => x.ParentUserId == user.Id, includeProperties: "ChildUser")
//                .Select(x => Mapping.Mappings.Mapper.Map<Models.FamilyLink, DTO.FamilyLink>(x))
//                .OrderByDescending(x => x.Linked).ThenByDescending(x => x.LastRequestAt)
//                .ToListAsync();
//        }

//        public async Task<Models.FamilyLink> GetSingle(Guid requestId, string email)
//        {
//            return await _UnitOfWork.Repository<Models.FamilyLink>().GetSingle(x => x.RequestId == requestId && x.ChildEmail == email);
//        }

//        public async Task UpdateWithChild(Models.FamilyLink familyLink, Models.User childUser)
//        {
//            familyLink.ChildUserId = childUser.Id;
//            familyLink.RequestId = null;
//            familyLink.Linked = true;
//            await _UnitOfWork.Repository<Models.FamilyLink>().Update(familyLink);

//            // Send confirming email
//            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
//            var parentUser = await _UserManager.FindByIdAsync(familyLink.ParentUserId);
//            try
//            {
//                await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
//                System.IO.Path.Combine(_Environment.ContentRootPath, "Templates\\FamilyInvitationConfirmed.html"),
//                new Dictionary<string, string>()
//                {
//                    { "{{imageURL}}",  _AppSettings.MainSiteUrl + "/images/2utoringlogo.png" },
//                    { "{{firstName}}", parentUser.FirstName },
//                    { "{{lastName}}", parentUser.LastName },
//                    { "{{childFirstName}}", childUser.FirstName },
//                    { "{{childLastName}}", childUser.LastName },
//                }, parentUser.Email, settings.SendGridFromEmail, $"Family Invitation Confirmed");
//            }
//            catch
//            {
//                // Non-essetial to the process so allow to be not delivered
//            }
//        }

//        public async Task<DTO.FamilyLink> Create(string userEmail, string email)
//        {
//            email = email.ToLower().Trim();
//            var user = await _UserManager.FindByEmailAsync(userEmail);
//            if (!user.IsParent)
//                throw new Exception("User not authorised for this link");
//            if (email == userEmail.ToLower().Trim())
//                throw new Exception("Family link cannot be to self");
//            var familyLink = new Models.FamilyLink()
//            {
//                ParentUserId = user.Id,
//                ChildEmail = email,
//                RequestId = Guid.NewGuid()
//            };
//            if (await FamilyLinkExists(user.Id, email))
//                throw new Exception("Family link already exists");
//            else
//            {
//                await _UnitOfWork.Repository<Models.FamilyLink>().Insert(familyLink);
//                familyLink = await _UnitOfWork.Repository<Models.FamilyLink>().GetSingle(x => x.ParentUserId == user.Id && x.ChildEmail == email);
//                await SendEmail(user, familyLink.ChildEmail, familyLink.RequestId.Value);
//                familyLink.LastRequestAt = DateTime.Now;
//                await _UnitOfWork.Repository<Models.FamilyLink>().Update(familyLink);
//                return Mapping.Mappings.Mapper.Map<Models.FamilyLink, DTO.FamilyLink>(familyLink);
//            }
//        }

//        public async Task<DTO.FamilyLink> ResendEmail(string userEmail, Guid familyLinkId)
//        {
//            var user = await _UserManager.FindByEmailAsync(userEmail);
//            if (!user.IsParent)
//                throw new Exception("User not authorised for this link");
//            var familyLink = await _UnitOfWork.Repository<Models.FamilyLink>().GetSingle(x => x.FamilyLinkId == familyLinkId);
//            if (user.Id != familyLink.ParentUserId)
//                throw new Exception("User not authorised for this link");
//            else
//            {
//                await SendEmail(user, familyLink.ChildEmail, familyLink.RequestId.Value);
//                familyLink.LastRequestAt = DateTime.Now;
//                await _UnitOfWork.Repository<Models.FamilyLink>().Update(familyLink);
//                return Mapping.Mappings.Mapper.Map<Models.FamilyLink, DTO.FamilyLink>(familyLink);
//            }
//        }

//        public async Task Delete(string userEmail, Guid familyLinkId)
//        {
//            var user = await _UserManager.FindByEmailAsync(userEmail);
//            if (!user.IsParent)
//                throw new Exception("User not authorised for this link");
//            var familyLink = await _UnitOfWork.Repository<Models.FamilyLink>().GetSingle(x => x.FamilyLinkId == familyLinkId);
//            if (user.Id != familyLink.ParentUserId)
//                throw new Exception("User not authorised for this link");
//            else
//            {
//                familyLink.IsDeleted = true;
//                await _UnitOfWork.Repository<Models.FamilyLink>().Update(familyLink);
//            }
//        }

//        private async Task SendEmail(Models.User user, string toEmail, Guid requestId)
//        {
//            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

//            await Utilities.EmailUtilities.SendTemplateEmail(settings.SendGridApi,
//                System.IO.Path.Combine(_Environment.ContentRootPath, "Templates\\FamilyInvitation.html"),
//                new Dictionary<string, string>()
//                {
//                    { "{{imageURL}}",  _AppSettings.MainSiteUrl + "/images/2utoringlogo.png" },
//                    { "{{firstName}}", user.FirstName },
//                    { "{{lastName}}", user.LastName },
//                    { "{{requestId}}", requestId.ToString() }
//                }, toEmail, settings.SendGridFromEmail, $"Family Invitation - " + user.FullName);
//            // Note - Allowing this to error so can be seen on the front if there is an issue
//        }

//        private async Task<bool> FamilyLinkExists(string userId, string email)
//        {
//            if ((await _UnitOfWork.Repository<Models.FamilyLink>().GetSingle(x => x.ParentUserId == userId && x.ChildEmail == email)) != null)
//                return true;
//            else
//                return false;
//        }
//    }
//}

