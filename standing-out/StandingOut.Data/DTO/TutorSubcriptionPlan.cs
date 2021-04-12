using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace StandingOut.Data.DTO
{
    public class TutorSubcriptionPlan
    {
        public TutorApprovalStatus DbsProfileApproval { get; set; }
        public Guid TutorId { get; set; }
        public Guid SubscriptionId { get; set; }

    }
}
