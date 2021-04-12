using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class ChatPermissions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ChatActive",
                table: "SessionGroups",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ChatActive",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ChatActive",
                table: "ClassSessions",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChatActive",
                table: "SessionGroups");

            migrationBuilder.DropColumn(
                name: "ChatActive",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "ChatActive",
                table: "ClassSessions");
        }
    }
}
