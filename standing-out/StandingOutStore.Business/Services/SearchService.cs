using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using System.Data;
using StandingOut.Shared.Mapping;
using StandingOut.Data.DTO;
using StandingOut.Data.Enums;

namespace StandingOutStore.Business.Services
{
    public class SearchService : ISearchService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed;
        public SearchService(IUnitOfWork unitOfWork)
        {
            _UnitOfWork = unitOfWork;
        }
        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }
        public async Task<List<DTO.Subject>> GetAllTutorSubject()
        {
            var TutorList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(x => x.Tutor.IsDeleted == false && x.CompanyId == null, includeProperties: "Subject");
            var SubjectsList = TutorList.Select(x => x.Subject).ToList();
            return Mappings.Mapper.Map<List<Models.Subject>, List<DTO.Subject>>(SubjectsList.Distinct().OrderBy(x => x.Name).ToList());
        }

        public async Task<List<DTO.StudyLevel>> GetAllSubjectLevelBySubjectId(Guid subjectId)
        {
            var SubjectStudyLevelSetupList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(x => x.Tutor.IsDeleted == false && x.CompanyId == null && x.SubjectId == subjectId, includeProperties: "StudyLevel");
            var LevelList = SubjectStudyLevelSetupList.Select(x => x.StudyLevel).ToList();
            return Mappings.Mapper.Map<List<Models.StudyLevel>, List<DTO.StudyLevel>>(LevelList.Distinct().OrderBy(x => x.Name).ToList());
        }

        public async Task<DTO.SearchTutorModel> SearchCourse(DTO.TutorOrCourseModel model)
        {
            SearchTutorModel searchCourseModel = new SearchTutorModel();
            var data = _UnitOfWork.Repository<Models.Course>().GetQueryable(o => o.IsDeleted == false
                       && o.Completed == false && o.Cancelled == false
                       && o.Tutor.ProfileApprovalStatus == TutorApprovalStatus.Approved
                       && o.CourseType == CourseType.Public
                        , includeProperties: "Company,Tutor.Users,Tutor.TutorQualifications,Tutor.TutorAvailabilities,ClassSessions.SessionAttendees,OrderItems,Subject");

            if (model.SubjectId.HasValue)
            {
                data = data.Where(x => x.SubjectId == model.SubjectId);
            }
            if (model.StudyLevelId.HasValue)
            {
                data = data.Where(x => x.StudyLevelId == model.StudyLevelId);
            }
            if (model.SearchClassSize.MaxClassSize > 0)
            {
                data = data.Where(x => x.MaxClassSize == model.SearchClassSize.MaxClassSize);
            }
            if (model.IsUnder18 == true)
            {
                data = data.Where(x => x.IsUnder18 == true);
            }
            foreach (var item in data.ToList())
            {
               
                List<Models.ClassSession> classSession = item.ClassSessions.Where(o => o.CourseId == item.CourseId
                && o.StartDate.UtcDateTime >= DateTime.UtcNow.AddMinutes(5)
                && o.EndDate.UtcDateTime >= DateTime.UtcNow
                && o.IsDeleted == false).ToList();
                if (classSession.Count == 0)
                {
                    continue;
                }
                item.ClassSessions = classSession;
                DTO.Course CourseObj = Mappings.Mapper.Map<Models.Course, DTO.Course>(item);
                //int totalAttendees = classSession.Sum(x => x.SessionAttendees.Count);
                if (CourseObj.CourseAttendeesCount >= item.MaxClassSize)
                {
                    continue;
                }
                //item.ClassSessions = classSession;
                CourseObj.ClassSessions = Mappings.Mapper.Map<List<Models.ClassSession>, List<DTO.ClassSession>>(classSession);
                CourseObj.TutorQualification = item.Tutor.TutorQualifications.Select(x => x.Name).Distinct().ToList();
                CourseObj.CurrentCompany = Mappings.Mapper.Map<Models.Company, DTO.Company>(item.Company);
                #region Tutor Availabilities and Booked slot
                CourseObj.TutorAvailabilities = Mappings.Mapper.Map<List<Models.TutorAvailability>, List<DTO.TutorAvailability>>(item.Tutor.TutorAvailabilities.Where(x => x.IsDeleted == false).ToList());
                CourseObj.TotalBookedSlot = await GetBookedSlot(item.Tutor.Users.FirstOrDefault().Id);
                CourseObj.TotalSlotCount = await GetFutureAvailableSlot(item.Tutor.TutorId);
                #endregion
                searchCourseModel.CourseList.Add(CourseObj);
            }
            return searchCourseModel;
        }


        public async Task<DTO.SearchTutorModel> SearchTutor(DTO.TutorOrCourseModel model)
        {

            SearchTutorModel searchTutorModel = new SearchTutorModel();
            List<DTO.Tutor> tutorList = new List<DTO.Tutor>();
            //var tutor = await _UnitOfWork.Repository<Models.Tutor>().Get(o => o.IsDeleted == false,
            //    includeProperties: "Users,TutorQualifications,TutorAvailabilities,CompanyTutors.Company,SubjectStudyLevelSetups,SubjectStudyLevelSetups.Subject");

            var tutor = _UnitOfWork.Repository<Models.Tutor>().GetQueryable(o => o.IsDeleted == false
            && o.ProfileApprovalStatus == TutorApprovalStatus.Approved

            , includeProperties: "Users,TutorQualifications,TutorAvailabilities,CompanyTutors.Company");

            if (tutor != null)
            {
                foreach (var item in tutor)
                {

                    DTO.Tutor tutorObj = new DTO.Tutor();
                    tutorObj = Mappings.Mapper.Map<Models.Tutor, DTO.Tutor>(item);
                    item.SubjectStudyLevelSetups = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.IsDeleted == false && o.TutorId == item.TutorId, includeProperties: "Subject");
                    if (model.SubjectId != null && !item.SubjectStudyLevelSetups.Any(x => x.SubjectId == model.SubjectId))
                    {
                        continue;
                    }
                    if (model.StudyLevelId != null && !item.SubjectStudyLevelSetups.Any(x => x.StudyLevelId == model.StudyLevelId))
                    {
                        continue;
                    }
                    item.TutorAvailabilities = item.TutorAvailabilities.Where(x => x.IsDeleted == false).ToList();
                    /*if (item.TutorAvailabilities.Count == 0)
                    {
                        continue;
                    }*/
                    
                    #region Tutor Availabilities and Booked slot
                    tutorObj.TotalBookedSlot = await GetBookedSlot(item.Users.FirstOrDefault().Id);
                    tutorObj.TotalSlotCount = await GetFutureAvailableSlot(item.TutorId);
                    #endregion
                    #region By Company
                    var company = item.CompanyTutors.FirstOrDefault();
                    if (company != null && company.Company != null)
                    {
                        if (company.Company.ProfileApprovalStatus == TutorApprovalStatus.Approved)
                        {
                            tutorObj.CurrentCompany = Mappings.Mapper.Map<Models.Company, DTO.Company>(company.Company);
                        }
                        else
                        {
                            continue;
                        }

                    }
                    #endregion
                    #region Price Setup
                    tutorObj.TutorQualification = item.TutorQualifications.Where(x => !x.IsDeleted).Select(x => x.Name).Distinct().ToList();
                    var TutorLessonList = await _UnitOfWork.Repository<Models.ClassSession>().Get(o => o.OwnerId == item.Users.FirstOrDefault().Id && o.Complete == true && o.EndedAtDate >= DateTime.Now.AddDays(-30));
                    if (TutorLessonList.Count > 0)
                    {
                        tutorObj.TutorPriceLesson.OneToOneLessonCount = TutorLessonList.Count(x => x.MaxPersons == 1 && x.Complete == true);
                        tutorObj.TutorPriceLesson.GroupLessonCount = TutorLessonList.Count(x => x.MaxPersons > 1 && x.Complete == true);
                    }
                    if (item.SubjectStudyLevelSetups.Count > 0)
                    {
                        tutorObj.TutorPriceLesson.OneToOneMinPrice = item.SubjectStudyLevelSetups.Min(x => x.PricePerPerson);
                        tutorObj.TutorPriceLesson.OneToOneMaxPrice = item.SubjectStudyLevelSetups.Max(x => x.PricePerPerson);
                        tutorObj.TutorPriceLesson.GroupMinPrice = Convert.ToDecimal(item.SubjectStudyLevelSetups.Min(x => x.GroupPricePerPerson));
                        tutorObj.TutorPriceLesson.GroupMaxPrice = Convert.ToDecimal(item.SubjectStudyLevelSetups.Max(x => x.GroupPricePerPerson));
                        tutorObj.TutorSubjectNameList = item.SubjectStudyLevelSetups.Where(x => !x.IsDeleted).Select(x => x.Subject.Name).Distinct().ToList();
                       
                        if (model.SearchPricePerPerson.MinPrice != -1)
                        {
                            if (model.SearchPricePerPerson.IsOneToOne)
                            {
                                var minPrice = item.SubjectStudyLevelSetups.Min(x => x.PricePerPerson); //1
                                var maxPrice = item.SubjectStudyLevelSetups.Max(x => x.PricePerPerson); //10
                                if (!(minPrice <= model.SearchPricePerPerson.MinPrice && maxPrice >= model.SearchPricePerPerson.MaxPrice))
                                {
                                    continue;
                                }
                            }
                            else
                            {
                                var minPrice = item.SubjectStudyLevelSetups.Min(x => x.GroupPricePerPerson); //1
                                var maxPrice = item.SubjectStudyLevelSetups.Max(x => x.GroupPricePerPerson); //10
                                if (!(minPrice <= model.SearchPricePerPerson.MaxPrice && maxPrice >= model.SearchPricePerPerson.MinPrice))
                                {
                                    continue;
                                }
                            }
                        }
                    }
                    #endregion
                    #region Course
                    //var query = _UnitOfWork.Repository<Models.Course>().GetQueryable(o => o.IsDeleted == false && o.TutorId == item.TutorId, includeProperties: "ClassSessions");
                    //var CourseList = query.ToList();
                    //if (CourseList.Count > 0)
                    //{
                    //    var config = new AutoMapper.MapperConfiguration(cfg =>
                    //    {
                    //        cfg.CreateMap<Models.Course, DTO.Course>()
                    //        .ForMember(o => o.ClassSessions, src => src.MapFrom(u => u.ClassSessions.Where(o => o.IsDeleted == false).OrderBy(x => x.StartDate).ToList()));
                    //    });
                    //    tutorObj.TutorCourseList = Mappings.Mapper.Map<List<Models.Course>, List<DTO.Course>>(CourseList);

                    //}
                    #endregion
                    tutorList.Add(tutorObj);
                }

                if (model.SortType.Contains("Cheapest"))
                {
                    tutorList = tutorList.OrderBy(x => x.TutorPriceLesson.OneToOneMinPrice).ThenBy(x => x.TutorPriceLesson.GroupMinPrice).ToList();
                }
                if (model.SortType.Contains("Popular"))
                {
                    tutorList = tutorList.OrderByDescending(x => x.TutorPriceLesson.OneToOneLessonCount).ThenByDescending(x => x.TutorPriceLesson.GroupLessonCount).ToList();
                }

            }
            searchTutorModel.TutorList = tutorList;
            return searchTutorModel;
        }
        public async Task<int> GetFutureAvailableSlot(Guid tutorId)
        {
            var tutorAvailability = await _UnitOfWork.Repository<Models.TutorAvailability>().Get(o => o.TutorId == tutorId && o.IsDeleted == false
                       && o.StartTime.AddDays(Convert.ToInt32(o.NoOfWeek * 7)).ToUniversalTime() >= DateTime.Now.ToUniversalTime());
            int totalSlotCount = 0;
            foreach (var av in tutorAvailability)
            {
                totalSlotCount = totalSlotCount + Convert.ToInt32((av.NoOfWeek == 0 ? 1 : av.NoOfWeek));
                var nextDate = DateTime.Now;
                double d = (double)((nextDate - av.StartTime).Days) / 7.0;
                int noOfDays = Convert.ToInt32(Math.Ceiling(d)); //less then 0 mean previus date return minus value 
                if (Convert.ToInt32(av.DayOfWeek) != -1 && noOfDays > 0)
                {
                    totalSlotCount = totalSlotCount - noOfDays;
                }
            }
            return totalSlotCount;
        }
        public async Task<int> GetBookedSlot(string OwnerId)
        {
            var classSessions = await _UnitOfWork.Repository<Models.ClassSession>().Get(x => x.OwnerId == OwnerId && x.StartDate.ToUniversalTime() >= DateTime.UtcNow && x.IsDeleted == false);
            return classSessions.Count();
        }
    }
}
