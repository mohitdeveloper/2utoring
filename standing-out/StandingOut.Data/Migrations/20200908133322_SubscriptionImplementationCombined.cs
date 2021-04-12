using System;
using Microsoft.EntityFrameworkCore.Migrations;
using StandingOut.Data.Enums;

namespace StandingOut.Data.Migrations
{
    public partial class SubscriptionImplementationCombined : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FreeDays",
                table: "StripePlans",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SubscriptionId",
                table: "StripePlans",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ActualEndDate",
                table: "CompanyTutors",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ActualStartDate",
                table: "CompanyTutors",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PreferredEndDate",
                table: "CompanyTutors",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PreferredStartDate",
                table: "CompanyTutors",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddressLine1",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddressLine2",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AdminUserId",
                table: "Companys",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Companys",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmailAddress",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "InitialRegistrationComplete",
                table: "Companys",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "InitialRegistrationStep",
                table: "Companys",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastTimeStripeSubscriptionChecked",
                table: "Companys",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "MarketingAccepted",
                table: "Companys",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "MobileNumber",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentAddressLine1",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentPostcode",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PaymentStatus",
                table: "Companys",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Postcode",
                table: "Companys",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageFileLocation",
                table: "Companys",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageFileName",
                table: "Companys",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PromoCode",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegistrationNo",
                table: "Companys",
                maxLength: 250,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Companys",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripeConnectAccountId",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripeConnectBankAccountId",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripeCustomerId",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StripePlanId",
                table: "Companys",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripeSubscriptionId",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TelephoneNumber",
                table: "Companys",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TermsAndConditionsAccepted",
                table: "Companys",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UrlSlug",
                table: "Companys",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhatWeDo",
                table: "Companys",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhoWeAre",
                table: "Companys",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhyChooseUs",
                table: "Companys",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhyWeDoIt",
                table: "Companys",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CourseId",
                table: "ClassSessions",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CompanyMember",
                columns: table => new
                {
                    CompanyTeamId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 250, nullable: false),
                    Role = table.Column<string>(maxLength: 250, nullable: false),
                    Description = table.Column<string>(maxLength: 2000, nullable: true),
                    ImageName = table.Column<string>(maxLength: 250, nullable: true),
                    ImageDirectory = table.Column<string>(maxLength: 1000, nullable: true),
                    ProfileImageFileLocation = table.Column<string>(nullable: true),
                    ProfileImageFileName = table.Column<string>(maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyMember", x => x.CompanyTeamId);
                    table.ForeignKey(
                        name: "FK_CompanyMember_Companys_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companys",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CompanySubjects",
                columns: table => new
                {
                    CompanySubjectId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    SubjectId = table.Column<Guid>(nullable: false),
                    SubjectCategoryId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanySubjects", x => x.CompanySubjectId);
                    table.ForeignKey(
                        name: "FK_CompanySubjects_Companys_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companys",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CompanySubjects_SubjectCategories_SubjectCategoryId",
                        column: x => x.SubjectCategoryId,
                        principalTable: "SubjectCategories",
                        principalColumn: "SubjectCategoryId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CompanySubjects_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "SubjectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    CourseId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CreatorUserId = table.Column<string>(nullable: true),
                    TutorId = table.Column<Guid>(nullable: true),
                    CompanyId = table.Column<Guid>(nullable: true),
                    Name = table.Column<string>(maxLength: 500, nullable: false),
                    SubjectId = table.Column<Guid>(nullable: false),
                    SubjectCategoryId = table.Column<Guid>(nullable: true),
                    StudyLevelId = table.Column<Guid>(nullable: false),
                    MaxClassSize = table.Column<int>(nullable: false),
                    Description = table.Column<string>(maxLength: 2000, nullable: true),
                    PricePerPerson = table.Column<decimal>(type: "decimal(13,2)", nullable: false),
                    IsUnder18 = table.Column<bool>(nullable: false),
                    CourseType = table.Column<int>(nullable: false),
                    StartDate = table.Column<DateTimeOffset>(nullable: true),
                    EndDate = table.Column<DateTimeOffset>(nullable: true),
                    RequiresGoogleAccount = table.Column<bool>(nullable: true),
                    Started = table.Column<bool>(nullable: false),
                    Completed = table.Column<bool>(nullable: false),
                    Cancelled = table.Column<bool>(nullable: false),
                    Published = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.CourseId);
                    table.ForeignKey(
                        name: "FK_Courses_Companys_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companys",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Courses_AspNetUsers_CreatorUserId",
                        column: x => x.CreatorUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Courses_StudyLevels_StudyLevelId",
                        column: x => x.StudyLevelId,
                        principalTable: "StudyLevels",
                        principalColumn: "StudyLevelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Courses_SubjectCategories_SubjectCategoryId",
                        column: x => x.SubjectCategoryId,
                        principalTable: "SubjectCategories",
                        principalColumn: "SubjectCategoryId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Courses_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "SubjectId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Courses_Tutors_TutorId",
                        column: x => x.TutorId,
                        principalTable: "Tutors",
                        principalColumn: "TutorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Features",
                columns: table => new
                {
                    FeatureId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 2000, nullable: false),
                    Description = table.Column<string>(nullable: true),
                    FeatureArea = table.Column<string>(maxLength: 2000, nullable: false),
                    Context = table.Column<string>(maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Features", x => x.FeatureId);
                });

            migrationBuilder.CreateTable(
                name: "SubjectStudyLevelSetups",
                columns: table => new
                {
                    SubjectStudyLevelSetupId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: true),
                    TutorId = table.Column<Guid>(nullable: true),
                    SubjectId = table.Column<Guid>(nullable: false),
                    StudyLevelId = table.Column<Guid>(nullable: false),
                    PricePerPerson = table.Column<decimal>(type: "decimal(13,4)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubjectStudyLevelSetups", x => x.SubjectStudyLevelSetupId);
                    table.ForeignKey(
                        name: "FK_SubjectStudyLevelSetups_Companys_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companys",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubjectStudyLevelSetups_StudyLevels_StudyLevelId",
                        column: x => x.StudyLevelId,
                        principalTable: "StudyLevels",
                        principalColumn: "StudyLevelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubjectStudyLevelSetups_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "SubjectId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubjectStudyLevelSetups_Tutors_TutorId",
                        column: x => x.TutorId,
                        principalTable: "Tutors",
                        principalColumn: "TutorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Subscriptions",
                columns: table => new
                {
                    SubscriptionId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    SubscriptionName = table.Column<string>(maxLength: 2000, nullable: false),
                    Description = table.Column<string>(nullable: true),
                    SubscriptionPrice = table.Column<decimal>(type: "decimal(13,4)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subscriptions", x => x.SubscriptionId);
                });

            migrationBuilder.CreateTable(
                name: "TutorAvailabilities",
                columns: table => new
                {
                    TutorAvailabilityId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    TutorId = table.Column<Guid>(nullable: false),
                    DayOfWeek = table.Column<int>(nullable: false),
                    SpecificDate = table.Column<DateTimeOffset>(nullable: true),
                    StartTime = table.Column<DateTime>(nullable: false),
                    EndTime = table.Column<DateTime>(nullable: false),
                    SlotType = table.Column<int>(nullable: false),
                    SlotDescription = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorAvailabilities", x => x.TutorAvailabilityId);
                    table.ForeignKey(
                        name: "FK_TutorAvailabilities_Tutors_TutorId",
                        column: x => x.TutorId,
                        principalTable: "Tutors",
                        principalColumn: "TutorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CompanySubjectStudyLevels",
                columns: table => new
                {
                    CompanySubjectStudyLevelId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CompanySubjectId = table.Column<Guid>(nullable: false),
                    StudyLevelId = table.Column<Guid>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanySubjectStudyLevels", x => x.CompanySubjectStudyLevelId);
                    table.ForeignKey(
                        name: "FK_CompanySubjectStudyLevels_Companys_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companys",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CompanySubjectStudyLevels_CompanySubjects_CompanySubjectId",
                        column: x => x.CompanySubjectId,
                        principalTable: "CompanySubjects",
                        principalColumn: "CompanySubjectId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CompanySubjectStudyLevels_StudyLevels_StudyLevelId",
                        column: x => x.StudyLevelId,
                        principalTable: "StudyLevels",
                        principalColumn: "StudyLevelId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CourseInvites",
                columns: table => new
                {
                    CourseInviteId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CourseId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    Email = table.Column<string>(maxLength: 250, nullable: false),
                    InviteSent = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseInvites", x => x.CourseInviteId);
                    table.ForeignKey(
                        name: "FK_CourseInvites_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseInvites_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CompanySubscription",
                columns: table => new
                {
                    CompanySubscriptionId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    SubscriptionId = table.Column<Guid>(nullable: false),
                    StartDateTime = table.Column<DateTime>(nullable: true),
                    EndDateTime = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanySubscription", x => x.CompanySubscriptionId);
                    table.ForeignKey(
                        name: "FK_CompanySubscription_Companys_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companys",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CompanySubscription_Subscriptions_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalTable: "Subscriptions",
                        principalColumn: "SubscriptionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionFeatures",
                columns: table => new
                {
                    SubscriptionFeatureId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    SubscriptionId = table.Column<Guid>(nullable: false),
                    FeatureId = table.Column<Guid>(nullable: false),
                    Setting = table.Column<string>(maxLength: 2000, nullable: true),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionFeatures", x => x.SubscriptionFeatureId);
                    table.ForeignKey(
                        name: "FK_SubscriptionFeatures_Features_FeatureId",
                        column: x => x.FeatureId,
                        principalTable: "Features",
                        principalColumn: "FeatureId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubscriptionFeatures_Subscriptions_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalTable: "Subscriptions",
                        principalColumn: "SubscriptionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TutorSubscription",
                columns: table => new
                {
                    TutorSubscriptionId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    TutorId = table.Column<Guid>(nullable: false),
                    SubscriptionId = table.Column<Guid>(nullable: false),
                    StartDateTime = table.Column<DateTime>(nullable: true),
                    EndDateTime = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorSubscription", x => x.TutorSubscriptionId);
                    table.ForeignKey(
                        name: "FK_TutorSubscription_Subscriptions_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalTable: "Subscriptions",
                        principalColumn: "SubscriptionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TutorSubscription_Tutors_TutorId",
                        column: x => x.TutorId,
                        principalTable: "Tutors",
                        principalColumn: "TutorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StripePlans_SubscriptionId",
                table: "StripePlans",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_Companys_AdminUserId",
                table: "Companys",
                column: "AdminUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Companys_StripePlanId",
                table: "Companys",
                column: "StripePlanId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassSessions_CourseId",
                table: "ClassSessions",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyMember_CompanyId",
                table: "CompanyMember",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyMember_IsDeleted",
                table: "CompanyMember",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubjects_CompanyId",
                table: "CompanySubjects",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubjects_IsDeleted",
                table: "CompanySubjects",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubjects_SubjectCategoryId",
                table: "CompanySubjects",
                column: "SubjectCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubjects_SubjectId",
                table: "CompanySubjects",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubjectStudyLevels_CompanyId",
                table: "CompanySubjectStudyLevels",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubjectStudyLevels_CompanySubjectId",
                table: "CompanySubjectStudyLevels",
                column: "CompanySubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubjectStudyLevels_IsDeleted",
                table: "CompanySubjectStudyLevels",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubjectStudyLevels_StudyLevelId",
                table: "CompanySubjectStudyLevels",
                column: "StudyLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubscription_CompanyId",
                table: "CompanySubscription",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubscription_IsDeleted",
                table: "CompanySubscription",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_CompanySubscription_SubscriptionId",
                table: "CompanySubscription",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseInvites_CourseId",
                table: "CourseInvites",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseInvites_IsDeleted",
                table: "CourseInvites",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_CourseInvites_UserId",
                table: "CourseInvites",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CompanyId",
                table: "Courses",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CreatorUserId",
                table: "Courses",
                column: "CreatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_IsDeleted",
                table: "Courses",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_StudyLevelId",
                table: "Courses",
                column: "StudyLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_SubjectCategoryId",
                table: "Courses",
                column: "SubjectCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_SubjectId",
                table: "Courses",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_TutorId",
                table: "Courses",
                column: "TutorId");

            migrationBuilder.CreateIndex(
                name: "IX_Features_IsDeleted",
                table: "Features",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectStudyLevelSetups_CompanyId",
                table: "SubjectStudyLevelSetups",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectStudyLevelSetups_IsDeleted",
                table: "SubjectStudyLevelSetups",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectStudyLevelSetups_StudyLevelId",
                table: "SubjectStudyLevelSetups",
                column: "StudyLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectStudyLevelSetups_SubjectId",
                table: "SubjectStudyLevelSetups",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectStudyLevelSetups_TutorId",
                table: "SubjectStudyLevelSetups",
                column: "TutorId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionFeatures_FeatureId",
                table: "SubscriptionFeatures",
                column: "FeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionFeatures_IsDeleted",
                table: "SubscriptionFeatures",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionFeatures_SubscriptionId",
                table: "SubscriptionFeatures",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_IsDeleted",
                table: "Subscriptions",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_TutorAvailabilities_IsDeleted",
                table: "TutorAvailabilities",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_TutorAvailabilities_TutorId",
                table: "TutorAvailabilities",
                column: "TutorId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubscription_IsDeleted",
                table: "TutorSubscription",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubscription_SubscriptionId",
                table: "TutorSubscription",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubscription_TutorId",
                table: "TutorSubscription",
                column: "TutorId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSessions_Courses_CourseId",
                table: "ClassSessions",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "CourseId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Companys_AspNetUsers_AdminUserId",
                table: "Companys",
                column: "AdminUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Companys_StripePlans_StripePlanId",
                table: "Companys",
                column: "StripePlanId",
                principalTable: "StripePlans",
                principalColumn: "StripePlanId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StripePlans_Subscriptions_SubscriptionId",
                table: "StripePlans",
                column: "SubscriptionId",
                principalTable: "Subscriptions",
                principalColumn: "SubscriptionId",
                onDelete: ReferentialAction.Restrict);

            // EXECUTE Other Scripts: Setup new StripePlans, Subscriptions, Features and Setup Subscription features by Plan and update existing Tutor Subscription to Professional Plan 
            UpdatePrivateTutorStripePlanDescription(migrationBuilder);

            Create_Four_New_StripePlans(migrationBuilder); // 1 Private plan kept as is.

            Create_Five_New_Subscriptions(migrationBuilder);

            Create_36_New_Features(migrationBuilder);

            Link_StripePlans_To_Subscriptions(migrationBuilder);

            // Setup Subscription features by Plan 
            Setup_FeaturesFor_PrivateTutorPlan(migrationBuilder);
            Setup_FeaturesFor_NoFeeTutorPlan(migrationBuilder);
            Setup_FeaturesFor_StarterTutorPlan(migrationBuilder);
            Setup_FeaturesFor_ProfessionalTutorPlan(migrationBuilder);
            Setup_FeaturesFor_CompanyPlan(migrationBuilder);

            var env = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (!string.IsNullOrEmpty(env) && env.ToUpperInvariant() == "DEVELOPMENT")
            {
                UpdateExistingTutorsToBeOnSpecifiedTutorPlan(migrationBuilder, SubscriptionPlans.ProfessionalTutorPlan.ToString());
            }
            else // For LIVE set them to be on Starter plan
            {
                UpdateExistingTutorsToBeOnSpecifiedTutorPlan(migrationBuilder, SubscriptionPlans.StarterTutorPlan.ToString());
            }
        }

        private void UpdatePrivateTutorStripePlanDescription(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"Update StripePlans Set Description = 'Private tutor plan' Where StripePlanId = '81070046-8DC3-4CA9-3129-08D7E6C57421'";
            migrationBuilder.Sql(sqlStatement);
        }

        private void Create_Four_New_StripePlans(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                Insert Into [dbo].[StripePlans](StripePlanId, StripePlanType, StripePlanLevel, StripeProductId, Description, IsDeleted)
	                Values
	                ('1B503C8E-972E-4C5F-BB81-69E74DFDF947', 1, 3, 'price_1HMuvrLDr4O03Zvlnql1qwXS', 'Company Plan', 0),
	                ('FAE8397A-98CC-4CDA-8865-BDF5E279EB96', 0, 2, 'price_1HMuxJLDr4O03ZvlFs1PAfjj', 'Professional Tutor Plan', 0),
	                ('35612992-A2CB-45AE-A9E9-433F928DB119', 0, 1, 'price_1HMuzQLDr4O03Zvlb8XPeMZt', 'No Fee Tutor Plan', 0),
	                ('058C4FDC-43FE-410F-87C2-13EDDF96F2E2', 0, 0, 'price_1HMuyeLDr4O03Zvlx67Ogo0Z', 'Starter Tutor Plan', 0)
                ";

            migrationBuilder.Sql(sqlStatement);
        }

        private void Create_Five_New_Subscriptions(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                Insert Into [dbo].[Subscriptions](SubscriptionId, SubscriptionName, Description, SubscriptionPrice, IsDeleted)
	                Values
	                ('7EB85686-4FF8-46B6-8F0E-6E958249B7FF', 'NoFeeTutorPlan', 'No Fee Tutor Plan', 0.0, 0),
	                ('DCEF0896-A7D0-4FAC-91F0-AB957C2F37D8', 'StarterTutorPlan', 'Starter Tutor Plan', 5.99, 0),
	                ('A4520A7C-AD29-4E53-B55E-76B564FAFFEE', 'ProfessionalTutorPlan', 'Professional Tutor Plan', 9.99, 0),
	                ('1D0D0CAE-103E-417B-9A36-19981B842514', 'CompanyPlan', 'Company Plan', 49.99, 0),
	                ('8F621B6B-4D80-4AC8-B604-9FA8C04E0691', 'PrivateTutorPlan', 'Private Tutor Plan', 5.99, 0)
            ";
            migrationBuilder.Sql(sqlStatement);
        }

        private void Create_36_New_Features(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                Insert Into [dbo].[Features](FeatureId, [Name],FeatureArea, Context, IsDeleted) 
	                Values 
		                (NewID(),'ClassSize',			'TutorDashboard','CreateLesson', 0),
		                (NewID(),'ClassSize',			'TutorDashboard','EditLesson', 0),
		                (NewID(),'Course',				'TutorDashboard','CreateCourse', 0),
		                (NewID(),'Course',				'TutorDashboard','EditCourse', 0),
		                (NewID(),'Course',				'Website','CreateCourse', 0),
		                (NewID(),'Course',				'Website','BuyCourse', 0),
		                (NewID(),'PrivateLessons',		'TutorDashboard','CreateLesson', 0),
		                (NewID(),'PrivateLessons',		'TutorDashboard','EditLesson', 0),
		                (NewID(),'PrivateLessons',		'TutorDashboard','CreateCourse', 0),
		                (NewID(),'PrivateLessons',		'TutorDashboard','EditCourse', 0),
		                (NewID(),'MinutesBeforeEntry',	'Classroom','ClassroomEntryTime', 0),
		                (NewID(),'GroupSize',			'ClassroomTutorCommand','Groups', 0),
		                (NewID(),'GroupSize',			'TutorDashboard', 'Lesson', 0),
		                (NewID(),'TriPane',				'ClassroomMenu','Panes', 0),
		                (NewID(),'QuadPane',				'ClassroomMenu' , 'Panes', 0),
		                (NewID(),'ProfileLink',			'Website','TutorProfile', 0),
		                (NewID(),'ProfilePage',			'Website','TutorProfile', 0),
		                (NewID(),'Availability',		'TutorDashboard','CreateCourse', 0),
		                (NewID(),'Availability',		'TutorDashboard','EditCourse', 0),
		                (NewID(),'Availability',		'Website','CreateCourse', 0),
		                (NewID(),'Availability',		'Website','BuyCourse', 0),
		                (NewID(),'ClientBooking',		'Website','CreateLesson', 0),
		                (NewID(),'ClientBooking',		'Website','CreateCourse', 0),
		                (NewID(),'SessionRecording',	'Classroom','EnterClass', 0),
		                (NewID(),'CommissionPerStudent',					'Admin','1', 0),
		                (NewID(),'CommissionPerStudent',					'Admin','2', 0),
		                (NewID(),'CommissionPerStudent',					'Admin','3', 0),
		                (NewID(),'CommissionPerStudent',					'Admin','4', 0),
		                (NewID(),'CommissionPerStudent',					'Admin','5', 0),
		                (NewID(),'CommissionPerStudent',					'Admin','6', 0),
		                (NewID(),'CommissionPerStudent',					'Admin','7', 0),
		                (NewID(),'CommissionPerStudent',					'Admin','8', 0),
		                (NewID(),'CommissionPerStudent',					'Admin','9', 0),
		                (NewID(),'CommissionPerStudent',					'Admin','10', 0),
		                (NewID(),'CompletedLesson',		'TutorDashboard','View', 0),
		                (NewID(),'CompletedLesson',		'StudentDashboard','View', 0)
            ";
            migrationBuilder.Sql(sqlStatement);
        }

        private void Link_StripePlans_To_Subscriptions(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                -- // Private Tutor Plan free days 90
                Update StripePlans Set SubscriptionId = '8F621B6B-4D80-4AC8-B604-9FA8C04E0691' , FreeDays = 90
								                Where SubscriptionId is null and StripePlanId = '81070046-8DC3-4CA9-3129-08D7E6C57421'
                -- // Company Plan
                Update StripePlans Set SubscriptionId = '1D0D0CAE-103E-417B-9A36-19981B842514' -- , FreeDays = TBC
								                Where SubscriptionId is null and StripePlanId = '1B503C8E-972E-4C5F-BB81-69E74DFDF947'
                -- // Professional Plan
                Update StripePlans Set SubscriptionId = 'A4520A7C-AD29-4E53-B55E-76B564FAFFEE' -- , FreeDays = TBC
								                Where SubscriptionId is null and StripePlanId = 'FAE8397A-98CC-4CDA-8865-BDF5E279EB96'
                -- // Starter Tutor Plan 
                Update StripePlans Set SubscriptionId = 'DCEF0896-A7D0-4FAC-91F0-AB957C2F37D8' -- , FreeDays = TBC
								                Where SubscriptionId is null and StripePlanId = '058C4FDC-43FE-410F-87C2-13EDDF96F2E2'
                -- // No Fee Plan
                Update StripePlans Set SubscriptionId = '7EB85686-4FF8-46B6-8F0E-6E958249B7FF' -- , FreeDays = TBC
								                Where SubscriptionId is null and StripePlanId = '35612992-A2CB-45AE-A9E9-433F928DB119'

            ";
            migrationBuilder.Sql(sqlStatement);
        }


        private void Setup_FeaturesFor_PrivateTutorPlan(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                    Declare @RowDone int = 0

                    Declare @subsId nvarchar(1000)
                    Select @subsId = s.SubscriptionId from Subscriptions s Where s.SubscriptionName = 'PrivateTutorPlan' 
                    -- Select @subsId

                    Declare @FeatureId nvarchar(1000)

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateLesson'		AND f.[Name]='ClassSize'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditLesson'			AND f.[Name]='ClassSize'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='Course'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='Course'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='Course'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='BuyCourse'			AND f.[Name]='Course'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateLesson'		AND f.[Name]='PrivateLessons'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditLesson'			AND f.[Name]='PrivateLessons'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='PrivateLessons'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='PrivateLessons'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'				AND f.Context='ClassroomEntryTime'	AND f.[Name]='MinutesBeforeEntry'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'15',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomTutorCommand'	AND f.Context='Groups'				AND f.[Name]='GroupSize'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='TutorDashboard'		AND f.Context='Lesson'					AND  f.[Name]='GroupSize'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'			AND f.Context='Panes'				AND  f.[Name]='TriPane'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'			AND f.Context='Panes'				AND  f.[Name]='QuadPane'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='TutorProfile'		AND f.[Name]='ProfileLink'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='TutorProfile'		AND f.[Name]='ProfilePage'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='Availability'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='Availability'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='Availability'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='BuyCourse'			AND f.[Name]='Availability'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateLesson'		AND f.[Name]='ClientBooking'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='ClientBooking'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'				AND f.Context='EnterClass'			AND f.[Name]='SessionRecording'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='1'					AND f.[Name]='CommissionPerStudent'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Admin'					AND f.Context='2'					AND  f.[Name]='CommissionPerStudent'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='3'					AND f.[Name]='CommissionPerStudent'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'27',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='4'					AND f.[Name]='CommissionPerStudent'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'27',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='5'					AND f.[Name]='CommissionPerStudent'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='6'					AND f.[Name]='CommissionPerStudent'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='7'					AND f.[Name]='CommissionPerStudent'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='8'					AND f.[Name]='CommissionPerStudent'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='9'					AND f.[Name]='CommissionPerStudent'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='10'					AND f.[Name]='CommissionPerStudent'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='View'				AND f.[Name]='CompletedLesson'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;

                    Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='StudentDashboard'		AND f.Context='View'				AND f.[Name]='CompletedLesson'
                    Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                    Select @RowDone = @RowDone + 1;
                ";
            migrationBuilder.Sql(sqlStatement);
        }
        private void Setup_FeaturesFor_NoFeeTutorPlan(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                Declare @RowDone int = 0

                Declare @subsId nvarchar(1000)
                Select @subsId = s.SubscriptionId from Subscriptions s Where s.SubscriptionName = 'NoFeeTutorPlan' 
                -- Select @subsId

                Declare @FeatureId nvarchar(1000)

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateLesson'		AND f.[Name]='ClassSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditLesson'			AND f.[Name]='ClassSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='BuyCourse'			AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateLesson'		AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditLesson'			AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'				AND f.Context='ClassroomEntryTime'	AND f.[Name]='MinutesBeforeEntry'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomTutorCommand'	AND f.Context='Groups'				AND f.[Name]='GroupSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'0',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='TutorDashboard'		AND f.Context='Lesson'					AND  f.[Name]='GroupSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'0',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'			AND f.Context='Panes'				AND f.[Name]='TriPane'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'			AND f.Context='Panes'				AND  f.[Name]='QuadPane'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='TutorProfile'		AND f.[Name]='ProfileLink'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='TutorProfile'		AND f.[Name]='ProfilePage'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='BuyCourse'			AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateLesson'		AND f.[Name]='ClientBooking'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='ClientBooking'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'				AND f.Context='EnterClass'			AND f.[Name]='SessionRecording'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='1'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Admin'					AND f.Context='2'					AND  f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='3'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='4'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='5'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='6'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='7'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='8'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='9'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='10'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='View'				AND f.[Name]='CompletedLesson'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='StudentDashboard'		AND f.Context='View'				AND f.[Name]='CompletedLesson'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;
                ";
            migrationBuilder.Sql(sqlStatement);
        }
        private void Setup_FeaturesFor_StarterTutorPlan(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                Declare @RowDone int = 0

                Declare @subsId nvarchar(1000)
                Select @subsId = s.SubscriptionId from Subscriptions s Where s.SubscriptionName = 'StarterTutorPlan' 
                -- Select @subsId

                Declare @FeatureId nvarchar(1000)

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateLesson'		AND f.[Name]='ClassSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditLesson'			AND f.[Name]='ClassSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='BuyCourse'			AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateLesson'		AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditLesson'			AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'				AND f.Context='ClassroomEntryTime'	AND f.[Name]='MinutesBeforeEntry'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'15',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomTutorCommand'	AND f.Context='Groups'				AND f.[Name]='GroupSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='TutorDashboard'		AND f.Context='Lesson'					AND  f.[Name]='GroupSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'			AND f.Context='Panes'				AND  f.[Name]='TriPane'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'			AND f.Context='Panes'				AND  f.[Name]='QuadPane'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='TutorProfile'		AND f.[Name]='ProfileLink'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='TutorProfile'		AND f.[Name]='ProfilePage'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='BuyCourse'			AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateLesson'		AND f.[Name]='ClientBooking'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='ClientBooking'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'				AND f.Context='EnterClass'			AND f.[Name]='SessionRecording'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='1'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Admin'					AND f.Context='2'					AND  f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='3'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'27',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='4'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'27',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='5'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='6'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='7'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='8'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='9'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='10'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='View'				AND f.[Name]='CompletedLesson'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='StudentDashboard'		AND f.Context='View'				AND f.[Name]='CompletedLesson'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	                Select @RowDone = @RowDone + 1;
                ";
            migrationBuilder.Sql(sqlStatement);
        }
        private void Setup_FeaturesFor_ProfessionalTutorPlan(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                Declare @RowDone int = 0

                Declare @subsId nvarchar(1000)
                Select @subsId = s.SubscriptionId from Subscriptions s Where s.SubscriptionName = 'ProfessionalTutorPlan' 
                -- Select @subsId

                Declare @FeatureId nvarchar(1000)

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateLesson'		AND f.[Name]='ClassSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'10',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditLesson'			AND f.[Name]='ClassSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'10',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='BuyCourse'			AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateLesson'		AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditLesson'			AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'				AND f.Context='ClassroomEntryTime'	AND f.[Name]='MinutesBeforeEntry'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomTutorCommand'	AND f.Context='Groups'				AND f.[Name]='GroupSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='TutorDashboard'		AND f.Context='Lesson'					AND  f.[Name]='GroupSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'			AND f.Context='Panes'				AND f.[Name]='TriPane'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'			AND f.Context='Panes'				AND  f.[Name]='QuadPane'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='TutorProfile'		AND f.[Name]='ProfileLink'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='TutorProfile'		AND f.[Name]='ProfilePage'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='BuyCourse'			AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateLesson'		AND f.[Name]='ClientBooking'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='ClientBooking'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'				AND f.Context='EnterClass'			AND f.[Name]='SessionRecording'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='1'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Admin'					AND f.Context='2'					AND  f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='3'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='4'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='5'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='6'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='7'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='8'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='9'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='10'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='View'				AND f.[Name]='CompletedLesson'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='StudentDashboard'		AND f.Context='View'				AND f.[Name]='CompletedLesson'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;
                ";
            migrationBuilder.Sql(sqlStatement);
        }
        private void Setup_FeaturesFor_CompanyPlan(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                Declare @RowDone int = 0

                Declare @subsId nvarchar(1000)
                Select @subsId = s.SubscriptionId from Subscriptions s Where s.SubscriptionName = 'CompanyPlan' 
                -- Select @subsId

                Declare @FeatureId nvarchar(1000)

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateLesson'		AND f.[Name]='ClassSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'10',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditLesson'			AND f.[Name]='ClassSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'10',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='BuyCourse'			AND f.[Name]='Course'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateLesson'		AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditLesson'			AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='PrivateLessons'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'				AND f.Context='ClassroomEntryTime'	AND f.[Name]='MinutesBeforeEntry'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomTutorCommand'	AND f.Context='Groups'				AND f.[Name]='GroupSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='TutorDashboard'		AND f.Context='Lesson'					AND  f.[Name]='GroupSize'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'			AND f.Context='Panes'				AND f.[Name]='TriPane'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'			AND f.Context='Panes'				AND  f.[Name]='QuadPane'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='TutorProfile'		AND f.[Name]='ProfileLink'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='TutorProfile'		AND f.[Name]='ProfilePage'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='CreateCourse'		AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='EditCourse'			AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='BuyCourse'			AND f.[Name]='Availability'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateLesson'		AND f.[Name]='ClientBooking'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'					AND f.Context='CreateCourse'		AND f.[Name]='ClientBooking'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'				AND f.Context='EnterClass'			AND f.[Name]='SessionRecording'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='1'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Admin'					AND f.Context='2'					AND  f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='3'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='4'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='5'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='6'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='7'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='8'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='9'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'					AND f.Context='10'					AND f.[Name]='CommissionPerStudent'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'			AND f.Context='View'				AND f.[Name]='CompletedLesson'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;

                Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='StudentDashboard'		AND f.Context='View'				AND f.[Name]='CompletedLesson'
                Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	                Select @RowDone = @RowDone + 1;
                ";
            migrationBuilder.Sql(sqlStatement);
        }

        private void UpdateExistingTutorsToBeOnSpecifiedTutorPlan(MigrationBuilder migrationBuilder, string planName = "ProfessionalTutorPlan")
        {
            var sqlStatement = @$"
                Insert Into TutorSubscription (TutorSubscriptionId, TutorId, SubscriptionId, StartDateTime, IsDeleted)
                Select NewId(), t.TutorId, (Select Top 1 s.SubscriptionId from Subscriptions s Where s.SubscriptionName = '{planName}'), GETUTCDATE(), 0
	                From Tutors t Left Join TutorSubscription ts on t.TutorId = ts.TutorId
	                Where ts.SubscriptionId is null
            ";
            migrationBuilder.Sql(sqlStatement);

            // Update the Tutor.StripePlanId to match their stripeplan as per their TutorSubscription setup above
            // DISCUSSED with Sukh 09Sep20, we are going to lose their old StripePlanId and he's ok with that.
            sqlStatement = @"
                Update Tutors Set StripePlanId = 
                (Select Top 1 StripePlanId from TutorSubscription ts, StripePlans sp
	                Where ts.SubscriptionId = sp.SubscriptionId
	                AND ts.TutorId = Tutors.TutorId)
            ";
            migrationBuilder.Sql(sqlStatement);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            NullifyPrivateTutorStripePlanSubscriptionId(migrationBuilder);
            ResetTutorsStripePlansToStarter(migrationBuilder);
            DeleteThe4NewStripePlans(migrationBuilder);

            migrationBuilder.DropForeignKey(
                name: "FK_ClassSessions_Courses_CourseId",
                table: "ClassSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_Companys_AspNetUsers_AdminUserId",
                table: "Companys");

            migrationBuilder.DropForeignKey(
                name: "FK_Companys_StripePlans_StripePlanId",
                table: "Companys");

            migrationBuilder.DropForeignKey(
                name: "FK_StripePlans_Subscriptions_SubscriptionId",
                table: "StripePlans");

            migrationBuilder.DropTable(
                name: "CompanyMember");

            migrationBuilder.DropTable(
                name: "CompanySubjectStudyLevels");

            migrationBuilder.DropTable(
                name: "CompanySubscription");

            migrationBuilder.DropTable(
                name: "CourseInvites");

            migrationBuilder.DropTable(
                name: "SubjectStudyLevelSetups");

            migrationBuilder.DropTable(
                name: "SubscriptionFeatures");

            migrationBuilder.DropTable(
                name: "TutorAvailabilities");

            migrationBuilder.DropTable(
                name: "TutorSubscription");

            migrationBuilder.DropTable(
                name: "CompanySubjects");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Features");

            migrationBuilder.DropTable(
                name: "Subscriptions");

            migrationBuilder.DropIndex(
                name: "IX_StripePlans_SubscriptionId",
                table: "StripePlans");

            migrationBuilder.DropIndex(
                name: "IX_Companys_AdminUserId",
                table: "Companys");

            migrationBuilder.DropIndex(
                name: "IX_Companys_StripePlanId",
                table: "Companys");

            migrationBuilder.DropIndex(
                name: "IX_ClassSessions_CourseId",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "FreeDays",
                table: "StripePlans");

            migrationBuilder.DropColumn(
                name: "SubscriptionId",
                table: "StripePlans");

            migrationBuilder.DropColumn(
                name: "ActualEndDate",
                table: "CompanyTutors");

            migrationBuilder.DropColumn(
                name: "ActualStartDate",
                table: "CompanyTutors");

            migrationBuilder.DropColumn(
                name: "PreferredEndDate",
                table: "CompanyTutors");

            migrationBuilder.DropColumn(
                name: "PreferredStartDate",
                table: "CompanyTutors");

            migrationBuilder.DropColumn(
                name: "AddressLine1",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "AddressLine2",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "AdminUserId",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "EmailAddress",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "InitialRegistrationComplete",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "InitialRegistrationStep",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "LastTimeStripeSubscriptionChecked",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "MarketingAccepted",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "MobileNumber",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "PaymentAddressLine1",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "PaymentPostcode",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "Postcode",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "ProfileImageFileLocation",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "ProfileImageFileName",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "PromoCode",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "RegistrationNo",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "StripeConnectAccountId",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "StripeConnectBankAccountId",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "StripeCustomerId",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "StripePlanId",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "StripeSubscriptionId",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "TelephoneNumber",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "TermsAndConditionsAccepted",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "UrlSlug",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "WhatWeDo",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "WhoWeAre",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "WhyChooseUs",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "WhyWeDoIt",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "ClassSessions");

        }

        private void ResetTutorsStripePlansToStarter(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                -- Set StripePlan Subscription to Starter for all Tutors (we dont have their historic details as per UP migration overwrite of their StripePlanId)
                Update Tutors Set StripePlanId = '81070046-8DC3-4CA9-3129-08D7E6C57421'
            ";
            migrationBuilder.Sql(sqlStatement);
        }

        private void NullifyPrivateTutorStripePlanSubscriptionId(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                -- Set StripePlan Subscription to null for PrivateTutorPlan 
                Update StripePlans Set SubscriptionId = null where StripePlanId = '81070046-8DC3-4CA9-3129-08D7E6C57421' 
            ";
            migrationBuilder.Sql(sqlStatement);
        }

        private void DeleteThe4NewStripePlans(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                Delete from StripePlans Where StripePlanId In ('1B503C8E-972E-4C5F-BB81-69E74DFDF947', 'FAE8397A-98CC-4CDA-8865-BDF5E279EB96', '35612992-A2CB-45AE-A9E9-433F928DB119', '058C4FDC-43FE-410F-87C2-13EDDF96F2E2');
            ";
            migrationBuilder.Sql(sqlStatement);
        }

    }
}
