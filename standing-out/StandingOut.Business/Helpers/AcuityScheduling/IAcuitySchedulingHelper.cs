using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StandingOut.Business.Helpers.AcuityScheduling
{
    public interface IAcuitySchedulingHelper : IDisposable
    {
        Task<List<AcuitySchedulingAppointment>> GetAppointments(DateTime? startDate, DateTime? endDate);
        Task<AcuitySchedulingAppointment> GetAppointment(int id);
        Task<List<AcuitySchedulingAppointmentPayment>> GetAppointmentPayments(int id);
        Task<List<AcuitySchedulingCalendar>> GetCalendars();
        Task<List<AcuitySchedulingClient>> GetClients();
        Task<List<AcuitySchedulingAppointmentType>> GetAppointmentTypes();
    }
}
