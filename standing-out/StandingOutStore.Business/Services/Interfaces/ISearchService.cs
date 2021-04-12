using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Http;
using StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ISearchService : IDisposable
    {
        Task<List<DTO.Subject>> GetAllTutorSubject();
        Task<List<DTO.StudyLevel>> GetAllSubjectLevelBySubjectId(Guid subjectId);
        Task<DTO.SearchTutorModel> SearchTutor(DTO.TutorOrCourseModel model);
        Task<DTO.SearchTutorModel> SearchCourse(DTO.TutorOrCourseModel model);
    }
}
