using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using StandingOut.Data.Models;
using StandingOut.Shared.Mapping;
using Microsoft.AspNetCore.Identity;

namespace StandingOutStore.Business.Services
{
    public class CompanyTutorService : ICompanyTutorService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed;
        private readonly UserManager<Models.User> _UserManager;
        public CompanyTutorService(IUnitOfWork unitOfWork, UserManager<Models.User> userManager)
        {
            _UnitOfWork = unitOfWork;
            _UserManager = userManager;
        }
        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<Models.CompanyTutor> Create(Models.CompanyTutor model)
        {
            await _UnitOfWork.Repository<Models.CompanyTutor>().Insert(model);
            return model;

        }

        public async Task<List<Models.Tutor>> GetTutorByCompany(Guid companyId)
        {
            var model = await _UnitOfWork.Repository<Models.CompanyTutor>().Get(x => x.CompanyId == companyId, includeProperties: "Tutor.Users");
            return model.Select(x => x.Tutor).ToList();

        }
        public async Task<Models.CompanyTutor> GetCompanyByTutor(Guid tutorId)
        {
            return await _UnitOfWork.Repository<Models.CompanyTutor>().GetSingle(x => x.TutorId == tutorId, includeProperties: "Tutor.Users");
        }

        public async Task<CompanyTutor> GetTutorCompany(Guid tutorId)
        {

            var returnCT = await _UnitOfWork.Repository<Models.CompanyTutor>()
                .GetSingle(x => x.ActualStartDate < DateTime.UtcNow && (x.ActualEndDate == null || x.ActualEndDate > DateTime.UtcNow)
                && x.TutorId == tutorId, includeProperties: "Company, Tutor");
            if (returnCT == null) return null;

            return returnCT;
        }

        public async Task<List<Models.Tutor>> GetCompanyTutorBySubject(Guid companyId, Guid subjectId, Guid levelId)
        {
            var model = await _UnitOfWork.Repository<Models.CompanyTutor>().Get(x => x.CompanyId == companyId && x.Tutor.SubjectStudyLevelSetups.Any(y => y.SubjectId == subjectId && y.StudyLevelId == levelId && y.IsDeleted == false), includeProperties: "Tutor.Users");
            return model.Select(x => x.Tutor).ToList();
        }

        public async Task<List<Models.Tutor>> GetTutorsByCompanySubjectAndLevel(Guid companyId, Guid subjectId, Guid levelId)
        {
            var tutorData = await _UnitOfWork.Repository<Models.CompanyTutor>().Get(x => x.CompanyId == companyId && x.IsDeleted == false && x.Tutor.SubjectStudyLevelSetups.Any(y => y.SubjectId == subjectId && y.StudyLevelId == levelId && y.IsDeleted == false), includeProperties: "Tutor.Users");
            return tutorData.Select(x => x.Tutor).ToList();
        }

