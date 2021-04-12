using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddColInWebContactTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Days",
                table: "WebsiteContacts",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SearchFor",
                table: "WebsiteContacts",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Time",
                table: "WebsiteContacts",
                maxLength: 10,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Days",
                table: "WebsiteContacts");

            migrationBuilder.DropColumn(
                name: "SearchFor",
                table: "WebsiteContacts");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "WebsiteContacts");
        }
    }
}
