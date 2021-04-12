using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOut.Hubs.Hubs
{
    [EnableCors("AllowAll")]
    public class BaseHub : Hub
    {
        public readonly UserManager<Models.User> _UserManager;

        public BaseHub(UserManager<Models.User> userManager)
        {
            _UserManager = userManager;
        }

        public async Task<List<string>> GetUserConnectionIds(string[] ids)
        {
            return await _UserManager.Users.Where(o => o.IsDeleted == false && ids.Any(i => i == o.Id))
                .Select(o => o.Email).ToListAsync();
        }

        public async Task<string> GetUserConnectionIdSingular(string id)
        {
            var user = await _UserManager.FindByIdAsync(id);
            return user.Email;
        }
    }
}
