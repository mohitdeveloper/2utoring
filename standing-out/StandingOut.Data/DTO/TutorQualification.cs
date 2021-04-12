using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class TutorQualification
    {
        public Guid TutorQualificationId { get; set; }
        public Guid TutorId { get; set; }

        [StringLength(250)]
        public string Name { get; set; }
    }

}
