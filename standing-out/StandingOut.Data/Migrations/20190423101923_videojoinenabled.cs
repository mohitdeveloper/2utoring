using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class videojoinenabled : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "RoomJoinEnabled",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RoomJoinEnabled",
                table: "SessionAttendees");
        }
    }
}
