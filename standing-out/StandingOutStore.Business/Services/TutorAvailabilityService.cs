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
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using StandingOut.Shared.Integrations.Stripe;
using StandingOut.Data.Enums;
using System.IO;
using StandingOut.Shared.Helpers.AzureFileHelper;
using Mapping = StandingOut.Shared.Mapping;
using System.Linq.Dynamic.Core;
using System.Text;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;

namespace StandingOutStore.Business.Services
{
    public class TutorAvailabilityService : ITutorAvailabilityService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed;
        public TutorAvailabilityService(IUnitOfWork unitOfWork)
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
        public async Task<List<Models.TutorAvailability>> GetByTutorId(Guid tutorid)
        {
            return await _UnitOfWork.Repository<Models.TutorAvailability>().Get(o => o.TutorId == tutorid);
        }
        public async Task<List<Models.Tutor>> GetAvailableTutors(DTO.SearchAvailableTutors model)
        {
            List<Models.Tutor> tutors = new List<Models.Tutor>();
            List<string> tutoerIds = new List<string>();
            if (!string.IsNullOrWhiteSpace(model.SelectedDays) && model.CourseTime != null)
            {

                var companyTutor = await _UnitOfWork.Repository<Models.CompanyTutor>().Get(o => o.CompanyId == model.CompanyId, includeProperties: "Tutor.TutorAvailabilities");
                foreach (var ct in companyTutor)
                {
                    List<Models.TutorAvailability> TutorAvailabilityList = new List<Models.TutorAvailability>();
                    TutorAvailabilityList = ct.Tutor.TutorAvailabilities.Where(x => x.TutorId == ct.TutorId && model.SelectedDays.Contains(x.DayOfWeek.ToString()) && (x.StartTime.Hour == model.CourseTime.Hour && x.StartTime.Minute == model.CourseTime.Minute)).ToList();
                    if (TutorAvailabilityList.Count > 0)
                    {
                        tutoerIds.Add(ct.TutorId.ToString());
                        var tutorObj = await _UnitOfWork.Repository<Models.Tutor>().GetSingle(o => o.TutorId == ct.TutorId, includeProperties: "Users");
                        tutors.Add(tutorObj);
                    }

                }
            }

            return tutors;
        }
        public async Task<Models.TutorAvailability> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.TutorAvailability>().GetSingle(o => o.TutorAvailabilityId == id);
        }
        public async Task<Models.TutorAvailability> Create(Models.TutorAvailability model)
        {

            await _UnitOfWork.Repository<Models.TutorAvailability>().Insert(model);
            return model;

        }
        public async Task<List<Models.TutorAvailability>> CreateMultiple(List<Models.TutorAvailability> model)
        {

            await _UnitOfWork.Repository<Models.TutorAvailability>().Insert(model);
            return model;

        }
        public async Task<Models.TutorAvailability> Update(Models.TutorAvailability model)
        {
            await _UnitOfWork.Repository<Models.TutorAvailability>().Update(model);
            return model;
        }
        public async Task Delete(Guid id)
        {
            var RemoveTutorAvailability = await GetById(id);
            if (RemoveTutorAvailability != null)
            {
                RemoveTutorAvailability.IsDeleted = true;
                await _UnitOfWork.Repository<Models.TutorAvailability>().Update(RemoveTutorAvailability);
            }
        }

        public async Task DeleteByTutor(Guid id)
        {
            var RemoveTutorAvailability = await _UnitOfWork.Repository<Models.TutorAvailability>().Get(o => o.TutorId == id);
            if (RemoveTutorAvailability != null && RemoveTutorAvailability.Count > 0)
            {
                await _UnitOfWork.Repository<Models.TutorAvailability>().Delete(RemoveTutorAvailability);
                //foreach (var item in RemoveTutorAvailability)
                //{
                //    item.IsDeleted = true;

                //}
                //await _UnitOfWork.Repository<Models.TutorAvailability>().Update(RemoveTutorAvailability);


            }

        }


        public async Task<bool> CheckSlotAvailability(DTO.CheckAvailableSlot model)
        {
            var classSession = await _UnitOfWork.Repository<Models.ClassSession>().GetSingle(o => o.OwnerId == model.OwnerId && o.StartDate == model.StartDate && o.IsDeleted==false);
            if (classSession == null)
                return true;
            else
                return false;
        }
    }
}
