using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class sessionDir : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SessionDirectoryName",
                table: "ClassSessions",
                maxLength: 500,
                nullable: false,
                defaultValue: "19-03-2019Geography-Key-Stage-1-Laura-Mear");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SessionDirectoryName",
                table: "ClassSessions");
        }
    }
}