        public int GetBookedSlotCount(List<Models.ClassSession> bookedSlot, DateTime starttime, DateTime endtime)
        {
            int bookedSlotCount = 0;
            foreach (var av in bookedSlot)
            {
                DateTime y1 = new DateTime(av.StartDate.Year,av.StartDate.Month,av.StartDate.Day, av.StartDate.Hour, av.StartDate.Minute, 0);
                DateTime y2 = new DateTime(y1.Year, y1.Month, y1.Day, av.EndDate.Hour, av.EndDate.Minute, 0);
                DateTime x1 = new DateTime(y1.Year, y1.Month, y1.Day, starttime.Hour, starttime.Minute, 0);
                DateTime x2 = new DateTime(y1.Year, y1.Month, y1.Day, endtime.Hour, endtime.Minute, 0);
                if (x1 < y2 && x2 > y1)
                {
                    bookedSlotCount++;
                }
            }
           
            return bookedSlotCount;
        }
        public async Task<List<DTO.TutorDDL>> GetTutorByAvailability(Guid companyId, DTO.CTutorAvailability model)
        {
            List<DTO.TutorDDL> tutors = new List<DTO.TutorDDL>();
            var slot = DateTime.ParseExact(model.SlotTime, "H:mm", null, System.Globalization.DateTimeStyles.None);
            var nextDate = slot;
           if(Convert.ToInt32(slot.DayOfWeek)!=model.DayOfWeek)
            {
                int days = Convert.ToInt32(slot.DayOfWeek) - model.DayOfWeek;
                nextDate = nextDate.AddDays(Math.Abs(days));
                
            }
          
            var beforTime = slot.AddHours(-1).ToUniversalTime();
            var afterTime = slot.AddHours(1).AddDays(model.NoOfWeek * 7).ToUniversalTime();
            var starttime = slot.AddHours(-1);
            var endtime = slot.AddHours(1);
            var tutorData = await _UnitOfWork.Repository<Models.CompanyTutor>().Get(x => x.CompanyId == companyId && x.IsDeleted == false, includeProperties: "Tutor.Users,Tutor.TutorAvailabilities");

            foreach (var item in tutorData)
            {
                var user = item.Tutor.Users.FirstOrDefault();
                var TutorAvailabilityList = item.Tutor.TutorAvailabilities
                    .Where(x => x.TutorId == item.TutorId)
                    .Where(y => (int)y.StartTime.DayOfWeek == model.DayOfWeek)
                    .Where(z => z.StartTime.AddDays(Convert.ToInt32(z.NoOfWeek) * 7).ToUniversalTime()>= slot.ToUniversalTime())
                    .Where(l => l.IsDeleted == false && l.SlotType!=StandingOut.Data.Enums.AvailabilityType.Deleted)
                    .ToList();
                if (TutorAvailabilityList.Count > 0)
                {
                    var bookedSlot = await _UnitOfWork.Repository<Models.ClassSession>().Get(o => o.OwnerId == user.Id 
                    && (int)o.StartDate.DayOfWeek == model.DayOfWeek 
                    && o.StartDate.ToUniversalTime() >= slot.ToUniversalTime()
                    && o.IsDeleted == false);
                    bool check = false;
                    int availabalSlot = 0;
                    int bookedSlotCount = GetBookedSlotCount(bookedSlot, starttime, endtime);
                    foreach (var av in TutorAvailabilityList)
                    {
                        DateTime y1 = av.StartTime;
                        DateTime y2 = new DateTime(y1.Year, y1.Month, y1.Day, av.EndTime.Hour, av.EndTime.Minute, 0);
                        DateTime x1 = new DateTime(y1.Year, y1.Month, y1.Day, starttime.Hour, starttime.Minute, 0);
                        DateTime x2 = new DateTime(y1.Year, y1.Month, y1.Day, endtime.Hour, endtime.Minute, 0);
                        if (x1 <= y2 && x2 >= y1)
                        {
                            int pastWeek = 0;
                            if (av.StartTime < nextDate)
                            {
                                pastWeek = (av.StartTime - nextDate).Days;
                                pastWeek = Convert.ToInt32(Math.Floor( Convert.ToDecimal(pastWeek) / 7));
                            }
                            int totalSlot = Convert.ToInt32(av.NoOfWeek) == 0 ? 1 : Convert.ToInt32(av.NoOfWeek);
                            availabalSlot=availabalSlot+(totalSlot+pastWeek);
                        }
                    }
                    if (availabalSlot>0 && Math.Abs(bookedSlotCount- availabalSlot)>= model.NoOfWeek)
                    {
                        var SubjectLevel = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().GetSingle(x => x.TutorId == item.TutorId && x.SubjectId == model.SubjectId && x.StudyLevelId == model.StudyLevelId && x.IsDeleted == false);
                        if (SubjectLevel != null)
                        {
                            tutors.Add(new DTO.TutorDDL { TutorId = item.TutorId, Name = (user.Title + " " + user.FirstName + " " + user.LastName) });
                        }
                    }
                }
            }
            return tutors;
        }

