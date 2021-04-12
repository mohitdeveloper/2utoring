using System;

namespace StandingOut.Data.DTO
{
    public class PagedTutorBankDetails
    {
        public Guid TutorId { get; set; }
        public Guid UserId { get; set; }

        public string BankAccountNumber { get; set; }
        public string BankSortCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserFullName
        {
            get
            {
                return $"{FirstName} {LastName}";
            }
        }
    }
}
