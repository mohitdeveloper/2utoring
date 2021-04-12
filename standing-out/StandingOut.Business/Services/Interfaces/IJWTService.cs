using System;
using System.Collections.Generic;
using System.Text;

namespace StandingOut.Business.Services.Interfaces
{
    public interface IJWTService : IDisposable
    {
        DateTime GetExpiryTimestamp(string accessToken);
    }
}
