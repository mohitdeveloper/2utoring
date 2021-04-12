using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class classSessionGoogleAccount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "RequiresGoogleAccount",
                table: "ClassSessions",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql("UPDATE ClassSessions set RequiresGoogleAccount = 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequiresGoogleAccount",
                table: "ClassSessions");
        }
    }
}
