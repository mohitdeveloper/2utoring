using System.IO;
using Models = StandingOut.Data.Models;

namespace StandingOut.Shared.Helpers.Twilio
{
    public interface ITwilioHelper
    {
        Models.ClassSessionVideoRoom EmbelishRecording(string accountsid, string accountauthtoken, string apikey, string apisecret, Models.ClassSessionVideoRoom model);
        string GetDownload(string accountsid, string accountauthtoken, string apikey, string apisecret, string roomSid, string participantSid, string type);
        string GenerateComposition(string accountsid, string accountauthtoken, string apikey, string apisecret, string roomSid, string participantSid);
        Stream DownloadComposition(string accountsid, string accountauthtoken, string apikey, string apisecret, string compositionSid);
    }
}
