using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class TutorJoiningCompany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddressLine1",
                table: "Tutors",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BankAccountNumber",
                table: "Tutors",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BankSortCode",
                table: "Tutors",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostCode",
                table: "Tutors",
                maxLength: 10,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddressLine1",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "BankAccountNumber",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "BankSortCode",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "PostCode",
                table: "Tutors");
        }
    }
}
