using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AllGroupBoardPermissions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllWhiteboardActive",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "GroupWhiteboardActive",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllWhiteboardActive",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "GroupWhiteboardActive",
                table: "SessionAttendees");
        }
    }
}
