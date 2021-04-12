using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class sendgridemailfrom : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SendGridFromEmail",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "support@iostudios.co.uk");

            migrationBuilder.AddColumn<string>(
                name: "EmailContents",
                table: "ClassSessions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SendGridFromEmail",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "EmailContents",
                table: "ClassSessions");
        }
    }
}
