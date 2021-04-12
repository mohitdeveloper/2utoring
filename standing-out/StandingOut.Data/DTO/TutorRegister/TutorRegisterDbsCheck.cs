using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO.TutorRegister
{
    public class TutorRegisterDbsCheck
    {
        public Guid TutorId { get; set; }
        public bool HasDbsCheck { get; set; }
        [StringLength(250)]
        public string DbsCertificateNumber { get; set; }
        public TutorApprovalStatus ProfileApprovalRequired { get; set; }
        public bool IsProfileCheck { get; set; }
    }
}


