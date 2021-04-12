using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class NewFolderForClassSessions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SessionAttendeeDirectoryName",
                table: "SessionAttendees",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MasterStudentDirectoryName",
                table: "ClassSessions",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SessionAttendeeDirectoryName",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "MasterStudentDirectoryName",
                table: "ClassSessions");
        }
    }
}
