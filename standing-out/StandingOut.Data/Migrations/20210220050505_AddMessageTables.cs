using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddMessageTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NotificationMessages",
                columns: table => new
                {
                    NotificationMessageId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Heading = table.Column<string>(nullable: true),
                    Body = table.Column<string>(nullable: true),
                    SetNo = table.Column<int>(nullable: false),
                    SequenceNo = table.Column<int>(nullable: false),
                    CanDelete = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationMessages", x => x.NotificationMessageId);
                });

            migrationBuilder.CreateTable(
                name: "PageNotificationMessages",
                columns: table => new
                {
                    PageNotificationMessageId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    NotificationMessageId = table.Column<Guid>(nullable: false),
                    PageName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageNotificationMessages", x => x.PageNotificationMessageId);
                });

            migrationBuilder.CreateTable(
                name: "RoleTypeNotificationMessages",
                columns: table => new
                {
                    RoleTypeNotificationMessageId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    NotificationMessageId = table.Column<Guid>(nullable: false),
                    RoleType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleTypeNotificationMessages", x => x.RoleTypeNotificationMessageId);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionNotificationMessages",
                columns: table => new
                {
                    SubscriptionNotificationMessageId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    SubscriptionId = table.Column<Guid>(nullable: false),
                    NotificationMessageId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionNotificationMessages", x => x.SubscriptionNotificationMessageId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationMessages");

            migrationBuilder.DropTable(
                name: "PageNotificationMessages");

            migrationBuilder.DropTable(
                name: "RoleTypeNotificationMessages");

            migrationBuilder.DropTable(
                name: "SubscriptionNotificationMessages");
        }
    }
}
