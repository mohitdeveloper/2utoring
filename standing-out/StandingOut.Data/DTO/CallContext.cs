using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using StandingOut.Data.Models;

namespace StandingOut.Data.DTO
{
    public interface ICallContext
    {
        bool IsTutor { get; }
        bool IsAdmin { get; }
        bool IsSuperAdmin { get; }
        User CurrentUser { get; }
        Models.Company CurrentUserCompany { get; set; } // Only set for Company Admin

    }

    public class CallContext : ICallContext
    {
        public CallContext() { }
        public bool IsTutor { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsSuperAdmin { get; set; }
        public Models.User CurrentUser { get; set; }
        public Models.Company CurrentUserCompany { get; set; }
    }

}
