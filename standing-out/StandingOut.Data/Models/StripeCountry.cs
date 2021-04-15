using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Models
{
    public class StripeCountry : EntityBase
    {
        public StripeCountry()
        {
        }

        [Key]
        public Guid StripeCountryId { get; set; }

        [StringLength(250)]
        public string Name { get; set; }
        [StringLength(250)]
        public string Code { get; set; }
        public bool TopOfList { get; set; }

        [StringLength(10)]
        public string CurrencyCode { get; set; }

        [StringLength(10)]
        public string CurrencySymbol { get; set; }
        public int? DecimalMultiplier { get; set; }
        public int? CurrencyOrder { get; set; }
        public bool SupportedPayout { get; set; }
        
    }



}
