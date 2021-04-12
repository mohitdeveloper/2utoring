using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddIDVerificationtStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IDVerificationtStatus",
                table: "Tutors",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IDVerificationtStatus",
                table: "Companys",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IDVerificationtStatus",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "IDVerificationtStatus",
                table: "Companys");
        }
    }
}
