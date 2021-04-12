namespace StandingOut.Data.Enums
{
    // Dont change enum int values as they are stored in DB
    public enum PaymentProviderFieldSetType
    {
        CardPayment = 0,
        Refund = 1,
        Transfer = 2,
        Payout = 3,
    }
}
