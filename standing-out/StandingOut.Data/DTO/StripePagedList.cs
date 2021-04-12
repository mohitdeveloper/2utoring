using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class StripePagedList<T>
    {
        public StripePaged Paged { get; set; }
        public List<T> Data { get; set; }

        public StripePagedList()
        {
            Paged = new StripePaged();
        }
    }

    public class StripePaged
    {
        public int Page { get; set; }
        public int Take { get; set; }
        public bool HasMore { get; set; }
    }

    public class StripeSearch
    {
        public int Page { get; set; }
        public int Take { get; set; }
        public string StartingAfterId { get; set; }
        public string EndingBeforeId { get; set; }
    }
}
