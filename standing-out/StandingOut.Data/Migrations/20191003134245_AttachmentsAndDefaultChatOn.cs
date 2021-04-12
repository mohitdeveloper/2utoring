using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AttachmentsAndDefaultChatOn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasEmailAttachment",
                table: "ClassSessions",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "ChatActive",
                table: "ClassSessions",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "ChatActive",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "ChatActive",
                table: "SessionGroups",
                nullable: false,
                defaultValue: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasEmailAttachment",
                table: "ClassSessions");

            migrationBuilder.AlterColumn<bool>(
                name: "ChatActive",
                table: "ClassSessions",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "ChatActive",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "ChatActive",
                table: "SessionGroups",
                nullable: false,
                defaultValue: false);
        }
    }
}
