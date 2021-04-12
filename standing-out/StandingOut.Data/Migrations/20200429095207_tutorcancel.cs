using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorcancel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TutorCancelAccountReason",
                table: "Tutors",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TutorCancelAccountReasonDescription",
                table: "Tutors",
                maxLength: 1000,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TutorCancelAccountReason",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "TutorCancelAccountReasonDescription",
                table: "Tutors");
        }
    }
}
