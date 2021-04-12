using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using StandingOut.Data.Enums;

namespace StandingOut.Data.DTO
{
    public class SubjectStudyLevelSetup 
    {
        public SubjectStudyLevelSetup() {}

        public Guid SubjectStudyLevelSetupId { get; set; }

        [Required]
        [DisplayName("Subject")]
        public Guid SubjectId { get; set; }

        [Required]
        [DisplayName("Study Level")]
        public Guid StudyLevelId { get; set; }

        public Guid OwningEntityId { get; set; }  // Tutor Or Company Id

        public SubjectStudyLevelSetupType SubjectStudyLevelSetupType { get; set; } =
            SubjectStudyLevelSetupType.Company;

        //[Required]
        [DisplayName("Subject")]
        public string SubjectName { get; set; }

        //[Required]
        [DisplayName("Study Level")]
        public string StudyLevelName { get; set; }

        [Required]
        [DisplayName("Price per person")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:0.##}")]
        public decimal PricePerPerson { get; set; }

        [Required]
        [DisplayName("Group Price per person")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:0.##}")]
        public decimal GroupPricePerPerson { get; set; }

        public string UpdateByName { get; set; }

        [DisplayName("Created By")]
        public string CreatedBy { get; set; }

        [DisplayName("Modified By")]
        public string ModifiedBy { get; set; }

        public bool AllowEdit { get; set; } 

    }

    public class SubjectStudyLevelSetupPrice
    {
        public Guid? SubjectStudyLevelSetupId { get; set; }

        public Guid? CompanyId { get; set; }

        public Guid? TutorId { get; set; }

        [Required]
        public Guid SubjectId { get; set; }

        [DisplayName("Subject")]
        public string SubjectName { get; set; }

        [Required]
        public Guid StudyLevelId { get; set; }
        [DisplayName("Study Level")]
        public string StudyLevelName { get; set; }
        public decimal PricePerPerson { get; set; }
        public decimal? GroupPricePerPerson { get; set; }
    }

   
}
