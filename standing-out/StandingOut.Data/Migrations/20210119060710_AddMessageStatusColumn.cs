using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddMessageStatusColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DbsApprovedMessageRead",
                table: "Tutors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DbsNotApprovedMessageRead",
                table: "Tutors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DbsStatusMessageRead",
                table: "Tutors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ProfileMessageRead",
                table: "Tutors",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DbsApprovedMessageRead",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "DbsNotApprovedMessageRead",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "DbsStatusMessageRead",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ProfileMessageRead",
                table: "Tutors");
        }
    }
}
