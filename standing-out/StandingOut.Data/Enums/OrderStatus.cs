namespace StandingOut.Data.Enums
{
    // Dont change enum int values as they are stored in DB
    public enum OrderStatus
    {
        Created = 0,
        PartRefunded = 1,
        Refunded = 2,
        Cancelled = 3,
    }
}
