using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class RecordingResponse
    {
        public RecordingResponse()
        {
        }

        [StringLength(500)]
        public string CurrentRecordingId { get; set; }
    }



}
