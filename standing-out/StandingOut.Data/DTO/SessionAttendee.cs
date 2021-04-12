using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class SessionAttendee
    {
        public SessionAttendee()
        {
            Online = false;
        }

        public Guid SessionAttendeeId { get; set; }
        public string UserId { get; set; }
        public Guid? SessionGroupId { get; set; }
        public Guid ClassSessionId { get; set; }

        public int AppointmentId { get; set; }

        [Required]
        [StringLength(250)]
        public string Email { get; set; }
        [Required]
        [StringLength(250)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }
        [Required]
        [StringLength(250)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        public bool Attended { get; set; }
        public DateTime? JoinDate { get; set; }
        public DateTime CreatedDate { get; set; }

        public bool VideoEnabled { get; set; }
        public bool AudioEnabled { get; set; }
        public bool RoomJoinEnabled { get; set; }
        public bool ScreenShareEnabled { get; set; }
        public bool GroupVideoEnabled { get; set; }
        public bool GroupAudioEnabled { get; set; }
        public bool GroupRoomJoinEnabled { get; set; }
        public bool GroupScreenShareEnabled { get; set; }

        public bool CallIndividualsEnabled { get; set; }
        public bool ChatIndividualsEnabled { get; set; }

        public bool Online { get; set; }

        public bool HelpRequested { get; set; }
        public bool ChatActive { get; set; }

        public bool AllWhiteboardActive { get; set; }
        public bool GroupWhiteboardActive { get; set; }

        public string ChangedPermission { get; set; }
        public bool Refunded { get; set; }
        public bool Removed { get; set; }
        public string FriendlyPermissionChanged
        {
            get
            {
                switch (ChangedPermission)
                {
                    case "roomJoinEnabled":
                        PermissionChangedTo = RoomJoinEnabled;
                        return "Room Join";
                    case "videoEnabled":
                        PermissionChangedTo = VideoEnabled;
                        return "Video";
                    case "audioEnabled":
                        PermissionChangedTo = AudioEnabled;
                        return "Audio";
                    case "screenShareEnabled":
                        PermissionChangedTo = ScreenShareEnabled;
                        return "Screen Share";
                    case "callIndividualsEnabled":
                        PermissionChangedTo = CallIndividualsEnabled;
                        return "Call Individuals";
                    case "groupRoomJoinEnabled":
                        PermissionChangedTo = GroupRoomJoinEnabled;
                        return "Group Room Join";
                    case "groupVideoEnabled":
                        PermissionChangedTo = GroupVideoEnabled;
                        return "Group Video";
                    case "groupAudioEnabled":
                        PermissionChangedTo = GroupAudioEnabled;
                        return "Group Audio";
                    case "groupScreenShareEnabled":
                        PermissionChangedTo = ScreenShareEnabled;
                        return "Group Screen Share";
                    default:
                        return null;
                }
            }
        }

        public string FullName
        {
            get
            {
                return $"{FirstName} {LastName}";
            }
        }

        public string Status
        {
            get
            {
                var result = "Booked";

                if (Removed)
                {
                    result = "Removed";
                } else if (Refunded && !IsRefundStudentInitiated)
                {
                    result = "Refunded";
                }
                else if (Refunded && IsRefundStudentInitiated)
                {
                    result = "Cancelled";
                }
                return result;
            }
        }
        public bool PermissionChangedTo { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsRefundStudentInitiated { get; set; }
    }
}
