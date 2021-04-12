using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class googlesettings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GoogleClientId",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "746222592209-bb3t6c8dphe8smldllj7vqp67b62fo8k.apps.googleusercontent.com");

            migrationBuilder.AddColumn<string>(
                name: "GoogleClientSecret",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "POmIUWgC8iStQGfkuhdUeAji");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GoogleClientId",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "GoogleClientSecret",
                table: "Settings");
        }
    }
}
