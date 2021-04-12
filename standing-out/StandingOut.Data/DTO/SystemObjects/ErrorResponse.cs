namespace StandingOut.Data.DTO
{
    public class ErrorResponse
    {
        public ErrorResponse()
        {
            Code = "500";
        }

        public string StackTrace { get; set; }
        public string Message { get; set; }
        public string Code { get; set; }
    }

    public class TokenRepsonse
    {
        public string AccessToken { get; set; }
    }
}
