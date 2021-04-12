using StandingOut.Business.Services.Interfaces;
using System;
using JWT;
using JWT.Algorithms;
using JWT.Serializers;
using DTO = StandingOut.Data.DTO;
using JWT.Exceptions;

namespace StandingOut.Business.Services
{
    public class JWTService : IJWTService
    {
        public void Dispose()
        {
            GC.Collect();
        }

        private IJsonSerializer _serializer = new JsonNetSerializer();
        private IDateTimeProvider _provider = new UtcDateTimeProvider();
        private IBase64UrlEncoder _urlEncoder = new JwtBase64UrlEncoder();
        private IJwtAlgorithm _algorithm = new HMACSHA256Algorithm();

        public DateTime GetExpiryTimestamp(string accessToken)
        {
            try
            {
                IJwtValidator _validator = new JwtValidator(_serializer, _provider);
                IJwtDecoder decoder = new JwtDecoder(_serializer, _validator, _urlEncoder, _algorithm);
                var token = decoder.DecodeToObject<DTO.SystemObjects.JwtToken>(accessToken);
                DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(token.exp);
                return dateTimeOffset.UtcDateTime;
            }
            catch (TokenExpiredException)
            {
                return DateTime.MinValue;
            }
            catch (SignatureVerificationException)
            {
                return DateTime.MinValue;
            }
            catch (Exception ex)
            {
                // ... remember to handle the generic exception ...
                return DateTime.MinValue;
            }
        }
    }
}
