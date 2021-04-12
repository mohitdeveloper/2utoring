using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO.TutorRegister
{
    public class TutorRegisterProfile
    {
        public Guid TutorId { get; set; }
        [StringLength(250)]
        public string Header { get; set; }
        [StringLength(2000)]
        public string SubHeader { get; set; }
        [StringLength(2000)]
        public string Biography { get; set; }
        [StringLength(2000)]
        public string ProfileTeachingExperiance { get; set; }
        [StringLength(2000)]
        public string ProfileHowITeach { get; set; }
    }
}


