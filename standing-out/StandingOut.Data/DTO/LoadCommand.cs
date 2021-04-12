using System;

namespace StandingOut.Data.DTO
{
    public class LoadCommand
    {
        public Guid SessionWhiteBoardSaveId { get; set; }
        public int SizeX { get; set; }
        public int SizeY { get; set; }
    }
}
