using StandingOut.Data.Enums;
using System.Collections.Generic;

namespace StandingOut.Data.DTO
{
    public class WebcamGroupResult
    {
        public List<WebcamRoom> WebcamGroupsAll { get; set; }
        public List<WebcamGroup> WebcamGroups { get; set; }
    }

    public class WebcamGroup
    {
        public WebcamGroupType Type { get; set; }
        public List<WebcamRoom> Rooms { get; set; }
    }

    public class WebcamRoom
    {
        public WebcamRoom()
        {
            Users ??= new List<WebcamGroupUser>();
        }
        // General Use
        public string Text { get; set; }
        public string Value { get; set; }
        public string Identifier { get; set; } // THIS FIELD CAN VARY BETWEEN PEOPLE FOR 1 on 1 ROOMS - WILL BE THE OTHER USERID - FOR OTHER TYPES IS THE APPROPRIATE ID (GROUPID, CLASSID)
        public List<WebcamGroupUser> Users { get; set; }
        // For other places
        public WebcamGroupType Type { get; set; }
        public string TypeString
        {
            get
            {
                return Type.ToString();
            }
        }
        public bool HelpRequested { get; set; }
        public bool Hide { get; set; }

    }

    public class WebcamGroupUser
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public int Position { get; set; }
        public int OriginalPosition { get; set; }
        public bool IsExpanded { get; set; }

        public string Initials { 
            get
            {
                string initials = "";

                if (!string.IsNullOrWhiteSpace(FirstName) && FirstName.Length > 0)
                {
                    initials += FirstName.Substring(0, 1);
                }

                if (!string.IsNullOrWhiteSpace(LastName) && LastName.Length > 0)
                {
                    initials += LastName.Substring(0, 1);
                }

                return initials;
            }
        }

        public string DisplayName
        {
            get
            {
                string name = $"{FirstName} {LastName}";

                if(name.Length > 17)
                {
                    name = name.Substring(0, 14) + "...";
                }


                return name;
            }
        }

    }
}
