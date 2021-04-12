using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class paymentFees2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StandingOutActualCut",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "StandingOutPercentageCut",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "TutorPaid",
                table: "ClassSessions");

            migrationBuilder.AddColumn<decimal>(
                name: "AmountCharged",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "StandingOutActualCut",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "StandingOutPercentageCut",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "TutorPaid",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AmountCharged",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "StandingOutActualCut",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "StandingOutPercentageCut",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "TutorPaid",
                table: "SessionAttendees");

            migrationBuilder.AddColumn<decimal>(
                name: "StandingOutActualCut",
                table: "ClassSessions",
                type: "decimal(13,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "StandingOutPercentageCut",
                table: "ClassSessions",
                type: "decimal(13,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "TutorPaid",
                table: "ClassSessions",
                nullable: false,
                defaultValue: false);
        }
    }
}
