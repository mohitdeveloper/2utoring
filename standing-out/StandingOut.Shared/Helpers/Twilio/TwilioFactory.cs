namespace StandingOut.Shared.Helpers.Twilio
{
    public static class TwilioFactory
    {
        public static ITwilioHelper GetTwilio()
        {
            return new TwilioHelper();
        }
    }
}
