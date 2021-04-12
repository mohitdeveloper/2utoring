using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class StripeCountry
    {
        public StripeCountry()
        {
        }

        public Guid StripeCountryId { get; set; }

        [StringLength(250)]
        public string Name { get; set; }
        [StringLength(250)]
        public string Code { get; set; }
        public bool TopOfList { get; set; }
    }



}
