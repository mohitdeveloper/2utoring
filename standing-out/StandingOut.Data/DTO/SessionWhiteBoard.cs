using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class SessionWhiteBoard
    {
        public SessionWhiteBoard()
        {
            History = History ?? new List<SessionWhiteBoardHistory>();
            CanvasData = CanvasData ?? new List<WhiteboardData>();
            UndoStore = UndoStore ?? new List<Guid>();

            Tooltype = "draw";
            Color = "#00000";
            Width = 3;
            Last_mousex = 0;
            Last_mousey = 0;
            Mousex = 0;
            Mousey = 0;
            Mousedown = false;
        }

        public Guid SessionWhiteBoardId { get; set; }        
        public Guid ClassSessionId { get; set; }
        public Guid? SessionGroupId { get; set; }
        public string UserId { get; set; }

        [StringLength(500)]
        public string Name { get; set; }
        public string AppendName { get; set; }

        public int SizeX { get; set; }
        public int SizeY { get; set; }

        public bool Locked { get; set; }

        public List<SessionWhiteBoardHistory> History { get; set; }

        public bool WriteDisabled { get; set; }
        public string Tooltype { get; set; }
        public string Color { get; set; }
        public int Width { get; set; }
        public int Last_mousex { get; set; }
        public int Last_mousey { get; set; }
        public int Mousex { get; set; }
        public int Mousey { get; set; }
        public bool Mousedown { get; set; }
        public List<WhiteboardData> CanvasData { get; set; }

        public List<Guid> UndoStore { get; set; }
    }
}
