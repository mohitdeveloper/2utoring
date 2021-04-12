using System;

namespace StandingOut.Data.DTO
{
    public class SessionWhiteBoardHistory
    {
        public Guid SessionWhiteBoardHistoryId { get; set; }
        public Guid SessionWhiteBoardId { get; set; }
        public string UserId { get; set; }
        public string HistoryType { get; set; }
        public string JsonData {get; set;} 
        public DateTime LogDate { get; set; }

        public string IntermediateId { get; set; }

        public bool UnDone { get; set; }
        public DateTime? UnDoneDate { get; set; }

        public bool ReDone { get; set; }
        public Guid? ReDoneId { get; set; }

        public WhiteboardData CanvasData { get; set; }
    }
}
