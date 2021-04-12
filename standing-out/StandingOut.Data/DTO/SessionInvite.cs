using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class SessionInvite
    {
        public SessionInvite()
        {
        }

        public Guid SessionInviteId { get; set; }
        public Guid ClassSessionId { get; set; }
        public string UserId { get; set; }

        [StringLength(250)]
        public string Email { get; set; }

        public bool InviteSent { get; set; } = false;

        [StringLength(5000)]
        public string BulkEmailString { get; set; }
        public string UserFullName { get; set; }
    }
}
