using System;

namespace StandingOut.Data.Entity
{
    public interface IEntityBase
    {
        string CreatedBy { get; set; }
        string ModifiedBy { get; set; }
        DateTime? CreatedDate { get; set; }
        DateTime? ModifiedDate { get; set; }
        bool IsDeleted { get; set; }
    }
}
