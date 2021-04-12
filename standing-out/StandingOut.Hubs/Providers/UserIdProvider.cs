using Microsoft.AspNetCore.SignalR;
using System.Linq;

namespace StandingOut.Hubs.Providers
{

    /*
     * How to associate connections to a user
     * https://docs.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-3.1#use-claims-to-customize-identity-handling
     */

    public class UserIdProvider : IUserIdProvider
    {      
        
        public virtual string GetUserId(HubConnectionContext connection)
        {
            string email = connection.User?.Claims.First(o => o.Type == "email")?.Value;
            return email;
        }
    }
}
