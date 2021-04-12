using StandingOut.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using StandingOut.Data.Enums;

namespace StandingOut.Data.Sample
{
    public static class SampleData
    {
        public static void InitializeSeedData(IServiceProvider serviceProvider)
        {
            using (var serviceScope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var db = serviceScope.ServiceProvider.GetService<DbEntities>();

               db.Database.Migrate();
                //InsertTestData(db);
            }
        }

        public static void InitializeSeedData(DbEntities db)
        {
            db.Database.Migrate();
            //InsertTestData(db);
        }

        public static void InitializeMigrations(IServiceProvider serviceProvider)
        {
            using (var serviceScope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var db = serviceScope.ServiceProvider.GetService<DbEntities>();
                db.Database.Migrate();
            }
        }

        private static void InsertTestData(DbEntities db)
        {
            var roles = new List<IdentityRole>()
            {
                // 2utoring = Super Admin
                new IdentityRole(){ Name = "Super Admin", NormalizedName = "SUPER ADMIN", ConcurrencyStamp = "92ca7349-63cf-44b2-8ad4-411b45894127" },

                // Company role = Admin
                new IdentityRole(){ Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = "92ca7349-63cf-44b2-8ad4-411b45894127" }, 
                new IdentityRole(){ Name = "Tutor", NormalizedName = "TUTOR", ConcurrencyStamp = "92ca7349-63cf-44b2-8ad4-411b45894127" },
            };

            AddOrUpdate(db, o => o.Name, roles);

            var users = new List<User>()
            {
                new User()
                {
                    FirstName = "Support",
                    LastName = "IO",
                    Email = "admin@2utoring.com",
                    UserName = "admin@2utoring.com",
                    NormalizedEmail = "ADMIN@2UTORING.COM",
                    NormalizedUserName = "ADMIN@2UTORING.COM",
                    PasswordHash = "AIcAs5SWn4r8f1uB1qdtfpm7993cqttow3hHg2AwU11osgoe3yT6U5wlaBhItp6snw==",
                    SecurityStamp = "Bz/pU168hpVZ8MmaMe76pg==",
                    ConcurrencyStamp = "92ca7349-63cf-44b2-8ad4-411b45894127",
                }
            };

            AddOrUpdate(db, o => o.Email, users);


            //db.Database.ExecuteSqlCommand("INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (@p0, @p1)", users[0].Id, roles[0].Id);


            var settings = new List<Setting>()
            {
                new Setting
                {
                    SendGridApi = "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",
                    SendGridFromEmail = "admin@2utoring.com",
                    AcuitySchedulingSecret = "c16a81188f5a79907acbae3c0b351a47",
                    AcuitySchedulingUserId = "18456837",
                    TwilioAccountSid = "AC7b5b5d9cc2f0216cfbb1a7a49a7f0a79",
                    TwilioApiKey = "SK3199780e44f34d1d4cedebaa7c2a5b40",
                    TwilioApiSecret = "DIqWzeJaqYuM775VhWlF8Z9PikIgdNVS",
                    TwilioAuthToken = "86720886acbc338fd3a0a0392291477a",
                    GoogleClientId = "898744642580-76oavnt6j0bu83hbi9r3f9dsub8d0rmg.apps.googleusercontent.com",
                    GoogleClientSecret = "cYphQN26mIS6Cu3vnyUChqdm",
                    GoogleAppName = "2utoring.com",
                    SafeguardReportAlertEmail = "admin@2utoring.com, charlie.b@iostudios.co.uk",
                    SignUpEmail = "admin@2utoring.com",
                    TutorProfileUpdateEmail = "admin@2utoring.com",
                    ContactUsEmail = "admin@2utoring.com",
                    TutorSignUpEmail = "admin@2utoring.com",
                    StripeKey = "sk_test_W9iSQPYm0JM2Nk5QsqYRpppM008guOmlmE",
                    StripeConnectClientId = "ca_H91H4E1aQvq2stSQNJ9I5iwaw9w5AFD1",
                    AzureBlobConnectionString = "DefaultEndpointsProtocol=https;AccountName=websiteblobstorage;AccountKey=EthdLR+yZJjkHD5Y2JyKSgm1Oi/WmOGZ3Hd9sxDcXTA2OlqIND7tHwyA6DJdp2SpjhjAhdThT3jjuPxdfrQRKQ==;EndpointSuffix=core.windows.net",
                    BaseClassSessionCommision = 30.00M,
                }
            };
            AddOrUpdate(db, o => o.SendGridApi, settings);

            var tools = new List<SystemTool>()
            {
                new SystemTool()
                {
                    Name = "Whiteboard",
                    FontAwesomeIconClass = "fal fa-chalkboard",
                    NgInclude = "/app/classroom/whiteboard.html",
                    ExitWarning = true
                },
                new SystemTool()
                {
                    Name = "File",
                    FontAwesomeIconClass = "fal fa-file",
                    NgInclude = "/app/classroom/file.html",
                    AllowMultiple = true
                },
                new SystemTool()
                {
                    Name = "Browser",
                    FontAwesomeIconClass = "fal fa-globe",
                    NgInclude = "/app/classroom/media.html",
                    AllowMultiple = true
                }
            };

            AddOrUpdate(db, o => o.Name, tools);

            var stripeCountrys = new List<StripeCountry>()
            {
                new StripeCountry() { Name = "United Kingdom", Code = "gb", TopOfList = true },
            };
            AddOrUpdate(db, o => o.Name, stripeCountrys);

            var subscriptions = new List<Subscription>(){ 
                new Subscription { 
                    SubscriptionId = Guid.Parse("7EB85686-4FF8-46B6-8F0E-6E958249B7FF"), 
                    SubscriptionName = SubscriptionPlans.NoFeeTutorPlan.ToString(), Description = "No Fee Tutor Plan", 
                    SubscriptionPrice = 0
                    },
                new Subscription { 
                    SubscriptionId = Guid.Parse("DCEF0896-A7D0-4FAC-91F0-AB957C2F37D8"), 
                    SubscriptionName = SubscriptionPlans.StarterTutorPlan.ToString(), Description = "Starter Tutor Plan", 
                    SubscriptionPrice = 5.99M
                    },
                new Subscription { 
                    SubscriptionId = Guid.Parse("A4520A7C-AD29-4E53-B55E-76B564FAFFEE"), 
                    SubscriptionName = SubscriptionPlans.ProfessionalTutorPlan.ToString(), Description = "Professional Tutor Plan", 
                    SubscriptionPrice = 9.99M
                    },
                new Subscription { 
                    SubscriptionId = Guid.Parse("1D0D0CAE-103E-417B-9A36-19981B842514"), 
                    SubscriptionName = SubscriptionPlans.CompanyPlan.ToString(), Description = "Company Plan", 
                    SubscriptionPrice = 49.99M
                    },
                new Subscription { 
                    SubscriptionId = Guid.Parse("8F621B6B-4D80-4AC8-B604-9FA8C04E0691"), 
                    SubscriptionName = SubscriptionPlans.PrivateTutorPlan.ToString(), Description = "Private Tutor Plan", 
                    SubscriptionPrice = 5.99M
                    },
                
            };
            AddOrUpdate(db, o => o.SubscriptionId, subscriptions);

            var privateSubscriptionId = db.Subscriptions.FirstOrDefault(x => x.SubscriptionName == SubscriptionPlans.PrivateTutorPlan.ToString())?.SubscriptionId;
            var starterSubscriptionId = db.Subscriptions.FirstOrDefault(x => x.SubscriptionName == SubscriptionPlans.StarterTutorPlan.ToString())?.SubscriptionId;
            var noFeeSubscriptionId = db.Subscriptions.FirstOrDefault(x => x.SubscriptionName == SubscriptionPlans.NoFeeTutorPlan.ToString())?.SubscriptionId;
            var professionalSubscriptionId = db.Subscriptions.FirstOrDefault(x => x.SubscriptionName == SubscriptionPlans.ProfessionalTutorPlan.ToString())?.SubscriptionId;
            var companySubscriptionId = db.Subscriptions.FirstOrDefault(x => x.SubscriptionName == SubscriptionPlans.CompanyPlan.ToString())?.SubscriptionId;

            var stripePlans = new List<StripePlan>()
            {
                // Private Tutor Plan
                new StripePlan() { StripePlanType = Enums.StripePlanType.Tutor, 
                StripePlanLevel = Enums.StripePlanLevel.Starter, 
                StripeProductId = "plan_H6OMk2RPazb0NE", Description = "Private Tutor Plan (legacy)", 
                SubscriptionId = privateSubscriptionId, FreeDays = 90 },

                // No Fee Tutor Plan 
                new StripePlan() { StripePlanType = Enums.StripePlanType.Tutor, 
                StripePlanLevel = Enums.StripePlanLevel.Free, 
                StripeProductId = "price_1HMuzQLDr4O03Zvlb8XPeMZt", Description = "No Fee Tutor Plan",
                SubscriptionId = noFeeSubscriptionId },
                
                // Starter Plan 
                new StripePlan() { StripePlanType = Enums.StripePlanType.Tutor, 
                StripePlanLevel = Enums.StripePlanLevel.Starter, 
                StripeProductId = "price_1HMuyeLDr4O03Zvlx67Ogo0Z", Description = "Starter Tutor Plan",
                SubscriptionId = starterSubscriptionId },

                // Professional Plan 
                new StripePlan() { StripePlanType = Enums.StripePlanType.Tutor, 
                StripePlanLevel = Enums.StripePlanLevel.Professional, 
                StripeProductId = "price_1HMuxJLDr4O03ZvlFs1PAfjj", Description = "Professional Tutor Plan",
                SubscriptionId = professionalSubscriptionId },

                // Company Plan 
                new StripePlan() { StripePlanType = Enums.StripePlanType.Company, 
                StripePlanLevel = Enums.StripePlanLevel.Business, 
                StripeProductId = "price_1HMuvrLDr4O03Zvlnql1qwXS ", Description = "Company Plan",
                SubscriptionId = companySubscriptionId },
            };
            AddOrUpdate(db, o => o.StripeProductId, stripePlans);

            var hubs = new List<Hub>()
            {
                new Hub()
                {
                    SubDomain = "hubs0"
                },
                new Hub
                {
                    SubDomain = "hubs1"
                }
            };

            AddOrUpdate(db, o => o.SubDomain, hubs);

            var studyLevels = new List<StudyLevel>()
            {
                new StudyLevel()
                {
                    Name = "11 Plus",
                    Url = "11-plus",
                    Order = 1
                },
                new StudyLevel()
                {
                    Name = "A-Level",
                    Url = "a-level",
                    Order = 2
                },
                new StudyLevel()
                {
                    Name = "Degree",
                    Url = "degree",
                    Order = 4
                }
            };
            AddOrUpdate(db, o => o.Name, studyLevels);

            var subjects = new List<Subject>()
            {
                new Subject()
                {
                    Name = "Maths",
                    Url = "maths"
                },
                new Subject()
                {
                    Name = "Programming",
                    Url = "programming"
                },
                new Subject()
                {
                    Name = "Physics",
                    Url = "physics"
                }
            };
            AddOrUpdate(db, o => o.Name, subjects);

            subjects = db.Set<Subject>().ToList();
            var subjectCategories = new List<SubjectCategory>();
            foreach (var subject in subjects)
            {
                if (subject.Name == "Maths")
                {
                    subjectCategories.Add(new SubjectCategory()
                    {
                        SubjectId = subject.SubjectId,
                        Name = "Alegebra",
                        Url = "alegebra"
                    });
                    subjectCategories.Add(new SubjectCategory()
                    {
                        SubjectId = subject.SubjectId,
                        Name = "Limits",
                        Url = "limits"
                    });
                    subjectCategories.Add(new SubjectCategory()
                    {
                        SubjectId = subject.SubjectId,
                        Name = "Differential Equations",
                        Url = "differential-equations"
                    });
                }
                else if (subject.Name == "Programming")
                {
                    subjectCategories.Add(new SubjectCategory()
                    {
                        SubjectId = subject.SubjectId,
                        Name = "Data Structures",
                        Url = "data-structures"
                    });
                    subjectCategories.Add(new SubjectCategory()
                    {
                        SubjectId = subject.SubjectId,
                        Name = "C#",
                        Url = "c"
                    });
                    subjectCategories.Add(new SubjectCategory()
                    {
                        SubjectId = subject.SubjectId,
                        Name = "Python",
                        Url = "python"
                    });
                }
                else if (subject.Name == "Physics")
                {
                    subjectCategories.Add(new SubjectCategory()
                    {
                        SubjectId = subject.SubjectId,
                        Name = "Quantum Mechanics",
                        Url = "quantum-mechanics"
                    });
                    subjectCategories.Add(new SubjectCategory()
                    {
                        SubjectId = subject.SubjectId,
                        Name = "Semiconductor Optoelectronics",
                        Url = "semiconductor-optoelectronics"
                    });
                    subjectCategories.Add(new SubjectCategory()
                    {
                        SubjectId = subject.SubjectId,
                        Name = "Relativity",
                        Url = "relativity"
                    });
                }
            }
            AddOrUpdate(db, o => o.Name, subjectCategories);
        }

        private static void AddOrUpdate<TEntity>(
            DbEntities db,
            Func<TEntity, object> propertyToMatch, IEnumerable<TEntity> entities)
            where TEntity : class
        {
            // Query in a separate context so that we can attach existing entities as modified
            List<TEntity> existingData;
            existingData = db.Set<TEntity>().ToList();

            foreach (var item in entities)
            {
                if (existingData.Any(g => propertyToMatch(g).Equals(propertyToMatch(item))))
                {
                    var dbObj = existingData.First(g => propertyToMatch(g).Equals(propertyToMatch(item)));

                    foreach (var prop in dbObj.GetType().GetProperties().Where(o => !o.Name.Contains("Id") && !o.Name.Contains("CreatedAt") && o.CanWrite == true))
                    {
                        var newItemVal = item.GetType().GetProperties().First(o => o.Name == prop.Name).GetValue(item);

                        if (newItemVal != null)
                            prop.SetValue(dbObj, Convert.ChangeType(newItemVal, prop.PropertyType));
                    }
                    db.Entry(dbObj).State = EntityState.Modified;
                }
                else
                {
                    db.Entry(item).State = EntityState.Added;
                }
            }

            db.SaveChanges();
        }
    }
}
