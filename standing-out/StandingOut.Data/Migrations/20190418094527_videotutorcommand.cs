using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class videotutorcommand : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AudioEnabled",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "VideoEnabled",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AudioEnabled",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "VideoEnabled",
                table: "SessionAttendees");
        }
    }
}
