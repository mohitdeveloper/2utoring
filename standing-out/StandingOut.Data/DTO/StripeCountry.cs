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
        public string CurrencyCode { get; set; }
        public string CurrencySymbol { get; set; }
        public int? DecimalMultiplier { get; set; }
        public int? CurrencyOrder { get; set; }
        public bool SupportedPayout { get; set; }
    }



}
