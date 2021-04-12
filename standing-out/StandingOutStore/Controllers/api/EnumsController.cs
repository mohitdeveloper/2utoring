using StandingOut.Data.Enums;
using StandingOutStore.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace StandingOutStore.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Enums")]
    public class EnumsController : BaseController
    {
        [HttpGet("{type}")]
        [ProducesResponseType(typeof(Utilities.DTOS.Option), 200)]
        public IActionResult GetByType(string type)
        {
            var assembly = typeof(FileType).GetTypeInfo().Assembly; // in the same assembly!
            var enumtype = assembly.GetType("StandingOut.Data.Enums." + type);
            var values = Enum.GetValues(enumtype);
            var items = new List<Utilities.DTOS.Option>();

            foreach (var value in values)
            {
                var e = Enum.Parse(enumtype, value.ToString());
                items.Add(new Utilities.DTOS.Option
                {
                    Name = Utilities.EnumUtilities.GetEnumDisplayName(e),
                    //Name = Utilities.EnumUtilities.GetEnumDescription(e),
                    StringValue = e.ToString(),
                    Value = Convert.ToInt32(e)
                });
            }
            return Ok(items.ToList());
        }
    }
}
