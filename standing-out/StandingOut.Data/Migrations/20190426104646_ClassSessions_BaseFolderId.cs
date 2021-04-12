using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class ClassSessions_BaseFolderId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BaseStudentDirectoryId",
                table: "ClassSessions",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SessionDirectoryId",
                table: "ClassSessions",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BaseStudentDirectoryId",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "SessionDirectoryId",
                table: "ClassSessions");
        }
    }
}
