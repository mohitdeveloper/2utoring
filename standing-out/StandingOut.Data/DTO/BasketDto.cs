using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    /// <summary>
    /// When buying one or more courses, build the basket with one or more basket items
    /// Each course is a basket item. Buyer is attendee for all lessons.
    /// </summary>
    public class BasketDto
    {
        public BasketDto()
        {
            BasketId = default;
            OrderId = default;
            BasketItems ??= new List<BasketItemDto>();
        }

        public Guid BasketId { get; set; }
        public Guid? OrderId { get; set; }
        public Payment Payment { get; set; }
        public decimal TotalToPay { get; set; }

        [Required]
        public List<BasketItemDto> BasketItems { get; set; } // Only one basket item for now..
    }
}
