using System;
using System.Security.Cryptography;
using System.Text;

namespace StandingOut.Business.Authorization
{
    public static class Cryptographer
    {
        public static string HashPassword(string password, string salt)
        {
            password = password.Trim();
            salt = salt.Trim();

            byte[] bytes = Encoding.Unicode.GetBytes(password);
            byte[] src = Convert.FromBase64String(salt);
            byte[] dst = new byte[src.Length + bytes.Length];
            byte[] inArray = null;
            Buffer.BlockCopy(src, 0, dst, 0, src.Length);
            Buffer.BlockCopy(bytes, 0, dst, src.Length, bytes.Length);

            using (var algorithm = SHA256.Create())
            {
                // Create the at_hash using the access token returned by CreateAccessTokenAsync.
                inArray = algorithm.ComputeHash(Encoding.ASCII.GetBytes(password));
            }

            // Return the hash in base 64 format
            return Convert.ToBase64String(inArray);
        }

        // Create a unique salt
        public static string CreateSalt()
        {
            var rng = RandomNumberGenerator.Create();
            var buff = new byte[0x10];
            rng.GetBytes(buff);
            return Convert.ToBase64String(buff);
        }

        public static string EncodeTo64(string toEncode)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(toEncode));
        }

        public static string DecodeFrom64(string encodedData)
        {
            return Encoding.UTF8.GetString(Convert.FromBase64String(encodedData));
        }

        // Create a unique key this can be used for passwords
        public static string CreateUniqueKey(int length)
        {
            string guidResult = string.Empty;

            // Iterate while we are less then the length required
            while (guidResult.Length < length)
            {
                // Get the GUID.
                guidResult += Guid.NewGuid().ToString().GetHashCode().ToString("x");
            }

            // Make sure length is valid.
            if (length <= 0 || length > guidResult.Length)
                throw new ArgumentException("Length must be between 1 and " + guidResult.Length);

            // Return the first length bytes.
            return guidResult.Substring(0, length);
        }
    }
}
