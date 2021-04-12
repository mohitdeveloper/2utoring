using StandingOut.Data.Models;
using System;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    /// <summary>
    /// </summary>
    public class BasketCreateOrderResponse
    {
        public BasketCreateOrderResponse()
        {
            SuccessResponses ??= new List<KeyValuePair<string, string>>();
            FailResponses ??= new List<KeyValuePair<string, string>>();
        }

        public BasketDto Basket { get; set; }
        public Guid? OrderId { get; set; }
        public Order Order { get; set; }
        public List<KeyValuePair<string, string>> SuccessResponses { get; set; }
        public List<KeyValuePair<string, string>> FailResponses { get; set; }
    }
}
