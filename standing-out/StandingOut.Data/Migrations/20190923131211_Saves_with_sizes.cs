using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class Saves_with_sizes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SizeX",
                table: "SessionWhiteBoardSave",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SizeY",
                table: "SessionWhiteBoardSave",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SizeX",
                table: "SessionWhiteBoardSave");

            migrationBuilder.DropColumn(
                name: "SizeY",
                table: "SessionWhiteBoardSave");
        }
    }
}
