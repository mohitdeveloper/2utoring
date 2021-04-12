using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO.TutorRegister
{
    public class TutorRegisterProfileTwo
    {
        public Guid TutorId { get; set; }
        [StringLength(2000)]
        public string ProfileTeachingExperiance { get; set; }
        [StringLength(2000)]
        public string ProfileHowITeach { get; set; }
    }
}


