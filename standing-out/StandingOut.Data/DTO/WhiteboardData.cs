using System;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class WhiteboardData
    {
        public WhiteboardData()
        {
            Cords = Cords ?? new List<WhiteboardDataCords>();
        }
        public Guid SessionWhiteBoardHistoryId { get; set; }

        public string Text { get; set; }
        public string TextColor { get; set; }
        public string TextStyle { get; set; }

        public DateTime CreatedDate { get; set; }
        public Guid SessionWhiteBoardId { get; set; }

        public string Type { get; set; }
        public bool FillOn { get; set; }
        public string FillColor { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public string Src { get; set; }
        public List<WhiteboardDataCords> Cords { get; set; }
    }

    public class WhiteboardDataCords
    {
        public int Mousex { get; set; }
        public int Mousey { get; set; }
        public int Last_mousex { get; set; }
        public int Last_mousey { get; set; }
        public string Color { get; set; }
        public int Width { get; set; }
    }

    public class WhiteBoardDataAutoResize
    {
        public string Type { get; set; }
        public List<WhiteboardDataCordsAutoResize> Cords { get; set; }
    }

    public class WhiteboardDataCordsAutoResize
    {
        public int Mousex { get; set; }
        public int Mousey { get; set; }
        public int Last_mousex { get; set; }
        public int Last_mousey { get; set; }
    }

    public class WhiteBoardDataAutoImage
    {
        public string Type { get; set; }
        public string src { get; set; }
        public List<WhiteboardDataCordsAutoImage> Cords { get; set; }
    }

    public class WhiteboardDataCordsAutoImage
    {
        public int Width { get; set; }
        public int Mousex { get; set; }
        public int Mousey { get; set; }
        public int Last_mousex { get; set; }
        public int Last_mousey { get; set; }
    }
}
