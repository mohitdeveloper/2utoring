using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO.CompanyRegister
{
    public class CompanyRegisterProfileTeam
    {
        public Guid CompanyTeamId { get; set; }

        public Guid CompanyId { get; set; }
        [StringLength(250)]
        public string TeamName { get; set; }
        [StringLength(2000)]
        public string TeamRole { get; set; }
        [StringLength(2000)]
        public string TeamDescription { get; set; }
    }
}
