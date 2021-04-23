using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using Microsoft.AspNetCore.Http;
using StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface ICourseService : IDisposable
    {

        Task<List<Models.Course>> GetCompanyCoureses(Guid companyId);
        Task<Models.Course> GetCouresClassSession(Guid courseId);
        Task<Models.Course> GetById(Guid courseId);
        Task<Models.Course> GetOrderedCourseById(Guid courseId);
        Task<DTO.PagedList<DTO.Course>> GetPaged(DTO.SearchModel model, Guid id, string role);
        Task<Models.Course> Create(Models.Course model);
        //Task<Models.Course> CreateCourse(Models.Course model);
        //Task<List<Models.ClassSession>> CreateCourseLesson(List<Models.ClassSession> model);
        Task<Models.Course> UpdateCourse(Models.Course model);
        //Task<Models.Course> UpdateCourseData(Models.Course model);
        
        Task DeleteCourse(Guid courseId);
        Task DeleteCourseClassSession(Guid courseId);

        Task<DTO.GDrive> checkAndCreateGoogleDriverFolders(DTO.GDrive model);
        //Task<DTO.LessonCard> GetCard(Guid courseId);
        Task<DTO.CourseCardSet> GetCardSet(Guid courseId);
        Task<List<Models.ClassSession>> GetFutureLessons(Guid courseId);
        Task<Models.Course> GetPurchaseCouresData(Guid courseId);
        Task<DTO.CourseProfile> GetCouresInfo(Guid courseId);
        Task<bool> CourseNotification(Guid courseId);
        Task<bool> GetExistingClassSession(List<DTO.ClassSession> classSessionsList);
    }
}
