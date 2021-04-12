using System;
using System.Collections.Generic;
using System.Text;

namespace StandingOut.Data.DTO
{
    public class PlanValidity
    {
        public PlanValidity()
        {
        }

        public string UserType { get; set; }
        public bool IsValidPlan { get; set; }
        public int RemainingDay { get; set; }
    }
}
