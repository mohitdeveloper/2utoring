using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using System.Collections.Generic;

namespace StandingOutIdentity
{
    public static class Config
    {
        // test users
        public static List<TestUser> GetUsers()
        {
            return new List<TestUser>
            {
                //new TestUser
                //{
                //    SubjectId = "d860efca-22d9-47fd-8249-791ba61b07c7",
                //    Username = "Frank",
                //    Password = "password",

                //    Claims = new List<Claim>
                //    {
                //        new Claim("given_name", "Frank"),
                //        new Claim("family_name", "Underwood"),
                //        new Claim("address", "Main Road 1"),
                //        new Claim("role", "FreeUser"),
                //        new Claim("subscriptionlevel", "FreeUser"),
                //        new Claim("country", "nl")
                //    }
                //},
                //new TestUser
                //{
                //    SubjectId = "b7539694-97e7-4dfe-84da-b4256e1ff5c7",
                //    Username = "Claire",
                //    Password = "password",

                //    Claims = new List<Claim>
                //    {
                //        new Claim("given_name", "Claire"),
                //        new Claim("family_name", "Underwood"),
                //        new Claim("address", "Big Street 2"),
                //        new Claim("role", "PayingUser"),
                //        new Claim("subscriptionlevel", "PayingUser"),
                //        new Claim("country", "be")
                //    }
                //}
            };
        }

        // identity-related resources (scopes)
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(),
            };
        }

        // api-related resources (scopes)
        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("Classroom"),
                new ApiResource("Store"),



                //How we can have IDS internal to our API, not needed in Standing Out
                //new ApiResource(IdentityServerConstants.LocalApi.ScopeName)

            };
        }


        public static IEnumerable<Client> GetClients()
        {
            return new List<Client>()
            {
                new Client
                {
                    ClientName = "2utoring.com",
                    ClientId = "2utoring.com--BE1A3328-80F8-4B06-8ED5-06F60F9148B3--4fKdb78sbW5d7IS670FjNH",                    
                    AllowedGrantTypes = GrantTypes.Code,
                    RequirePkce = true,
                    RequireConsent = false,
                    AccessTokenLifetime = 43200,

                    AlwaysSendClientClaims = true,
            AlwaysIncludeUserClaimsInIdToken = true,

                    RedirectUris = new List<string>()
                    {
                        "https://localhost:5001/signin-oidc",
                        "https://localhost:44316/signin-oidc",
                        "https://localhost:44314/signin-oidc",
                        "https://standingout.iostudios.co.uk/signin-oidc",
                        "https://standingoutstore.iostudios.co.uk/signin-oidc",
                        "https://classroom.2utoring.com/signin-oidc",
                        "https://www.2utoring.com/signin-oidc",
                        "https://2utoring.com/signin-oidc",


                        "https://test.2utoring.com/signin-oidc",
                        "https://testclassroom.2utoring.com/signin-oidc",
                    },
                    PostLogoutRedirectUris = new List<string>()
                    {
                        "https://localhost:5001/signout-callback-oidc",
                        "https://localhost:44316/signout-callback-oidc",
                        "https://localhost:44314/signout-callback-oidc",
                        "https://standingout.iostudios.co.uk/signout-callback-oidc",
                        "https://standingoutstore.iostudios.co.uk/signout-callback-oidc",
                        "https://classroom.2utoring.com/signout-callback-oidc",
                        "https://www.2utoring.com/signout-callback-oidc",
                        "https://2utoring.com/signout-callback-oidc",

                        "https://test.2utoring.com/signout-callback-oidc",
                        "https://testclassroom.2utoring.com/signout-callback-oidc",
                    },
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        IdentityServerConstants.StandardScopes.Email,
                        
                        //Custom Scopes for Standing Out
                        "Classroom",
                        "Store"

                        //How we can have IDS internal to our API, not needed in Standing Out
                        //IdentityServerConstants.LocalApi.ScopeName
                    },
                    ClientSecrets =
                    {
                        new Secret("z@NtXyS&Zms!Cvqei01vMIBYm1&hJ1CO4LXGEO3L*@@!NA&ZcCExuV*ba3V!eMamnk4LfQUagUpcVTiis5ooArPRE7b$zGqNZRU".Sha256())
                        //new Secret("secret".Sha256())
                    },
                    AllowedCorsOrigins =
                    {
                        "https://localhost:5001",
                        "https://localhost:44316",
                        "https://localhost:44314",
                        "https://standingout.iostudios.co.uk",
                        "https://standingoutstore.iostudios.co.uk",
                        "https://classroom.2utoring.com",
                        "https://www.2utoring.com",
                        "https://2utoring.com",
                    }
                },
             };

        }
    }
}
