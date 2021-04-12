using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddIPAndUniqueNumberColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IPAddress",
                table: "Courses",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UniqueNumber",
                table: "Courses",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IPAddress",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "UniqueNumber",
                table: "Courses");
        }
    }
}
