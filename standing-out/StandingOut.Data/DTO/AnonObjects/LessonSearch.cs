using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class LessonSearch
    {
        public int Take { get; set; }
        public int Page { get; set; }
        public int TotalPages { get; set; }

        [Display(Name = "Subject")]
        public string Subject { get; set; }
        [Display(Name = "Category")]
        public string SubjectCategory { get; set; }
        [Display(Name = "Level")]
        public string StudyLevelUrl { get; set; } //StudyLevel wont work on submit for some reason, hence Url on the end.
        [Display(Name = "Under16")]
        public bool IsUnder16 { get; set; }
        [Display(Name = "Search")]
        public string Search { get; set; }
    }
}
