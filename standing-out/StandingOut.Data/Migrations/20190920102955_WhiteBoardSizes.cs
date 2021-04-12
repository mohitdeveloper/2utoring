using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class WhiteBoardSizes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentCanvas",
                table: "SessionWhiteBoards");

            migrationBuilder.AddColumn<int>(
                name: "SizeX",
                table: "SessionWhiteBoards",
                nullable: false,
                defaultValue: 300);

            migrationBuilder.AddColumn<int>(
                name: "SizeY",
                table: "SessionWhiteBoards",
                nullable: false,
                defaultValue: 300);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SizeX",
                table: "SessionWhiteBoards");

            migrationBuilder.DropColumn(
                name: "SizeY",
                table: "SessionWhiteBoards");

            migrationBuilder.AddColumn<string>(
                name: "CurrentCanvas",
                table: "SessionWhiteBoards",
                maxLength: 1000,
                nullable: true);
        }
    }
}
