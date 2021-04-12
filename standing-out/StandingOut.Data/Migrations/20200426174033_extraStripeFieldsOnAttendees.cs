using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class extraStripeFieldsOnAttendees : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TutorPaid",
                table: "SessionAttendees",
                nullable: false,
                oldClrType: typeof(bool));

            migrationBuilder.AddColumn<string>(
                name: "StripePayoutError",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TutorPaymentFailureNote",
                table: "SessionAttendees",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TutorStripePayoutId",
                table: "SessionAttendees",
                maxLength: 250,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StripePayoutError",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "TutorPaymentFailureNote",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "TutorStripePayoutId",
                table: "SessionAttendees");

            migrationBuilder.AlterColumn<bool>(
                name: "TutorPaid",
                table: "SessionAttendees",
                nullable: false,
                oldClrType: typeof(int));
        }
    }
}
