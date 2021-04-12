using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class groupvideopermissions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "GroupAudioEnabled",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "GroupRoomJoinEnabled",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "GroupVideoEnabled",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GroupAudioEnabled",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "GroupRoomJoinEnabled",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "GroupVideoEnabled",
                table: "SessionAttendees");
        }
    }
}
