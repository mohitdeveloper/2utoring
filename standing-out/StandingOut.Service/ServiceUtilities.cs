using System;

namespace StandingOut.Service
{
    public static class ServiceUtilities
    {
        public static decimal CalculateRunInterval(int seconds, int? minutes, int? hours)
        {
            decimal interval = (decimal)seconds * 1000m;

            if (minutes.HasValue && minutes.Value > 0)
            {
                interval += (minutes.Value * 60 * 1000);
            }

            if (hours.HasValue && hours.Value > 0)
            {
                interval += (hours.Value * 60 * 60 * 1000);
            }

            return interval;
        }

        public static bool CanRun(DateTimeOffset startAt)
        {
            if (startAt.UtcDateTime < DateTimeOffset.UtcNow.UtcDateTime)
                return true;
            else
                return false;
        }
    }
}
