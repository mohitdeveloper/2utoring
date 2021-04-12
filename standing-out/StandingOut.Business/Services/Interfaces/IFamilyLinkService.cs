//using System;
//using System.Collections.Generic;
//using Models = StandingOut.Data.Models;
//using DTO = StandingOut.Data.DTO;
//using System.Threading.Tasks;

//namespace StandingOut.Business.Services.Interfaces
//{
//    public interface IFamilyLinkService : IDisposable
//    {
//        Task<List<DTO.FamilyLink>> Get(string userEmail);
//        Task<Models.FamilyLink> GetSingle(Guid requestId, string email);
//        Task UpdateWithChild(Models.FamilyLink familyLink, Models.User childUser);
//        Task<DTO.FamilyLink> Create(string userEmail, string email);
//        Task<DTO.FamilyLink> ResendEmail(string userEmail, Guid familyLinkId);
//        Task Delete(string userEmail, Guid familyLinkId);
//    }
//}

