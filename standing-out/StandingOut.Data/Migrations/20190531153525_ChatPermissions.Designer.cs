﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using StandingOut.Data;

namespace StandingOut.Data.Migrations
{
    [DbContext(typeof(DbEntities))]
    [Migration("20190531153525_ChatPermissions")]
    partial class ChatPermissions
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.3-servicing-35854")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("StandingOut.Data.Models.ClassSession", b =>
                {
                    b.Property<Guid>("ClassSessionId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AppointmentId");

                    b.Property<string>("BaseStudentDirectoryId")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("BaseTutorDirectoryId")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<bool>("ChatActive");

                    b.Property<int?>("ClassId");

                    b.Property<bool>("Complete");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<DateTime?>("DueEndDate");

                    b.Property<string>("EmailContents");

                    b.Property<DateTime>("EndDate");

                    b.Property<bool>("Ended");

                    b.Property<DateTime?>("EndedAtDate");

                    b.Property<bool>("IsDeleted");

                    b.Property<bool>("MasterFilesCopied");

                    b.Property<string>("MasterStudentDirectoryId")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("MasterStudentDirectoryName")
                        .IsRequired()
                        .HasMaxLength(500);

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(500);

                    b.Property<string>("OwnerId");

                    b.Property<int>("ReadMessagesTutor");

                    b.Property<string>("SessionDirectoryId")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("SessionDirectoryName")
                        .IsRequired()
                        .HasMaxLength(500);

                    b.Property<string>("SharedStudentDirectoryId")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<DateTime>("StartDate");

                    b.Property<bool>("Started");

                    b.Property<DateTime?>("StartedAtDate");

                    b.HasKey("ClassSessionId");

                    b.HasIndex("IsDeleted");

                    b.HasIndex("OwnerId");

                    b.ToTable("ClassSessions");
                });

            modelBuilder.Entity("StandingOut.Data.Models.ClassSessionVideoRoom", b =>
                {
                    b.Property<Guid>("ClassSessionVideoRoomId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("ClassSessionId");

                    b.Property<bool>("CompositionDownloadReady");

                    b.Property<string>("CompositionSid");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<int?>("Duration");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("ParticipantSid")
                        .IsRequired()
                        .HasMaxLength(500);

                    b.Property<string>("RoomSid")
                        .IsRequired()
                        .HasMaxLength(500);

                    b.Property<string>("UserId");

                    b.HasKey("ClassSessionVideoRoomId");

                    b.HasIndex("ClassSessionId");

                    b.HasIndex("IsDeleted");

                    b.HasIndex("UserId");

                    b.ToTable("ClassSessionVideoRooms");
                });

            modelBuilder.Entity("StandingOut.Data.Models.ErrorLog", b =>
                {
                    b.Property<Guid>("ErrorLogId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<string>("InnerException")
                        .HasMaxLength(2000);

                    b.Property<string>("InnerStackTrace");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime>("LogDate");

                    b.Property<string>("Message")
                        .HasMaxLength(2000);

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("Path")
                        .HasMaxLength(2000);

                    b.Property<string>("StackTrace");

                    b.HasKey("ErrorLogId");

                    b.HasIndex("IsDeleted");

                    b.ToTable("ErrorLogs");
                });

            modelBuilder.Entity("StandingOut.Data.Models.SafeguardReport", b =>
                {
                    b.Property<Guid>("SafeguardReportId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("ClassSessionId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<string>("Description")
                        .IsRequired();

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime>("LogDate");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<int>("Status");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<string>("UserId");

                    b.HasKey("SafeguardReportId");

                    b.HasIndex("ClassSessionId");

                    b.HasIndex("IsDeleted");

                    b.HasIndex("UserId");

                    b.ToTable("SafeguardReports");
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionAttendee", b =>
                {
                    b.Property<Guid>("SessionAttendeeId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AppointmentId");

                    b.Property<bool>("Attended");

                    b.Property<bool>("AudioEnabled");

                    b.Property<bool>("CallIndividualsEnabled");

                    b.Property<bool>("ChatActive");

                    b.Property<Guid>("ClassSessionId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<bool>("GroupAudioEnabled");

                    b.Property<bool>("GroupRoomJoinEnabled");

                    b.Property<bool>("GroupVideoEnabled");

                    b.Property<bool>("HelpRequested");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("JoinDate");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<int>("ReadMessagesAll");

                    b.Property<int>("ReadMessagesGroup");

                    b.Property<bool>("RoomJoinEnabled");

                    b.Property<string>("SessionAttendeeDirectoryId")
                        .HasMaxLength(100);

                    b.Property<string>("SessionAttendeeDirectoryName")
                        .HasMaxLength(500);

                    b.Property<Guid?>("SessionGroupId");

                    b.Property<string>("UserId");

                    b.Property<bool>("VideoEnabled");

                    b.HasKey("SessionAttendeeId");

                    b.HasIndex("ClassSessionId");

                    b.HasIndex("IsDeleted");

                    b.HasIndex("SessionGroupId");

                    b.HasIndex("UserId");

                    b.ToTable("SessionAttendees");
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionGroup", b =>
                {
                    b.Property<Guid>("SessionGroupId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("ChatActive");

                    b.Property<Guid>("ClassSessionId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<int>("ReadMessagesTutor");

                    b.HasKey("SessionGroupId");

                    b.HasIndex("ClassSessionId");

                    b.HasIndex("IsDeleted");

                    b.ToTable("SessionGroups");
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionMedia", b =>
                {
                    b.Property<Guid>("SessionMediaId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("ClassSessionId");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<int>("Type");

                    b.HasKey("SessionMediaId");

                    b.HasIndex("ClassSessionId");

                    b.HasIndex("IsDeleted");

                    b.ToTable("SessionMedias");
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionMessage", b =>
                {
                    b.Property<Guid>("SessionMessageId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("ClassSessionId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<string>("FromUserId");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime>("LogDate");

                    b.Property<string>("Message")
                        .IsRequired();

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<Guid?>("SessionOneToOneChatInstanceId");

                    b.Property<Guid?>("ToGroupId");

                    b.Property<string>("ToUserId");

                    b.HasKey("SessionMessageId");

                    b.HasIndex("ClassSessionId");

                    b.HasIndex("FromUserId");

                    b.HasIndex("IsDeleted");

                    b.HasIndex("SessionOneToOneChatInstanceId");

                    b.HasIndex("ToGroupId");

                    b.HasIndex("ToUserId");

                    b.ToTable("SessionMessages");
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionOneToOneChatInstance", b =>
                {
                    b.Property<Guid>("SessionOneToOneChatInstanceId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Active");

                    b.Property<Guid>("ClassSessionId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.HasKey("SessionOneToOneChatInstanceId");

                    b.HasIndex("ClassSessionId");

                    b.HasIndex("IsDeleted");

                    b.ToTable("SessionOneToOneChatInstances");
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionOneToOneChatInstanceUser", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<Guid>("SessionOneToOneChatInstanceId");

                    b.Property<int>("ReadMessages");

                    b.HasKey("UserId", "SessionOneToOneChatInstanceId");

                    b.HasIndex("SessionOneToOneChatInstanceId");

                    b.ToTable("SessionOneToOneChatInstanceUsers");
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionWhiteBoard", b =>
                {
                    b.Property<Guid>("SessionWhiteBoardId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("ClassSessionId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<string>("CurrentCanvas")
                        .HasMaxLength(1000);

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("Name")
                        .HasMaxLength(500);

                    b.Property<Guid?>("SessionGroupId");

                    b.Property<string>("UserId");

                    b.HasKey("SessionWhiteBoardId");

                    b.HasIndex("ClassSessionId");

                    b.HasIndex("SessionGroupId");

                    b.HasIndex("UserId");

                    b.ToTable("SessionWhiteBoards");
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionWhiteBoardHistory", b =>
                {
                    b.Property<Guid>("SessionWhiteBoardHistoryId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("JsonData");

                    b.Property<DateTime>("LogDate");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<Guid>("SessionWhiteBoardId");

                    b.Property<string>("UserId");

                    b.HasKey("SessionWhiteBoardHistoryId");

                    b.HasIndex("SessionWhiteBoardId");

                    b.HasIndex("UserId");

                    b.ToTable("SessionWhiteBoardHistory");
                });

            modelBuilder.Entity("StandingOut.Data.Models.Setting", b =>
                {
                    b.Property<Guid>("SettingId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AcuitySchedulingSecret")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("AcuitySchedulingUserId")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<string>("GoogleAppName")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("GoogleClientId")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("GoogleClientSecret")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("SendGridApi")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("SendGridFromEmail")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("TwilioAccountSid")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("TwilioApiKey")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("TwilioApiSecret")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("TwilioAuthToken")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.HasKey("SettingId");

                    b.HasIndex("IsDeleted");

                    b.ToTable("Settings");
                });

            modelBuilder.Entity("StandingOut.Data.Models.SystemTool", b =>
                {
                    b.Property<Guid>("SystemToolId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("AllowMultiple");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<string>("FontAwesomeIconClass")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<string>("NgInclude")
                        .IsRequired()
                        .HasMaxLength(1000);

                    b.HasKey("SystemToolId");

                    b.HasIndex("IsDeleted");

                    b.ToTable("SystemTools");
                });

            modelBuilder.Entity("StandingOut.Data.Models.Tutor", b =>
                {
                    b.Property<Guid>("TutorId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CalendarId")
                        .HasMaxLength(500);

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.HasKey("TutorId");

                    b.HasIndex("IsDeleted");

                    b.ToTable("Tutors");
                });

            modelBuilder.Entity("StandingOut.Data.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime?>("CreatedDate");

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<string>("GoogleProfilePicture")
                        .HasMaxLength(1000);

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<Guid?>("TutorId");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("IsDeleted");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.HasIndex("TutorId");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("StandingOut.Data.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("StandingOut.Data.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("StandingOut.Data.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.ClassSession", b =>
                {
                    b.HasOne("StandingOut.Data.Models.User", "Owner")
                        .WithMany("ClassSessions")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.ClassSessionVideoRoom", b =>
                {
                    b.HasOne("StandingOut.Data.Models.ClassSession", "ClassSession")
                        .WithMany("VideoRooms")
                        .HasForeignKey("ClassSessionId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.SafeguardReport", b =>
                {
                    b.HasOne("StandingOut.Data.Models.ClassSession", "ClassSession")
                        .WithMany("SafeguardReports")
                        .HasForeignKey("ClassSessionId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.User", "User")
                        .WithMany("SafeguardReports")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionAttendee", b =>
                {
                    b.HasOne("StandingOut.Data.Models.ClassSession", "ClassSession")
                        .WithMany("SessionAttendees")
                        .HasForeignKey("ClassSessionId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.SessionGroup", "SessionGroup")
                        .WithMany("SessionAttendees")
                        .HasForeignKey("SessionGroupId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.User", "User")
                        .WithMany("SessionAttendees")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionGroup", b =>
                {
                    b.HasOne("StandingOut.Data.Models.ClassSession", "ClassSession")
                        .WithMany("SessionGroups")
                        .HasForeignKey("ClassSessionId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionMedia", b =>
                {
                    b.HasOne("StandingOut.Data.Models.ClassSession", "ClassSession")
                        .WithMany("SessionMedia")
                        .HasForeignKey("ClassSessionId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionMessage", b =>
                {
                    b.HasOne("StandingOut.Data.Models.ClassSession", "ClassSession")
                        .WithMany("SessionMessages")
                        .HasForeignKey("ClassSessionId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.User", "FromUser")
                        .WithMany()
                        .HasForeignKey("FromUserId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.SessionOneToOneChatInstance", "SessionOneToOneChatInstance")
                        .WithMany("SessionMessages")
                        .HasForeignKey("SessionOneToOneChatInstanceId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.SessionGroup", "ToGroup")
                        .WithMany()
                        .HasForeignKey("ToGroupId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.User", "ToUser")
                        .WithMany()
                        .HasForeignKey("ToUserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionOneToOneChatInstance", b =>
                {
                    b.HasOne("StandingOut.Data.Models.ClassSession", "ClassSession")
                        .WithMany()
                        .HasForeignKey("ClassSessionId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionOneToOneChatInstanceUser", b =>
                {
                    b.HasOne("StandingOut.Data.Models.SessionOneToOneChatInstance", "SessionOneToOneChatInstance")
                        .WithMany("SessionOneToOneChatInstanceUsers")
                        .HasForeignKey("SessionOneToOneChatInstanceId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.User", "User")
                        .WithMany("SessionOneToOneChatInstanceUsers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionWhiteBoard", b =>
                {
                    b.HasOne("StandingOut.Data.Models.ClassSession", "ClassSession")
                        .WithMany("SessionWhiteBoards")
                        .HasForeignKey("ClassSessionId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.SessionGroup", "SessionGroup")
                        .WithMany("SessionWhiteBoards")
                        .HasForeignKey("SessionGroupId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.User", "User")
                        .WithMany("SessionWhiteBoards")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.SessionWhiteBoardHistory", b =>
                {
                    b.HasOne("StandingOut.Data.Models.SessionWhiteBoard", "SessionWhiteBoard")
                        .WithMany("History")
                        .HasForeignKey("SessionWhiteBoardId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("StandingOut.Data.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("StandingOut.Data.Models.User", b =>
                {
                    b.HasOne("StandingOut.Data.Models.Tutor", "Tutor")
                        .WithMany("Users")
                        .HasForeignKey("TutorId")
                        .OnDelete(DeleteBehavior.Restrict);
                });
#pragma warning restore 612, 618
        }
    }
}
