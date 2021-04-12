using System;

namespace StandingOut.Shared.Infrastructure.Exceptions
{
    public class SettingNotFoundException : ApplicationException
    {
        public SettingNotFoundException(string msg) : base(msg) { }
    }
}
