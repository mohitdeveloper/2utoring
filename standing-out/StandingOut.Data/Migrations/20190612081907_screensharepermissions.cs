using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class screensharepermissions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "GroupScreenShareEnabled",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ScreenShareEnabled",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GroupScreenShareEnabled",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "ScreenShareEnabled",
                table: "SessionAttendees");
        }
    }
}
