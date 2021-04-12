using System;

namespace StandingOut.Data.DTO
{
    public class SafeguardingException : Exception
    {
        public SafeguardingException()
        {
        }

        public SafeguardingException(string message)
            : base(message)
        {
        }

        public SafeguardingException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}


