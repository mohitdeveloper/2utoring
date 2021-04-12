using System;

namespace StandingOut.Data.DTO
{
    public class ReceiptIndex
    {
        public ReceiptIndex() { }

        public string Id { get; set; } // paymentIntentId
        public decimal Amount { get; set; }
        public decimal AmountRefunded { get; set; }
        public DateTime Created { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public DateTime LessonStartDate { get; set; } = DateTime.MinValue;
        public Guid ClassSessionId { get; set; } = Guid.Empty;
        public Guid SessionAttendeeId { get; set; } = Guid.Empty;
        public Boolean Refunded { get; set; } = false;

        // From metadata
        public string ClassSessionName { get; set; }
    }
}
