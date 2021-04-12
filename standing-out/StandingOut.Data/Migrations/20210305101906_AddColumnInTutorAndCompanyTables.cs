using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddColumnInTutorAndCompanyTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ProfileFieldsAllComplete",
                table: "Tutors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ProfileSetupStarted",
                table: "Tutors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ProfileFieldsAllComplete",
                table: "Companys",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ProfileSetupStarted",
                table: "Companys",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileFieldsAllComplete",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ProfileSetupStarted",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ProfileFieldsAllComplete",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "ProfileSetupStarted",
                table: "Companys");
        }
    }
}
