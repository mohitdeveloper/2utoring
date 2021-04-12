using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorApprovalStatuses : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DbsAdminApproved",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ProfileAuthorized",
                table: "Tutors");

            migrationBuilder.AddColumn<int>(
                name: "DbsApprovalStatus",
                table: "Tutors",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProfileApprovalStatus",
                table: "Tutors",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DbsApprovalStatus",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ProfileApprovalStatus",
                table: "Tutors");

            migrationBuilder.AddColumn<bool>(
                name: "DbsAdminApproved",
                table: "Tutors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ProfileAuthorized",
                table: "Tutors",
                nullable: false,
                defaultValue: false);
        }
    }
}
