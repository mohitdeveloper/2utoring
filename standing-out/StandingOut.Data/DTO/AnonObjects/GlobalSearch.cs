namespace StandingOut.Data.DTO
{
    public class GlobalSearch : SearchModel
    {
        public GlobalSearch()
        {
        }

        public bool Tutors { get; set; }
        public bool Companies { get; set; }
    }
}
