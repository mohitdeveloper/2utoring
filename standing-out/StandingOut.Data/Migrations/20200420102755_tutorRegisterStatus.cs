using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorRegisterStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageDirectory",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ImageName",
                table: "Tutors");

            migrationBuilder.AlterColumn<string>(
                name: "SubHeader",
                table: "Tutors",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2000);

            migrationBuilder.AlterColumn<string>(
                name: "Header",
                table: "Tutors",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 250);

            migrationBuilder.AddColumn<bool>(
                name: "InitialRegistrationComplete",
                table: "Tutors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "InitialRegistrationStep",
                table: "Tutors",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InitialRegistrationComplete",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "InitialRegistrationStep",
                table: "Tutors");

            migrationBuilder.AlterColumn<string>(
                name: "SubHeader",
                table: "Tutors",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Header",
                table: "Tutors",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 250,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageDirectory",
                table: "Tutors",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageName",
                table: "Tutors",
                maxLength: 250,
                nullable: true);
        }
    }
}
