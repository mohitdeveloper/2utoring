using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class TutorChatPositions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReadMessagesTutor",
                table: "SessionGroups",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReadMessagesTutor",
                table: "ClassSessions",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReadMessagesTutor",
                table: "SessionGroups");

            migrationBuilder.DropColumn(
                name: "ReadMessagesTutor",
                table: "ClassSessions");
        }
    }
}
