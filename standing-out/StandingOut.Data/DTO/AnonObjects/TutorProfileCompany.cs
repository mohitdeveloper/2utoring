using System;

namespace StandingOut.Data.DTO
{
    public class TutorProfileCompany
    {
        public TutorProfileCompany()
        {
        }

        public Guid CompanyId { get; set; }

        public string Name { get; set; }
        public string Header { get; set; }
        public string SubHeader { get; set; }
        public string Biography { get; set; }
        //public string Biography
        //{
        //    get
        //    {
        //        return Biography;
        //    }
        //    set
        //    {
        //        if (value != null)
        //        {
        //            if (value.Length > 200)
        //                Biography = value.Substring(0, 200) + "...";
        //            else
        //                Biography = value;
        //        }
        //        else
        //            Biography = null;
        //    }
        //}
    }
}
