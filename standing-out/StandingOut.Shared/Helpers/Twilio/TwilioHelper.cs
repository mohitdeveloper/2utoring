using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Twilio;
using Twilio.Rest.Video.V1;
using static Twilio.Rest.Video.V1.CompositionResource;
using Models = StandingOut.Data.Models;

namespace StandingOut.Shared.Helpers.Twilio
{
    public class TwilioHelper : ITwilioHelper
    {

        public TwilioHelper()
        {
        }

        public Models.ClassSessionVideoRoom EmbelishRecording(string accountsid, string accountauthtoken, string apikey, string apisecret, Models.ClassSessionVideoRoom model)
        {
            TwilioClient.Init(accountsid, accountauthtoken);
            var composition = CompositionResource.Fetch(pathSid: model.CompositionSid);

            model.Duration = composition.Duration;
            if (composition.Status == CompositionResource.StatusEnum.Completed)
            {
                model.CompositionDownloadReady = true;
            }

            return model;
        }

        public string GetDownload(string accountsid, string accountauthtoken, string apikey, string apisecret, string roomSid, string participantSid, string type)
        {
            var ttype = RecordingResource.TypeEnum.Video;
            if (type == "audio")
            {
                ttype = RecordingResource.TypeEnum.Audio;
            }

            TwilioClient.Init(accountsid, accountauthtoken);

            var data = new List<string>();
            data.Add(roomSid);
            data.Add(participantSid);

            var recordings = RecordingResource.Read(
                 groupingSid: data
             );

            var recording = recordings.FirstOrDefault(o => o.Type == ttype);
            if (recording != null)
            {
                string uri = "https://video.twilio.com/v1/" +
                          $"Recordings/{recording.Sid}/" +
                           "Media";
                var request = (HttpWebRequest)WebRequest.Create(uri);
                request.Headers.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.ASCII.GetBytes(apikey + ":" + apisecret)));
                request.AllowAutoRedirect = true;
                HttpWebResponse response = request.GetResponse() as HttpWebResponse;
                return response.ResponseUri.AbsoluteUri;
            }
            else
            {
                return "";
            }
        }


        public string GenerateComposition(string accountsid, string accountauthtoken, string apikey, string apisecret, string roomSid, string participantSid)
        {
            TwilioClient.Init(accountsid, accountauthtoken);

            var data = new List<string>();
            data.Add(roomSid);
            data.Add(participantSid);

            var recordings = RecordingResource.Read(
                 groupingSid: data
             );

            var videoSources = new List<string> { };
            var audioSources = new List<string> { };

            foreach (var source in recordings)
            {
                if (source.Type == RecordingResource.TypeEnum.Video)
                {
                    videoSources.Add(source.Sid);
                }
                else if (source.Type == RecordingResource.TypeEnum.Audio)
                {
                    audioSources.Add(source.Sid);
                }
            }

            var videoLayout = new
            {
                transcode = new
                {
                    video_sources = videoSources.ToArray(),
                }
            };

            if (videoSources.Count == 0)
                videoLayout = null;

            if (audioSources.Count == 0)
                audioSources = null;

            var composition = CompositionResource.Create(
              roomSid: roomSid,
              videoLayout: videoLayout,
              audioSources: audioSources,
              //statusCallback: new Uri("http://my.server.org/callbacks"),
              format: FormatEnum.Mp4
              );

            return composition.Sid.ToString();
        }

        public Stream DownloadComposition(string accountsid, string accountauthtoken, string apikey, string apisecret, string compositionSid)
        {
            TwilioClient.Init(accountsid, accountauthtoken);
            var composition = CompositionResource.Fetch(pathSid: compositionSid);
            if (composition.Links.Count > 0)
            {
                var request = (HttpWebRequest)WebRequest.Create(composition.Links.First().Value);
                request.Headers.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.ASCII.GetBytes(accountsid + ":" + accountauthtoken)));
                request.AllowAutoRedirect = true;
                Stream responseBody = request.GetResponse().GetResponseStream();
                //var mediaLocation = JsonConvert.DeserializeObject<Dictionary<string, string>>(responseBody)["redirect_to"];
                return responseBody;
            }
            return null;
        }
    }
}
