using System.Linq;

namespace StandingOut.Shared.Helpers.Extensions
{
    public static class PrimitiveDataTypeExtension
    {
        private static readonly string[] TruthValues = { "ON", "YES", "TRUE", "1" };
        private static readonly string[] FalseValues = { "OFF", "NO", "FALSE", "0" };

        public static bool TryParseBool(this string value, out bool? boolValue)
        {
            if (TruthValues.All(x => x.ToUpperInvariant() != value.ToUpperInvariant().Trim()) &&
                FalseValues.All(x => x.ToUpperInvariant() != value.ToUpperInvariant().Trim()))
            {
                boolValue = null;
                return false;
            }

            boolValue = TruthValues.Any(x => x.ToUpperInvariant() == value.ToUpperInvariant().Trim());
                     
            return true;
        }
    }

}
