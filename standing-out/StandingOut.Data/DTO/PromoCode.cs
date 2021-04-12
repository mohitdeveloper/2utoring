using StandingOut.Data.Enums;
using System;

namespace StandingOut.Data.DTO
{
    public class PromoCode
    {
        public Guid PromoCodeId { get; set; }
        public PromoCodeType Type { get; set; }
        public string Name { get; set; }
        public decimal? AmountOff { get; set; }
        public decimal? PercentOff { get; set; }
        public int? MaxUses { get; set; }
    }
}
