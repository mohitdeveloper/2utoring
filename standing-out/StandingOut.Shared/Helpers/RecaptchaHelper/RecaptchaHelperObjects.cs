namespace StandingOut.Shared.Helpers.RecaptchaHelper
{
    public class RecaptchaV2Response
    {
        public bool Success { get; set; }
        public string Challenge_ts { get; set; }
        public string HostName { get; set; }
        public string[] ErrorCodes { get; set; }
    }
}
