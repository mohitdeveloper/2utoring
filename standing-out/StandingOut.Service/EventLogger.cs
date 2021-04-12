using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace StandingOut.Service
{
    public static class EventLogger
    {
        public static async Task LogMessage(Utilities.DTOS.SMTPCredentials credentials, ILogger logger, string msg, EventLogEntryType type)
        {


            if (type == EventLogEntryType.Error)
            {
                logger.LogError(msg);
                string projectName = "Standing Out Service";


                if (credentials != null)
                {
                    Utilities.EmailUtilities.SendEmail
                    (
                        credentials: credentials,
                        to: new List<string>() { "admin@2utoring.com" },
                        from: "admin@2utoring.com",
                        subject: $"Error While Processing - {projectName}",
                        body: string.Format("<b>Message<b>:<br /> {0}", msg),
                        attachments: null,
                        BCC: null,
                        CC: null
                    );
                }
            }
            else if (type == EventLogEntryType.Warning)
            {
                logger.LogWarning(msg);
            }
            else
            {
                logger.LogInformation(msg);
            }
        }

        public static async Task LogMessage(string sendGridApiKey, ILogger logger, string msg, EventLogEntryType type)
        {


            if (type == EventLogEntryType.Error)
            {
                logger.LogError(msg);
                string projectName = "Standing Out Service";


                if (!string.IsNullOrWhiteSpace(sendGridApiKey))
                {
                    await Utilities.EmailUtilities.SendEmail
                    (
                        apiKey: sendGridApiKey,
                        to: "admin@2utoring.com",
                        from: "admin@2utoring.com",
                        subject: $"Error While Processing - {projectName}",
                        body: string.Format("<b>Message<b>:<br /> {0}", msg),
                        attachments: null,
                        BCC: null,
                        CC: null
                    );
                }
            }
            else if (type == EventLogEntryType.Warning)
            {
                logger.LogWarning(msg);
            }
            else
            {
                logger.LogInformation(msg);
            }
        }
    }
}
