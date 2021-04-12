using System;

namespace StandingOut.Data.DTO
{
    public class ManagementInfoDashboard
    {
        public ManagementInfoDashboard()
        {
        }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public int TutorCount { get; set; }
        public int StudentCount { get; set; }
        public int CourseCount { get; set; }
        public int SessionCount { get; set; }
        public decimal AverageStudentsPerSession { get; set; }
        public int PaymentsMadeCount { get; set; }
        public decimal PaymentsMadeAmount { get; set; }
    }
}
