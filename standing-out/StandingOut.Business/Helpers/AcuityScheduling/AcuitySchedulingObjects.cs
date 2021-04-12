using System;
using System.Collections.Generic;

namespace StandingOut.Business.Helpers.AcuityScheduling
{
    public class AcuitySchedulingAppointment
    {
        public AcuitySchedulingAppointment()
        {
            Forms = Forms ?? new List<AcuitySchedulingAppointmentForm>();
        }

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public string EndTime { get; set; }
        public string DateCreated { get; set; }
        public DateTime DateTime { get; set; }
        public decimal Price { get; set; }
        public string Paid { get; set; }
        public decimal AmountPaid { get; set; }
        public string Type { get; set; }
        public int? AppointmentTypeID { get; set; }
        public int? ClassID { get; set; }
        public int Duration { get; set; }
        public string Calendar { get; set; }
        public string Phone { get; set; }
        public int CalendarID { get; set; }
        public bool CanClientCancel { get; set; }
        public bool CanClientReschedule { get; set; }
        public string Location { get; set; }
        public List<AcuitySchedulingAppointmentForm> Forms { get; set; }
    }

    public class AcuitySchedulingAppointmentForm
    {
        public AcuitySchedulingAppointmentForm()
        {
            Values = Values ?? new List<AcuitySchedulingAppointmentFormValues>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public List<AcuitySchedulingAppointmentFormValues> Values { get; set; }
    }

    public class AcuitySchedulingAppointmentFormValues
    {
        public string Value { get; set; }
        public string Name { get; set; }
        public int FieldId { get; set; }
        public int Id { get; set; }
    }

    public class AcuitySchedulingCalendar
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string ReplyTo { get; set; }
        public string Location { get; set; }
        public string TimeZone { get; set; }
    }

    public class AcuitySchedulingClient
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Notes { get; set; }
    }


    public class AcuitySchedulingAppointmentType
    {
        public int Id { get; set; }
        public string Active { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public string Price { get; set; }
        public string Category { get; set; }
        public string Color { get; set; }
        public bool _Private { get; set; }
        public string Type { get; set; }
        public object ClassSize { get; set; }
        public int PaddingAfter { get; set; }
        public int PaddingBefore { get; set; }
        public int[] CalendarIDs { get; set; }
    }


    public class AcuitySchedulingAppointmentPayment
    {
        public string TransactionID { get; set; }
        public DateTime Created { get; set; }
        public string Processor { get; set; }
        public decimal Amount { get; set; }
    }

}
