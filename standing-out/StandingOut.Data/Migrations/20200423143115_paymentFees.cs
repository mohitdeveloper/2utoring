using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class paymentFees : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        protected override void Down(MigrationBuilder migrationBuilder)
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
        }
    }
}
