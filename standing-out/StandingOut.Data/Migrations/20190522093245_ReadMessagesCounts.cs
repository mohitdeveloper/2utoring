using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class ReadMessagesCounts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "SessionMessages");

            migrationBuilder.AddColumn<int>(
                name: "ReadMessages",
                table: "SessionOneToOneChatInstanceUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReadMessagesAll",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReadMessagesGroup",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReadMessages",
                table: "SessionOneToOneChatInstanceUsers");

            migrationBuilder.DropColumn(
                name: "ReadMessagesAll",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "ReadMessagesGroup",
                table: "SessionAttendees");

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "SessionMessages",
                nullable: false,
                defaultValue: false);
        }
    }
}
