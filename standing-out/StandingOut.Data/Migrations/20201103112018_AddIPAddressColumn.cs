using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddIPAddressColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "StandingOutPercentageCut",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");

            migrationBuilder.AlterColumn<decimal>(
                name: "StandingOutActualCut",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");

            migrationBuilder.AddColumn<string>(
                name: "IPAddress",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IPAddress",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<decimal>(
                name: "StandingOutPercentageCut",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "StandingOutActualCut",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)",
                oldNullable: true);
        }
    }
}
