using System;

namespace StandingOut.Data.DTO
{
    public class ClassSessionIndex
    {
        public ClassSessionIndex() { }

        public Guid ClassSessionId { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid? TutorId { get; set; }
        public string TutorName { get; set; }
        public string EmailContents { get; set; }
        public bool Started { get; set; }

        public int Duration
        {
            get
            {
                return (int)Math.Floor((EndDate - StartDate).TotalMinutes);
            }
        }
        public bool CanEnter
        {
            get
            {
                if (StartDate <= DateTime.Now.AddMinutes(10))
                    return true;
                else
                    return false;
            }
        }
    }
}
