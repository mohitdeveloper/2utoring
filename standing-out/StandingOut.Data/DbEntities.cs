using StandingOut.Data.Entity;
using StandingOut.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace StandingOut.Data
{
    public class DbEntities : IdentityDbContext<User>
    {
        private string Username;

        public DbEntities(DbContextOptions<DbEntities> options)
            : this(options, null)
        { }

        public DbEntities(DbContextOptions<DbEntities> options, string username)
            : base(options)
        {
            Username = string.IsNullOrWhiteSpace(username) ? "Unknown" : username;
        }

        public void SetUser(string username)
        {
            Username = string.IsNullOrWhiteSpace(username) ? "Unknown" : username;
        }

        public DbSet<Setting> Settings { get; set; }
        public DbSet<ErrorLog> ErrorLogs { get; set; }
        public DbSet<ClassSession> ClassSessions { get; set; }
        public DbSet<ClassSessionVideoRoom> ClassSessionVideoRooms { get; set; }
        public DbSet<SafeguardReport> SafeguardReports { get; set; }
        public DbSet<SessionAttendee> SessionAttendees { get; set; }
        public DbSet<SessionGroup> SessionGroups { get; set; }
        public DbSet<SessionMedia> SessionMedias { get; set; }
        public DbSet<SessionMessage> SessionMessages { get; set; }
        public DbSet<Tutor> Tutors { get; set; }
        public DbSet<SystemTool> SystemTools { get; set; }
        public DbSet<SessionOneToOneChatInstance> SessionOneToOneChatInstances { get; set; }
        public DbSet<SessionOneToOneChatInstanceUser> SessionOneToOneChatInstanceUsers { get; set; }
        public DbSet<SessionWhiteBoard> SessionWhiteBoards { get; set; }
        public DbSet<SessionWhiteBoardHistory> SessionWhiteBoardHistory { get; set; }
        public DbSet<SessionWhiteBoardSave> SessionWhiteBoardSaves { get; set; }
        public DbSet<SessionWhiteBoardSave> SessionWhiteBoardShares { get; set; }
        public DbSet<Company> Companys { get; set; }
        public DbSet<CompanyTutor> CompanyTutors { get; set; }
        public DbSet<StripePlan> StripePlans { get; set; }
        public DbSet<StripeCountry> StripeCountrys { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<SubjectCategory> SubjectCategories { get; set; }
        public DbSet<StudyLevel> StudyLevels { get; set; }
        public DbSet<TutorQualification> TutorQualifications { get; set; }
        public DbSet<TutorCertificate> TutorCertificates { get; set; }
        public DbSet<TutorSubject> TutorSubjects { get; set; }
        public DbSet<TutorSubjectStudyLevel> TutorSubjectStudyLevels { get; set; }
        public DbSet<PromoCode> PromoCodes { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<TutorSubscription> TutorSubscription { get; set; }
        public DbSet<SubscriptionFeature> SubscriptionFeatures { get; set; }

        public DbSet<CompanySubject> CompanySubjects { get; set; }
        public DbSet<CompanySubjectStudyLevel> CompanySubjectStudyLevels { get; set; }
        public DbSet<SubjectStudyLevelSetup> SubjectStudyLevelSetups { get; set; }

        public DbSet<CompanyMember> CompanyMembers { get; set; }
        public DbSet<CompanySubscription> CompanySubscriptions { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseInvite> CourseInvites { get; set; }
        public DbSet<TutorAvailability> TutorAvailabilities { get; set; }

        public DbSet<PaymentProviderFieldSet> PaymentProviderFields { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderRefund> OrderRefunds { get; set; }
        public DbSet<VendorPayout> VendorPayouts { get; set; }
        public DbSet<VendorEarning> VendorEarnings { get; set; }
        public DbSet<GoogleFilePermission> GoogleFilePermissions { get; set; }
        public DbSet<NotificationMessage> NotificationMessages { get; set; }
        public DbSet<PageNotificationMessage> PageNotificationMessages { get; set; }
        public DbSet<RoleTypeNotificationMessage> RoleTypeNotificationMessages { get; set; }
        public DbSet<SubscriptionNotificationMessage> SubscriptionNotificationMessages { get; set; }
        public DbSet<UserNotificationMessage> UserNotificationMessages { get; set; }

        public DbSet<WebsiteContact> WebsiteContacts { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SessionOneToOneChatInstanceUser>()
                .HasKey(o => new { o.UserId, o.SessionOneToOneChatInstanceId });

            modelBuilder.Entity<SessionOneToOneChatInstanceUser>()
                .HasOne(o => o.SessionOneToOneChatInstance)
                .WithMany(o => o.SessionOneToOneChatInstanceUsers)
                .HasForeignKey(o => o.SessionOneToOneChatInstanceId);

            modelBuilder.Entity<SessionOneToOneChatInstanceUser>()
                .HasOne(pt => pt.User)
                .WithMany(t => t.SessionOneToOneChatInstanceUsers)
                .HasForeignKey(pt => pt.UserId);


            



            modelBuilder.Entity<Setting>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<User>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<ErrorLog>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<Setting>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<ClassSession>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<ClassSessionVideoRoom>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SafeguardReport>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SessionAttendee>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SessionGroup>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SessionMedia>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SessionMessage>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<Tutor>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SystemTool>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SessionOneToOneChatInstance>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<Company>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<CompanyTutor>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<StripePlan>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<StripeCountry>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<Subject>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SubjectCategory>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<StudyLevel>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<TutorQualification>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<TutorCertificate>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<TutorSubject>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<TutorSubjectStudyLevel>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<PromoCode>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SessionInvite>().HasIndex(o => o.IsDeleted);

            modelBuilder.Entity<Subscription>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<Feature>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<TutorSubscription>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SubscriptionFeature>().HasIndex(o => o.IsDeleted);

            modelBuilder.Entity<CompanySubject>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<CompanySubjectStudyLevel>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<SubjectStudyLevelSetup>().HasIndex(o => o.IsDeleted);

            modelBuilder.Entity<CompanyMember>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<CompanySubscription>().HasIndex(o => o.IsDeleted);

            modelBuilder.Entity<Course>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<CourseInvite>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<TutorAvailability>().HasIndex(o => o.IsDeleted);

            modelBuilder.Entity<PaymentProviderFieldSet>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<Order>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<OrderItem>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<OrderRefund>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<VendorEarning>().HasIndex(o => o.IsDeleted);
            modelBuilder.Entity<VendorPayout>().HasIndex(o => o.IsDeleted);

            base.OnModelCreating(modelBuilder);

            //this should turn off cascade delete
            //http://stackoverflow.com/questions/33807879/ef7-rc1-disable-cascade-delete
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }

        public override int SaveChanges()
        {
            UpdateTracking();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            UpdateTracking();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTracking()
        {
            foreach (var change in ChangeTracker.Entries<EntityBase>())
            {
                if (change.State == EntityState.Added)
                {
                    change.Entity.CreatedDate = DateTime.Now;
                    change.Entity.CreatedBy = Username;
                }
                else if (change.State == EntityState.Modified)
                {
                    if (change.Property("CreatedDate").IsModified)
                    {
                        change.Property("CreatedDate").CurrentValue = change.Property("CreatedDate").OriginalValue;
                        change.Property("CreatedDate").IsModified = false;

                        //this line added because createdBy going null in DB
                        change.Property("CreatedBy").CurrentValue = change.Property("CreatedBy").OriginalValue;
                        change.Property("CreatedBy").IsModified = false;
                    }
                }

                if (change.State == EntityState.Modified || change.State == EntityState.Added)
                {
                    change.Entity.ModifiedDate = DateTime.Now;
                    change.Entity.ModifiedBy = Username;
                }
            }
        }
    }
}
