using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorDbsFile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DbsCertificateFileLocation",
                table: "Tutors",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DbsCertificateFileName",
                table: "Tutors",
                maxLength: 2000,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DbsCertificateFileLocation",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "DbsCertificateFileName",
                table: "Tutors");
        }
    }
}
