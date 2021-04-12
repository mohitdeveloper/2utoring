using System;
using System.Collections.Generic;
using System.Linq;

namespace StandingOut.Data.DTO
{
    public class ChatroomInstance
    {
        public ChatroomInstance()
        {
            Messages = Messages ?? new List<SessionMessage>();
            ChatPositions = ChatPositions ?? new List<ChatPosition>();
        }

        public Guid? GroupId { get; set; }
        public string ToUserId { get; set; }
        public Guid? SessionOneToOneChatInstanceId { get; set; }

        public string Name { get; set; }

        public bool NewMessage { get; set; }
        public int NewMessageCount { get; set; }

        public int CurrentChatPosition { get; set; }
        
        public bool HelpRequested { get; set; }

        public bool ChatActive { get; set; }

        public int MostRead
        {
            get
            {
                return ChatPositions.Count == 0 ? 0 : ChatPositions.Max(x => x.NumberRead);
            }
        }

        public List<SessionMessage> Messages { get; set; }
        public List<ChatPosition> ChatPositions { get; set; }
    }
}
