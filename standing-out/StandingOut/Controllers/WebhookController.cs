using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Business.Services.Interfaces;

namespace StandingOut.Controllers
{
    public class WebhookController : Controller
    {
        private readonly ISettingService _SettingService;
        private readonly IClassSessionService _ClassSessionService;

        public WebhookController(ISettingService settingService, IClassSessionService classSessionService)
        {
            _SettingService = settingService;
            _ClassSessionService = classSessionService;
        }

        //public async Task<IActionResult> AcuityTest(string testaction, int id, int calendarId, int appointmentTypeId)
        //{
        //    await _ClassSessionService.HandleWebhook(testaction, id, calendarId, appointmentTypeId);

        //    return null;
        //}

            public async Task<IActionResult> AcuityResponse(string action, int id, int calendarId, int appointmentTypeId)
            {
            StringBuilder sb = new StringBuilder();
            var settings = await _SettingService.Get();
            string body = GetWebookBody(Request);
            string signature = Request.Headers["X-Acuity-Signature"];
            string mySig = GetHash(body, settings.AcuitySchedulingSecret);
            bool signatureMatch = signature == mySig;

            try
            {
                if (signatureMatch)
                {
                    await _ClassSessionService.HandleWebhook(action, id, calendarId, appointmentTypeId);
                }
                    else
                {
                    throw new Exception($"Bad Token! Original: {signature} - Generated: {mySig}");
                }
            }
            catch(Exception ex)
            {
                string variablesForMethod = action + " + " + id + " + " + calendarId + " + " + appointmentTypeId;
                sb.AppendLine("<ul>");

                sb.AppendLine($"<li><strong>Date</strong>: {DateTime.Now.ToString()}</li>");
                sb.AppendLine($"<li><strong>variablesForMethod</strong>: {variablesForMethod}</li>");
                sb.AppendLine($"<li><strong>X-Acuity-Signature</strong>: {signature}</li>");
                sb.AppendLine($"<li><strong>Signature Match</strong>: {signatureMatch}</li>");
                sb.AppendLine($"<li><strong>action</strong>: {action}</li>");
                sb.AppendLine($"<li><strong>id</strong>: {id}</li>");
                sb.AppendLine($"<li><strong>calendarID</strong>: {calendarId}</li>");
                sb.AppendLine($"<li><strong>appointmentTypeID </strong>: {appointmentTypeId}</li>");

                sb.AppendLine($"<li><strong>Message </strong>: {ex.Message}</li>");
                sb.AppendLine($"<li><strong>Stack Trace </strong>: {ex.StackTrace}</li>");


                if(ex.InnerException != null)
                {
                    sb.AppendLine($"<li><strong>Inner Message </strong>: {ex.InnerException.Message}</li>");
                    sb.AppendLine($"<li><strong>Inner Stack </strong>: {ex.InnerException.StackTrace}</li>");
                }              

                sb.AppendLine("</ul>");

                await Utilities.EmailUtilities.SendEmail(settings.SendGridApi, "admin@2utoring.com", settings.SendGridFromEmail, "Acuity Webhook Error", sb.ToString(), null, null, null);
                return BadRequest();
            }

            return Ok();
        }


        private string GetWebookBody(HttpRequest request)
        {
            string body = "";
            int counter = 0;

            foreach (var key in request.Form.Keys)
            {
                if (counter > 0)
                    body += "&";

                body += $"{key}={request.Form[key]}";

                counter++;
            }

            return body;
        }

        private static String GetHash(String text, String key)
        {
            ASCIIEncoding encoding = new ASCIIEncoding();

            Byte[] textBytes = encoding.GetBytes(text);
            Byte[] keyBytes = encoding.GetBytes(key);

            Byte[] hashBytes;

            using (HMACSHA256 hash = new HMACSHA256(keyBytes))
                hashBytes = hash.ComputeHash(textBytes);

            return Convert.ToBase64String(hashBytes);
        }
    }
}