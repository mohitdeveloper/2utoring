namespace StandingOut.Data.DTO
{
    public class SessionWhiteBoardShare
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public bool Read { get; set; }
        public bool Write { get; set; }
        public bool PreviousRead { get; set; }
        public bool PreviousWrite { get; set; }

        public void CopyToPreviousStatus()
        {
            this.PreviousRead = this.Read;
            this.PreviousWrite = this.Write;
        }
    }
}
