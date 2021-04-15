using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace StandingOut.Data.Models
{
    public class User : IdentityUser
    {
        public User() : base()
        {
            ClassSessions = ClassSessions ?? new List<ClassSession>();
            SessionAttendees = SessionAttendees ?? new List<SessionAttendee>();
            SafeguardReports = SafeguardReports ?? new List<SafeguardReport>();
            SessionOneToOneChatInstanceUsers = SessionOneToOneChatInstanceUsers ?? new List<SessionOneToOneChatInstanceUser>();
            SessionWhiteBoards = SessionWhiteBoards ?? new List<SessionWhiteBoard>();
            SessionWhiteBoardSaves = SessionWhiteBoardSaves ?? new List<SessionWhiteBoardSave>();
            SessionWhiteBoardShares = SessionWhiteBoardShares ?? new List<SessionWhiteBoardShare>();
        }

        [ForeignKey("Tutor")]
        public Guid? TutorId { get; set; }

        [StringLength(250)]
        public string Title { get; set; }
        [StringLength(250)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }
        [StringLength(250)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }
        [StringLength(250)]
        public string TelephoneNumber { get; set; }
        [StringLength(250)]
        public string MobileNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public bool IsSetupComplete { get; set; }
        public string StripeCustomerId { get; set; }

        public bool IsParent { get; set; }
        [StringLength(50)]
        public string ParentTitle { get; set; }
        [StringLength(250)]
        public string ParentFirstName { get; set; }
        [StringLength(250)]
        public string ParentLastName { get; set; }

        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }

        [StringLength(1000)]
        [Display(Name = "Google Profile Picture")]
        public string GoogleProfilePicture { get; set; }
        public bool MarketingAccepted { get; set; }
        public bool TermsAndConditionsAccepted { get; set; }

        public DateTimeOffset LastPasswordChange { get; set; }
        [StringLength(250)]
        public string ForgottenKey { get; set; }
        public DateTimeOffset? ForgottenRequestDate { get; set; }

        [StringLength(250)]
        public string ContactEmail { get; set; }
        [StringLength(250)]
        public string GoogleEmail { get; set; }

        [StringLength(250)]
        public string LinkAccountKeyOne { get; set; }
        [StringLength(250)]
        public string LinkAccountKeyTwo { get; set; }
        public DateTimeOffset? LinkAccountRequestDate { get; set; }
        public Guid? StripeCountryID { get; set; }


        public virtual Tutor Tutor { get; set; }

        //tutor link
        public virtual List<ClassSession> ClassSessions { get; set; }
        //attendee link
        public virtual List<SessionAttendee> SessionAttendees { get; set; }
        public virtual List<SafeguardReport> SafeguardReports { get; set; }
        public virtual List<SessionOneToOneChatInstanceUser> SessionOneToOneChatInstanceUsers { get; set; }
        public virtual List<SessionWhiteBoard> SessionWhiteBoards { get; set; }
        public virtual List<SessionWhiteBoardSave> SessionWhiteBoardSaves { get; set; }
        public virtual List<SessionWhiteBoardShare> SessionWhiteBoardShares { get; set; }
        public virtual StripeCountry StripeCountry { get; set; }

        [Display(Name = "Full Name")]
        public string FullName { get { return $"{FirstName} {LastName}"; } }

        [Display(Name = "Parent Full Name")]
        public string ParentFullName { get { return $"{ParentFirstName} {ParentLastName}"; } }

        public string IPAddress { get; set; }
        public string VerificationCode { get; set; }

    }



}
