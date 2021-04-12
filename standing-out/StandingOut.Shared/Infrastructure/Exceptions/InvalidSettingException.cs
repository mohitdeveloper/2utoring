using System;

namespace StandingOut.Shared.Infrastructure.Exceptions
{
    public class InvalidSettingException : ApplicationException
    {
        public InvalidSettingException(string msg) : base(msg) { }
    }
}