using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO.CompanyRegister
{
    // Fields copied to Company model - 27 Aug
    public class CompanyRegisterProfileOne
    {
        public Guid CompanyId { get; set; }

        [StringLength(250)]
        public string Name { get; set; }

        [StringLength(2000)]
        public string CompanyDescription { get; set; }

        [StringLength(2000)]
        public string WhoWeAre { get; set; }
        [StringLength(2000)]
        public string WhatWeDo { get; set; }
        [StringLength(2000)]
        public string WhyWeDoIt { get; set; }
        [StringLength(2000)]
        public string WhyChooseUs { get; set; }
    }
}


