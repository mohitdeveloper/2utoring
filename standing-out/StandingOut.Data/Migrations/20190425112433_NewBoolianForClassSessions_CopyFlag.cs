using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class NewBoolianForClassSessions_CopyFlag : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SessionAttendeeDirectoryId",
                table: "SessionAttendees",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MasterFilesCopied",
                table: "ClassSessions",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SessionAttendeeDirectoryId",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "MasterFilesCopied",
                table: "ClassSessions");
        }
    }
}
