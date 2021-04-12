
using Newtonsoft.Json;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace StandingOut.Shared.Helpers.RecaptchaHelper
{
    public static class RecaptchaHelper
    {
        public static async Task<RecaptchaV2Response> ProcessRecaptchaV2(string secretKey, string clientResponse)
        {
            using var captchaClient = new HttpClient();
            var captchaResponse = await captchaClient.GetAsync(
                string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}",
                    secretKey, clientResponse
                )
            );
            using var captchaResponseContentStream = await captchaResponse.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(captchaResponseContentStream);
            using var jsonTextReader = new JsonTextReader(streamReader);
            var serialiser = new JsonSerializer();
            return serialiser.Deserialize<RecaptchaV2Response>(jsonTextReader);
        }
    }
}
