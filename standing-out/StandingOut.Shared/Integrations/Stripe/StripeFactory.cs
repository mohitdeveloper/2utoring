namespace StandingOut.Shared.Integrations.Stripe
{
    public static class StripeFactory
    {
        public static IStripeHelper GetStripeHelper(string apiKey, string connectClientId)
        {
            return new StripeHelper(apiKey, connectClientId);
        }
    }
}
