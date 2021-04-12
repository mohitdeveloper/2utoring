using StandingOut.Data.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace StandingOut.Data.DTO
{
    public class EmailModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ReceiverEmail { get; set; }
        public string Message { get; set; }
    }

    public class UpdateModel
    {
        public Guid Id { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }

    }
    public class UpdateStripPlanModel
    {
        public Guid StripePlanId { get; set; }
        public string StripeProductId { get; set; }
    }
    public class UserAlertViewModel
    {
        public Guid Id { get; set; }
        public string UserType { get; set; }
        public string SiteUrl { get; set; }
        public TutorApprovalStatus IDVerificationStatus { get; set; }
        public bool HasStripeConnectAccount { get; set; }
        public bool HasStripeSubscription { get; set; }
        public bool HasSubjectPrice { get; set; }
        public bool CompanyHasTutors { get; set; }
        public bool TutorHasAvailabilitySlots { get; set; }
        public bool HasGoogleAccount { get; set; }
        public TutorApprovalStatus DBSApprovalStatus { get; set; }
        public TutorApprovalStatus ProfileApprovalStatus { get; set; }
        public string TutorDBSCertificateFileName { get; set; }
        public string TutorDBSCertificateNo { get; set; }
        public bool TutorHasQualifications { get; set; }
        public bool TutorHasQualificationCertifications { get; set; }
        public bool InitialRegistrationComplete { get; set; }
        public bool DbsStatusMessageRead { get; set; }
        public bool DbsApprovedMessageRead { get; set; }
        public bool DbsNotApprovedMessageRead { get; set; }
        public bool ProfileMessageRead { get; set; }
        public bool ProfileUpgradeMessageRead { get; set; }
        public Guid SubscriptionId { get; set; }
        public bool ProfileSetupStarted { get; set; }
        public bool ProfileFieldsAllComplete { get; set; }
        public int FreeDaysLeft { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

    }
    public class UserMessageUpdateModel
    {
        public Guid ReferenceId { get; set; }
        public string UserType { get; set; }
        public string MessageColumnName { get; set; }
        public bool MessageStatus { get; set; }
    }
}

