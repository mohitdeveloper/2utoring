using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class SystemToolWarnings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ExitWarning",
                table: "SystemTools",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql("UPDATE SystemTools SET ExitWarning = 1 WHERE Name IN ('Whiteboard', 'File')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExitWarning",
                table: "SystemTools");
        }
    }
}
