namespace StandingOut.Data.Enums
{
    // Dont change enum int values as they are stored in DB
    public enum OrderPaymentStatus
    {
        Pending = 0,
        Paid = 1,
        Failed = -1,
    }
}