        public async Task<DTO.Tutor> GetTutorDetail(Guid companyId, Guid TutorId)
        {
            DTO.Tutor tutorDetail = new DTO.Tutor();
            var tutor = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == TutorId && o.IsDeleted == false, includeProperties: "Users,TutorQualifications");
            if (tutor != null)
            {
                tutorDetail = Mappings.Mapper.Map<Models.Tutor, DTO.Tutor>(tutor);
                List<Models.SubjectStudyLevelSetup> companyPriseList = new List<SubjectStudyLevelSetup>();

                List<string> subject = new List<string>();
                List<string> tutorQualifications = new List<string>();
                var tutorPriceList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(o => o.TutorId == TutorId && o.IsDeleted == false, includeProperties: "Subject");
                foreach (var item in tutorPriceList)
                {
                    companyPriseList.Add(await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().GetSingle(o => o.CompanyId == companyId && o.SubjectId == item.SubjectId && o.StudyLevelId == item.StudyLevelId && o.IsDeleted == false));
                    if (!subject.Any(x => x == item.Subject.Name))
                    {
                        subject.Add(item.Subject.Name);
                    }
                }
                if (companyPriseList.Count > 0)
                {
                    tutorDetail.TutorPriceLesson.OneToOneMinPrice = companyPriseList.Min(x => x.PricePerPerson);
                    tutorDetail.TutorPriceLesson.OneToOneMaxPrice = companyPriseList.Max(x => x.PricePerPerson);
                    tutorDetail.TutorPriceLesson.GroupMinPrice = Convert.ToDecimal(companyPriseList.Min(x => x.GroupPricePerPerson));
                    tutorDetail.TutorPriceLesson.GroupMaxPrice = Convert.ToDecimal(companyPriseList.Max(x => x.GroupPricePerPerson));
                    tutorDetail.TutorSubjectNameList = subject;
                    tutorDetail.TutorQualification = tutor.TutorQualifications.Where(x=>!x.IsDeleted).Select(x => x.Name).ToList();
                }

                var TutorLessonList = await _UnitOfWork.Repository<Models.ClassSession>().Get(o => o.OwnerId == tutor.Users.FirstOrDefault().Id && o.Complete == true && o.EndedAtDate >= DateTime.Now.AddDays(-30));
                if (TutorLessonList.Count > 0)
                {
                    tutorDetail.TutorPriceLesson.OneToOneLessonCount = TutorLessonList.Count(x => x.MaxPersons == 1 && x.Complete == true);
                    tutorDetail.TutorPriceLesson.GroupLessonCount = TutorLessonList.Count(x => x.MaxPersons > 1 && x.Complete == true);
                }

                var user = tutor.Users.FirstOrDefault();
                var existingLogins = await _UserManager.GetLoginsAsync(user);
                if (existingLogins.Any(o => o.LoginProvider == "Google"))
                {
                    tutorDetail.HasGoogleAccountLinked = true;
                }

            }
            else
            {
                tutorDetail = null;
            }
            return tutorDetail;
        }

        public async Task<List<DTO.Subject>> GetCompanyTutorSubject(Guid companyId)
        {

            var TutorList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(x => x.Tutor.CompanyTutors.Any(y => y.CompanyId == companyId && y.TutorId == x.TutorId && y.IsDeleted == false), includeProperties: "Subject");
            var SubjectsList = TutorList.Select(x => x.Subject).ToList();
            return Mappings.Mapper.Map<List<Models.Subject>, List<DTO.Subject>>(SubjectsList.Distinct().OrderBy(x => x.Name).ToList());
        }

        public async Task<List<DTO.StudyLevel>> GetCompanyTutorsLevelBySubject(Guid companyId, Guid subjectId)
        {
            var TutorList = await _UnitOfWork.Repository<Models.SubjectStudyLevelSetup>().Get(x => x.SubjectId == subjectId && x.Tutor.CompanyTutors.Any(y => y.CompanyId == companyId && y.TutorId == x.TutorId && y.IsDeleted == false), includeProperties: "StudyLevel");
            var LevelList = TutorList.Select(x => x.StudyLevel).ToList();
            return Mappings.Mapper.Map<List<Models.StudyLevel>, List<DTO.StudyLevel>>(LevelList.Distinct().OrderBy(x => x.Name).ToList());
        }
    }
}
