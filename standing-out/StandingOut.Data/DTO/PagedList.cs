using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class PagedList<T>
    {
        public Paged Paged { get; set; }
        public List<T> Data { get; set; }

        public PagedList()
        {
            Paged = new Paged();
        }
    }

    public class Paged
    {
        public int Page { get; set; }
        public int Take { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public string Showing
        {
            get
            {
                if (Page == TotalPages)
                {
                    return "Showing " + ((Page * Take) + 1).ToString() + " to " + TotalCount.ToString() + " of " + TotalCount.ToString();
                }
                else
                {
                    return "Showing " + ((Page * Take) + 1).ToString() + " to " + (((Page * Take)) + Take).ToString() + " of " + TotalCount.ToString();
                }
            }
        }
    }

    public class SearchModel
    {
        public string Search { get; set; }
        public string Filter { get; set; }

        public int Page { get; set; }
        public int Take { get; set; }

        public string SortType { get; set; }
        public string Order { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class SubjectStudyLevelSearchModel: SearchModel
    {
        public Guid OwningEntityId { get; set; } // TutorId or CompanyId
        public SubjectStudyLevelSetupType SubjectStudyLevelSetupType { get; set; }

        public string SubjectNameSearch { get; set; }
        public string StudyLevelSearch { get; set; }
    }

    public class TutorSearchModel: SearchModel
    {
        public TutorSearchFilterType ProfileFilter { get; set; }
        public TutorSearchFilterType DBSFilter { get; set; }
    }
}
