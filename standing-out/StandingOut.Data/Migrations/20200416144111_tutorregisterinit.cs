using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorregisterinit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SubHeader",
                table: "Tutors",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 250);

            migrationBuilder.AddColumn<bool>(
                name: "DbsAdminApproved",
                table: "Tutors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DbsCertificateNumber",
                table: "Tutors",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasDbsCheck",
                table: "Tutors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ProfileHowITeach",
                table: "Tutors",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageFileLocation",
                table: "Tutors",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageFileName",
                table: "Tutors",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileTeachingExperiance",
                table: "Tutors",
                maxLength: 2000,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DbsAdminApproved",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "DbsCertificateNumber",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "HasDbsCheck",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ProfileHowITeach",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ProfileImageFileLocation",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ProfileImageFileName",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ProfileTeachingExperiance",
                table: "Tutors");

            migrationBuilder.AlterColumn<string>(
                name: "SubHeader",
                table: "Tutors",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 2000);
        }
    }
}
